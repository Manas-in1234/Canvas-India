import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';
import { CartService } from '../cart/cart.service.js';
import { InventoryService } from '../../inventory/inventory.service.js';
import { AuditService } from '../../audit/audit.service.js';
import { DiscountsService } from '../../growth/discounts/discounts.service.js';
import { AbandonedCartsService } from '../../growth/abandoned-carts/abandoned-carts.service.js';

/** Sends a refund to the payment gateway. Wired up per request in the worker, where the gateway keys live. */
export type RefundGateway = (
  gatewayPaymentId: string,
  amountPaise: number,
  notes: Record<string, string>,
) => Promise<{ id: string; status: string }>;

@Injectable()
export class OrdersService {
  private refundGateway?: RefundGateway;

  setRefundGateway(gateway: RefundGateway) {
    this.refundGateway = gateway;
  }

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

  /** Admin accepts a confirmed order: production starts, so customers can no longer cancel it. */
  async accept(id: string, actingAdminId?: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    if (order.orderStatus !== 'CONFIRMED' && order.orderStatus !== 'PAID') {
      throw new BadRequestException(`Cannot accept an order in status ${order.orderStatus}`);
    }
    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        orderStatus: 'PROCESSING',
        events: { create: { type: 'order.accepted', message: 'Order accepted - production started' } },
      },
    });
    await this.auditService.record({ adminUserId: actingAdminId, action: 'ORDER_ACCEPTED', entityType: 'Order', entityId: id });
    return updated;
  }

  /** Customers may cancel only until production starts (before the admin accepts) and before dispatch. */
  isCustomerCancellable(order: { orderStatus: string; shippingStatus: string }) {
    return ['PENDING_PAYMENT', 'PAID', 'CONFIRMED'].includes(order.orderStatus) && order.shippingStatus === 'NOT_SHIPPED';
  }

  async cancelByCustomer(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (!this.isCustomerCancellable(order)) {
      throw new BadRequestException('This order can no longer be cancelled because production has started.');
    }
    return this.cancel(orderId, undefined, 'Order cancelled by the customer');
  }

  async cancel(id: string, actingAdminId?: string, message = 'Order cancelled') {
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
        events: { create: { type: 'order.cancelled', message } },
      },
    });

    await this.auditService.record({
      adminUserId: actingAdminId,
      action: 'ORDER_CANCELLED',
      entityType: 'Order',
      entityId: id,
    });

    // Cancellation policy: an eligible cancellation initiates a refund to the original payment method.
    await this.autoRefundCancelledOrder(id);

    return updated;
  }

  /**
   * Refunds money to the customer's original payment method (Razorpay). Never refunds more than
   * was paid, counting earlier refunds, so repeating the call cannot pay out twice.
   */
  async refund(id: string, amount: string, reason?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { payments: { include: { transactions: true } } },
    });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    const payment = order.payments.find(
      (p) => p.provider === 'RAZORPAY' && (p.status === 'PAID' || p.status === 'PARTIALLY_REFUNDED') && p.providerRef,
    );
    if (!payment) {
      throw new BadRequestException(
        'There is no online payment to refund for this order (cash on delivery and fully discounted orders have nothing to refund).',
      );
    }
    if (!this.refundGateway) {
      throw new NotImplementedException('The payment gateway is not configured for refunds');
    }

    const requested = new Prisma.Decimal(amount);
    if (requested.lessThanOrEqualTo(0)) {
      throw new BadRequestException('Refund amount must be greater than zero');
    }
    const alreadyRefunded = payment.transactions
      .filter((t) => t.type === 'REFUND')
      .reduce((sum, t) => sum.plus(new Prisma.Decimal(((t.rawPayload as { amount?: string } | null)?.amount) ?? 0)), new Prisma.Decimal(0));
    const remaining = new Prisma.Decimal(payment.amount).minus(alreadyRefunded);
    if (requested.greaterThan(remaining)) {
      throw new BadRequestException(`Cannot refund more than the remaining ₹${remaining.toFixed(2)} paid for this order`);
    }

    const result = await this.refundGateway(payment.providerRef!, Math.round(requested.times(100).toNumber()), {
      order: order.orderNumber,
      reason: (reason ?? 'Refund').slice(0, 200),
    });

    const refundedTotal = alreadyRefunded.plus(requested);
    const fully = refundedTotal.greaterThanOrEqualTo(payment.amount);
    const status = fully ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
    await this.prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.create({
        data: {
          paymentId: payment.id,
          type: 'REFUND',
          status: result.status ?? 'created',
          rawPayload: { amount: requested.toFixed(2), refundId: result.id, reason: reason ?? null },
        },
      });
      await tx.payment.update({ where: { id: payment.id }, data: { status } });
      await tx.order.update({
        where: { id },
        data: {
          paymentStatus: status,
          events: {
            create: {
              type: 'order.refunded',
              message: `Refund of ₹${requested.toFixed(2)} sent to the original payment method (may take 5-10 business days to show)`,
              metadata: { refundId: result.id, amount: requested.toFixed(2) },
            },
          },
        },
      });
    });
    return { refundId: result.id, amount: requested.toFixed(2), status };
  }

  /** Refunds whatever is still unrefunded on a cancelled order; a failure is logged on the order, never thrown. */
  private async autoRefundCancelledOrder(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { payments: { include: { transactions: true } } },
      });
      const payment = order?.payments.find(
        (p) => p.provider === 'RAZORPAY' && (p.status === 'PAID' || p.status === 'PARTIALLY_REFUNDED') && p.providerRef,
      );
      if (!order || !payment) return;
      const done = payment.transactions
        .filter((t) => t.type === 'REFUND')
        .reduce((sum, t) => sum.plus(new Prisma.Decimal(((t.rawPayload as { amount?: string } | null)?.amount) ?? 0)), new Prisma.Decimal(0));
      const left = new Prisma.Decimal(payment.amount).minus(done);
      if (left.lessThanOrEqualTo(0)) return;
      await this.refund(id, left.toFixed(2), 'Order cancelled');
    } catch (error) {
      await this.prisma.orderEvent
        .create({
          data: {
            orderId: id,
            type: 'refund.failed',
            message: `Automatic refund could not be completed (${error instanceof Error ? error.message : 'unknown error'}). Please refund this order manually.`,
          },
        })
        .catch(() => undefined);
    }
  }

  async addNote(orderId: string, note: string, adminUserId?: string) {
    return this.prisma.orderNote.create({ data: { orderId, note, adminUserId } });
  }

  private async generateOrderNumber(): Promise<string> {
    const count = await this.prisma.order.count();
    return `CC${10000 + count + 1}`;
  }
}

