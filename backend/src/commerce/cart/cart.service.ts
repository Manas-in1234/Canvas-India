import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';
import { PricingService } from '../../catalog/pricing/pricing.service.js';
import { DiscountsService } from '../../growth/discounts/discounts.service.js';

export interface PricedCart {
  id: string;
  customerId: string | null;
  status: string;
  items: {
    id: string;
    variantId: string;
    designVersionId: string | null;
    quantity: number;
    unitPrice: Prisma.Decimal;
    lineTotal: Prisma.Decimal;
  }[];
  subtotal: Prisma.Decimal;
  discount: Prisma.Decimal;
  discountCode: string | null;
  total: Prisma.Decimal;
}

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingService: PricingService,
    private readonly discountsService: DiscountsService,
  ) {}

  async getOrCreateForCustomer(customerId: string) {
    const existing = await this.prisma.cart.findFirst({
      where: { customerId, status: 'ACTIVE' },
    });
    if (existing) return existing;

    return this.prisma.cart.create({ data: { customerId, status: 'ACTIVE' } });
  }

  async addItem(
    cartId: string,
    variantId: string,
    quantity: number,
    configuration?: Record<string, unknown>,
    designVersionId?: string,
  ) {
    const existingItem = designVersionId
      ? null
      : await this.prisma.cartItem.findFirst({ where: { cartId, variantId, designVersionId: null } });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: { cartId, variantId, quantity, configuration: configuration as never, designVersionId },
    });
  }

  removeItem(cartItemId: string) {
    return this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async applyDiscount(cartId: string, code: string): Promise<PricedCart> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: { include: { categories: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    let subtotal = new Prisma.Decimal(0);
    const itemContexts = [];

    for (const item of cart.items) {
      const breakdown = await this.pricingService.calculateVariantPrice(item.variantId, item.quantity);
      subtotal = subtotal.plus(breakdown.lineTotal);
      itemContexts.push({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: breakdown.unitPrice.toNumber(),
        productId: item.variant.productId,
        categoryIds: item.variant.product.categories.map((c) => c.categoryId),
      });
    }

    // Validate discount against cart items and customer
    await this.discountsService.validateDiscount({
      code,
      customerId: cart.customerId ?? undefined,
      cartId: cart.id,
      items: itemContexts,
      subtotal: subtotal.toNumber(),
    });

    await this.prisma.cart.update({
      where: { id: cartId },
      data: { discountCode: code.trim().toUpperCase() },
    });

    return this.priceCart(cartId);
  }

  async removeDiscount(cartId: string): Promise<PricedCart> {
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { discountCode: null },
    });

    return this.priceCart(cartId);
  }

  /**
   * Recomputes every line and the subtotal server-side (scope §45: never
   * trust a frontend-submitted total). Applies discount if code present on cart.
   */
  async priceCart(cartId: string): Promise<PricedCart> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: { include: { categories: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    let subtotal = new Prisma.Decimal(0);
    const items = [];
    const itemContexts = [];

    for (const item of cart.items) {
      const breakdown = await this.pricingService.calculateVariantPrice(item.variantId, item.quantity);
      subtotal = subtotal.plus(breakdown.lineTotal);
      items.push({
        id: item.id,
        variantId: item.variantId,
        designVersionId: item.designVersionId,
        quantity: item.quantity,
        unitPrice: breakdown.unitPrice,
        lineTotal: breakdown.lineTotal,
      });
      itemContexts.push({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: breakdown.unitPrice.toNumber(),
        productId: item.variant?.productId,
        categoryIds: item.variant?.product?.categories?.map((c) => c.categoryId) ?? [],
      });
    }

    let discount = new Prisma.Decimal(0);

    if (cart.discountCode && items.length > 0) {
      try {
        const validation = await this.discountsService.validateDiscount({
          code: cart.discountCode,
          customerId: cart.customerId ?? undefined,
          cartId: cart.id,
          items: itemContexts,
          subtotal: subtotal.toNumber(),
        });
        discount = validation.discountAmount;
      } catch {
        // If discount becomes invalid (e.g. subtotal reduced below minOrderSubtotal), discount is 0
        discount = new Prisma.Decimal(0);
      }
    }

    const total = Prisma.Decimal.max(new Prisma.Decimal(0), subtotal.minus(discount));

    return {
      id: cart.id,
      customerId: cart.customerId,
      status: cart.status,
      items,
      subtotal,
      discount,
      discountCode: cart.discountCode,
      total,
    };
  }
}
