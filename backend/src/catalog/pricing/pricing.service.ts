import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';

export interface PriceBreakdown {
  basePrice: Prisma.Decimal;
  optionAdjustments: Prisma.Decimal;
  ruleAdjustments: Prisma.Decimal;
  unitPrice: Prisma.Decimal;
  quantity: number;
  lineTotal: Prisma.Decimal;
}

/**
 * Server-authoritative pricing (scope §18-20, §45): the frontend never supplies a
 * trusted total. Given a variant + optional custom-size config, this recomputes
 * the price from base price + option value adjustments + matching pricing rules.
 */
@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateVariantPrice(variantId: string, quantity: number): Promise<PriceBreakdown> {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: { include: { pricingRules: { where: { isActive: true } } } },
        options: { include: { optionValue: true } },
      },
    });

    if (!variant) {
      throw new NotFoundException(`Variant ${variantId} not found`);
    }

    const basePrice = variant.product.basePrice;

    const optionAdjustments = variant.options.reduce(
      (sum, vo) => sum.plus(vo.optionValue.priceAdjustment),
      new Prisma.Decimal(0),
    );

    const now = new Date();
    const applicableRules = variant.product.pricingRules.filter((rule) => {
      if (rule.startDate && rule.startDate > now) return false;
      if (rule.endDate && rule.endDate < now) return false;
      return this.ruleMatches(rule.conditions, variant);
    });

    // Highest priority first; each matching rule adds its adjustment.
    const ruleAdjustments = applicableRules
      .sort((a, b) => b.priority - a.priority)
      .reduce((sum, rule) => sum.plus(rule.adjustment), new Prisma.Decimal(0));

    const unitPrice = basePrice.plus(optionAdjustments).plus(ruleAdjustments);
    const lineTotal = unitPrice.times(quantity);

    return { basePrice, optionAdjustments, ruleAdjustments, unitPrice, quantity, lineTotal };
  }

  /** Custom-size pricing (scope §20): area-based formula, not a per-size SKU. */
  calculateCustomSizePrice(basePricePerUnitArea: Prisma.Decimal, width: number, height: number): Prisma.Decimal {
    const area = new Prisma.Decimal(width).times(height);
    return basePricePerUnitArea.times(area);
  }

  private ruleMatches(
    conditions: Prisma.JsonValue,
    variant: { options: { optionValue: { value: string; optionGroup?: { name: string } } }[] },
  ): boolean {
    if (!conditions || typeof conditions !== 'object' || Array.isArray(conditions)) {
      return false;
    }

    const optionValues = new Set(variant.options.map((o) => o.optionValue.value.toLowerCase()));

    return Object.values(conditions as Record<string, unknown>).every(
      (expected) => typeof expected === 'string' && optionValues.has(expected.toLowerCase()),
    );
  }
}
