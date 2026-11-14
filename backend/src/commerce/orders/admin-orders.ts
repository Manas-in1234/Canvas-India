import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma, type PrismaClient } from '../../generated/prisma/client.js';

export const visibilityEvents = ['order.hidden', 'order.shown', 'order.archived', 'order.restored'];
export function orderVisibility(events: { type: string }[]) {
  const latest = events[0]?.type;
  return latest === 'order.archived' ? 'ARCHIVED' : latest === 'order.hidden' ? 'HIDDEN' : 'VISIBLE';
}

function stringField(value: unknown, max: number, required = true) {
  if (typeof value !== 'string' || value.trim().length > max || (required && !value.trim())) {
    throw new BadRequestException('Enter valid order details.');
  }
  return value.trim();
}

function orderDetails(input: unknown, addressRequired = true) {
  const body = (input ?? {}) as Record<string, unknown>;
  const shippingAddress = (body.shippingAddress ?? {}) as Record<string, unknown>;
  return {
    address: !addressRequired && body.shippingAddress === undefined ? undefined : {
      name: stringField(shippingAddress.name, 150),
      line1: stringField(shippingAddress.line1, 250),
      line2: stringField(shippingAddress.line2 ?? '', 250, false) || null,
      city: stringField(shippingAddress.city, 100),
      state: stringField(shippingAddress.state, 100),
      postalCode: stringField(shippingAddress.postalCode, 24),
      country: stringField(shippingAddress.country, 80),
      phone: stringField(shippingAddress.phone ?? '', 40, false) || null,
    },
    note: stringField(body.note ?? '', 2000, false),
    body,
  };
}

async function priceItems(tx: Prisma.TransactionClient, input: unknown) {
  if (!Array.isArray(input) || !input.length || input.length > 100) {
    throw new BadRequestException('Add between 1 and 100 order lines.');
  }
  const items = input.map(row => {
    const productId = stringField(row?.productId, 64);
    const quantity = row?.quantity;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) throw new BadRequestException('Each quantity must be between 1 and 999.');
    return { productId, quantity: quantity as number };
  });
  const products = await tx.product.findMany({ where: { id: { in: items.map(i => i.productId) }, deletedAt: null, status: 'ACTIVE' },
    select: { id: true, name: true, slug: true, basePrice: true } });
  const productsById = new Map(products.map(product => [product.id, product]));
  const lines = items.map(item => {
    const product = productsById.get(item.productId);
    if (!product) throw new BadRequestException('Choose an active catalog product for each line.');
    return { productNameSnapshot: product.name, variantSnapshot: { sku: product.slug, options: [] },
      configurationSnapshot: { manualProductId: product.id }, priceSnapshot: product.basePrice, quantity: item.quantity };
  });
  const subtotal = lines.reduce((sum, line) => sum.plus(line.priceSnapshot.times(line.quantity)), new Prisma.Decimal(0));
  if (subtotal.greaterThan(9999999999.99)) throw new BadRequestException('The order total is too large.');
  return { lines, subtotal };
}

export class AdminOrders {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: unknown, adminUserId: string) {
    const { address, note, body } = orderDetails(input);
    const customerId = stringField(body.customerId, 64);
    const requestId = stringField(body.requestId, 64);
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(requestId)) {
      throw new BadRequestException('Invalid order request.');
    }
    const orderNumber = 'ADM-' + requestId;
    const findExisting = () => this.prisma.order.findUnique({ where: { orderNumber }, select: { id: true, customerId: true } });
    const existing = await findExisting();
    if (existing?.customerId === customerId) return { id: existing.id };
    if (existing) throw new ConflictException('This order request was already used.');
    return this.prisma.$transaction(async tx => {
      if (!await tx.customer.findUnique({ where: { id: customerId }, select: { id: true } })) throw new NotFoundException('Customer not found.');
      const { lines, subtotal } = await priceItems(tx, body.items);
      return tx.order.create({
        data: { orderNumber, customerId, subtotal, total: subtotal, items: { create: lines },
          addresses: { create: { ...address!, type: 'SHIPPING' } },
          notes: note ? { create: { note, adminUserId } } : undefined,
          events: { create: { type: 'order.manual_created', message: 'Draft order created by an admin', metadata: { adminUserId } } },
        },
        select: { id: true },
      });
    }).catch(async error => {
      if (error?.code === 'P2002') {
        const saved = await findExisting();
        if (saved?.customerId === customerId) return { id: saved.id };
      }
      throw error;
    });
  }

  async edit(id: string, input: unknown, adminUserId: string) {
    const { address, note, body } = orderDetails(input, false);
    return this.prisma.$transaction(async tx => {
      const order = await tx.order.findUnique({ where: { id }, include: {
        addresses: { where: { type: 'SHIPPING' }, take: 1 },
        events: { where: { type: { in: [...visibilityEvents, 'order.manual_created'] } }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }] },
      } });
      if (!order) throw new NotFoundException('Order not found.');
      if (orderVisibility(order.events.filter(event => visibilityEvents.includes(event.type))) === 'ARCHIVED') {
        throw new ConflictException('Restore this order before editing it.');
      }
      const replace = body.items !== undefined;
      if (replace && !(order.orderStatus === 'DRAFT' && order.paymentStatus === 'PENDING' && order.events.some(e => e.type === 'order.manual_created'))) {
        throw new ConflictException('Only a manual draft’s items can be changed.');
      }
      if (address && order.shippingStatus !== 'NOT_SHIPPED') throw new ConflictException('The delivery address can only be changed before shipping.');
      if (replace || address) {
        const locked = await tx.order.updateMany({ where: { id, updatedAt: order.updatedAt, shippingStatus: 'NOT_SHIPPED' }, data: { updatedAt: new Date() } });
        if (!locked.count) throw new ConflictException('The order changed. Reload it and try again.');
        if (address) {
          const savedAddress = order.addresses[0];
          if (savedAddress) await tx.orderAddress.update({ where: { id: savedAddress.id }, data: address });
          else await tx.orderAddress.create({ data: { ...address, orderId: id, type: 'SHIPPING' } });
        }
      }
      if (replace) {
        const { lines, subtotal } = await priceItems(tx, body.items);
        await tx.order.update({ where: { id }, data: { subtotal, total: subtotal, items: { deleteMany: {}, create: lines } } });
      }
      if (note) await tx.orderNote.create({ data: { orderId: id, note, adminUserId } });
      return tx.orderEvent.create({ data: { orderId: id, type: 'order.admin_edited', message: 'Order details updated by an admin', metadata: { adminUserId } } });
    });
  }

  async setVisibility(id: string, action: unknown, adminUserId: string) {
    const actions = { hide: 'order.hidden', show: 'order.shown', archive: 'order.archived', restore: 'order.restored' } as const;
    if (typeof action !== 'string' || !Object.hasOwn(actions, action)) throw new BadRequestException('Invalid order action.');
    await this.prisma.$transaction(async tx => {
      const order = await tx.order.findUnique({ where: { id }, select: { updatedAt: true,
        events: { where: { type: { in: visibilityEvents } }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 1 } } });
      if (!order) throw new NotFoundException('Order not found.');
      const current = orderVisibility(order.events);
      if (current === 'ARCHIVED' && action !== 'restore') throw new ConflictException('Restore this order first.');
      const locked = await tx.order.updateMany({ where: { id, updatedAt: order.updatedAt }, data: { updatedAt: new Date() } });
      if (!locked.count) throw new ConflictException('The order changed. Reload it and try again.');
      await tx.orderEvent.create({ data: { orderId: id, type: actions[action as keyof typeof actions],
        message: 'Admin order list action: ' + action, metadata: { adminUserId } } });
    });
  }
}
