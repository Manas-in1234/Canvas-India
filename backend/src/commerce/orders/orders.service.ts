import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';
import { CartService } from '../cart/cart.service.js';
import { InventoryService } from '../../inventory/inventory.service.js';
import { AuditService } from '../../audit/audit.service.js';
import { DiscountsService } from '../../growth/discounts/discounts.service.js';
import { AbandonedCartsService } from '../../growth/abandoned-carts/abandoned-carts.service.js';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly inventoryService: InventoryService,
    private readonly auditService: AuditService,
    private readonly discountsService: DiscountsService,
    private readonly abandonedCartsService: AbandonedCartsService,
  ) {}

  findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { customer: { select: { id: true, name: true } } },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
        addresses: true,
        events: { orderBy: { createdAt: 'asc' } },
        notes: { orderBy: { createdAt: 'desc' } },
        payments: { include: { transactions: true } },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  /**
   * Creates an order from a cart. The cart is repriced server-side (never
   * trusting any client-submitted total, scope §45) and every line is
   * snapshotted onto order_items so later product/price changes cannot alter
   * historical order data (scope §89, §114).
   */
  async createFromCart(customerId: string, cartId: string) {
    const pricedCart = await this.cartService.priceCart(cartId);

    if (pricedCart.customerId !== customerId) {
      throw new BadRequestException('Cart does not belong to this customer');
    }
    if (pricedCart.items.length === 0) {
      throw new BadRequestException('Cannot create an order from an empty cart');
    }

    const variantDetails = await this.prisma.productVariant.findMany({
      where: { id: { in: pricedCart.items.map((i) => i.variantId) } },
      include: { product: true, options: { include: { optionValue: { include: { optionGroup: true } } } } },
    });
    const variantById = new Map(variantDetails.map((v) => [v.id, v]));

    const designVersionIds = pricedCart.items
      .map((i) => i.designVersionId)
      .filter((id): id is string => id !== null);
    const designVersions =
      designVersionIds.length > 0
        ? await this.prisma.designVersion.findMany({ where: { id: { in: designVersionIds } } })
        : [];
    const designVersionById = new Map(designVersions.map((v) => [v.id, v]));

    const orderNumber = await this.generateOrderNumber();

    const order = await this.prisma.$transaction(async (tx) => {
      const eventsToCreate: Prisma.OrderEventCreateWithoutOrderInput[] = [
        { type: 'order.created', message: 'Order created from cart' },
      ];

      if (pricedCart.discountCode && pricedCart.discount.greaterThan(0)) {
        eventsToCreate.push({
          type: 'order.discount_applied',
          message: `Discount '${pricedCart.discountCode}' applied: ₹${pricedCart.discount.toFixed(2)}`,
          metadata: {
            code: pricedCart.discountCode,
            amount: pricedCart.discount.toString(),
          } as Prisma.InputJsonValue,
        });
      }

      const created = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          orderStatus: 'PENDING_PAYMENT',
          paymentStatus: 'PENDING',
          shippingStatus: 'NOT_SHIPPED',
          subtotal: pricedCart.subtotal,
          discount: pricedCart.discount,
          tax: 0,
          shipping: 0,
          total: pricedCart.total,
          items: {
            create: pricedCart.items.map((item) => {
              const variant = variantById.get(item.variantId)!;
              const designVersion = item.designVersionId ? designVersionById.get(item.designVersionId) : undefined;
              return {
                variantId: variant.id,
                productNameSnapshot: variant.product.name,
                variantSnapshot: {
                  sku: variant.sku,
                  options: variant.options.map((o) => ({
                    group: o.optionValue.optionGroup.name,
                    value: o.optionValue.value,
                  })),
                } as Prisma.InputJsonValue,
                priceSnapshot: item.unitPrice,
                configurationSnapshot: Prisma.JsonNull,
                // Frozen copy of the design at purchase time (scope §24, §89, §114) —
                // later edits to the Design/DesignVersion never alter this order.
                designVersionSnapshot: designVersion
                  ? (designVersion.designJson as Prisma.InputJsonValue)
                  : Prisma.JsonNull,
                taxSnapshot: 0,
                quantity: item.quantity,
              };
            }),
          },
          events: {
            create: eventsToCreate,
          },
        },
        include: { items: true },
      });

      if (pricedCart.discountCode && pricedCart.discount.greaterThan(0)) {
        const discountRecord = await tx.discount.findUnique({
          where: { code: pricedCart.discountCode },
        });
        if (discountRecord) {
          await tx.discount.update({
            where: { id: discountRecord.id },
            data: { usageCount: { increment: 1 } },
          });
          await tx.discountRedemption.create({
            data: {
              discountId: discountRecord.id,
              customerId,
              orderId: created.id,
              cartId,
              amount: pricedCart.discount,
            },
          });
        }
      }

      await tx.cart.update({ where: { id: cartId }, data: { status: 'CONVERTED' } });
      await this.abandonedCartsService.markConverted(cartId, tx);

      return created;
    });

    // Reserve inventory for each line (scope §38: Available -> Reserved on payment
    // confirmation; reserved eagerly here since Phase 1 has no live payment gateway yet).
    for (const item of pricedCart.items) {
      await this.inventoryService.reserve(item.variantId, item.quantity, 'Order', order.id);
    }

    return order;
  }

  async cancel(id: string, actingAdminId?: string) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    if (order.orderStatus === 'CANCELLED' || order.orderStatus === 'COMPLETED') {
      throw new BadRequestException(`Cannot cancel an order in status ${order.orderStatus}`);
    }

    for (const item of order.items) {
      if (item.variantId) {
        await this.inventoryService.release(item.variantId, item.quantity, 'Order', order.id);
      }
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        orderStatus: 'CANCELLED',
        events: { create: { type: 'order.cancelled', message: 'Order cancelled' } },
      },
    });

    await this.auditService.record({
      adminUserId: actingAdminId,
      action: 'ORDER_CANCELLED',
      entityType: 'Order',
      entityId: id,
    });

    return updated;
  }

  async refund(_id: string, _amount: string, _reason?: string) {
    throw new NotImplementedException(
      'Refunds require a configured payment gateway adapter; not available until Razorpay credentials are provisioned',
    );
  }
  async addNote(orderId: string, note: string, adminUserId?: string) {
    return this.prisma.orderNote.create({ data: { orderId, note, adminUserId } });
  }

  private async generateOrderNumber(): Promise<string> {
    const count = await this.prisma.order.count();
    return `CC${10000 + count + 1}`;
  }
}

