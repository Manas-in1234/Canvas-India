import { NotFoundException } from '@nestjs/common';
import { PricingService } from './pricing.service.js';
import { Prisma } from '../../generated/prisma/client.js';
import type { PrismaService } from '../../database/prisma.service.js';

function buildVariant(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'variant-1',
    product: {
      basePrice: new Prisma.Decimal(999),
      pricingRules: [
        {
          priority: 1,
          conditions: { size: '20x30' },
          adjustment: new Prisma.Decimal(200),
          startDate: null,
          endDate: null,
        },
      ],
    },
    options: [
      {
        optionValue: {
          value: '20x30',
          priceAdjustment: new Prisma.Decimal(500),
          optionGroup: { name: 'SIZE' },
        },
      },
    ],
    ...overrides,
  };
}

describe('PricingService', () => {
  it('adds option value adjustments and matching pricing rules to the base price', async () => {
    const prisma = {
      productVariant: { findUnique: vi.fn().mockResolvedValue(buildVariant()) },
    } as unknown as PrismaService;

    const service = new PricingService(prisma);
    const breakdown = await service.calculateVariantPrice('variant-1', 2);

    // 999 base + 500 option adjustment + 200 matching rule = 1699 per unit
    expect(breakdown.unitPrice.toString()).toBe('1699');
    expect(breakdown.lineTotal.toString()).toBe('3398');
  });

  it('ignores pricing rules whose conditions do not match the variant options', async () => {
    const variant = buildVariant({
      product: {
        basePrice: new Prisma.Decimal(999),
        pricingRules: [
          {
            priority: 1,
            conditions: { size: '8x8' }, // does not match this variant's 20x30 option
            adjustment: new Prisma.Decimal(9999),
            startDate: null,
            endDate: null,
          },
        ],
      },
    });

    const prisma = {
      productVariant: { findUnique: vi.fn().mockResolvedValue(variant) },
    } as unknown as PrismaService;

    const service = new PricingService(prisma);
    const breakdown = await service.calculateVariantPrice('variant-1', 1);

    // 999 base + 500 option adjustment, non-matching rule excluded
    expect(breakdown.unitPrice.toString()).toBe('1499');
  });

  it('throws NotFoundException when the variant does not exist', async () => {
    const prisma = {
      productVariant: { findUnique: vi.fn().mockResolvedValue(null) },
    } as unknown as PrismaService;

    const service = new PricingService(prisma);
    await expect(service.calculateVariantPrice('missing', 1)).rejects.toThrow(NotFoundException);
  });

  it('computes custom-size pricing from an area-based formula (scope §20)', () => {
    const prisma = {} as PrismaService;
    const service = new PricingService(prisma);

    const price = service.calculateCustomSizePrice(new Prisma.Decimal(10), 20, 30);
    expect(price.toString()).toBe('6000'); // 10 per sq. unit * (20 * 30)
  });
});
