import { BadRequestException } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PromotionsService } from './promotions.service.js';
import { Prisma } from '../../generated/prisma/client.js';

const makePrisma = () => ({
  promotion: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
});

const makeSegmentsService = () => ({
  findOne: vi.fn(),
  isCustomerInSegment: vi.fn(),
});

const makePromotion = (overrides: Record<string, any> = {}) => ({
  id: 'promo-1',
  name: 'Buy More Save More',
  slug: 'buy-more',
  description: null,
  promotionType: 'AUTOMATIC_DISCOUNT',
  discountType: 'PERCENTAGE',
  value: new Prisma.Decimal('15'),
  minOrderSubtotal: null,
  minQuantity: null,
  maxDiscountAmount: null,
  priority: 0,
  isStackable: false,
  startsAt: new Date(Date.now() - 1000),
  endsAt: new Date(Date.now() + 3600 * 1000),
  isActive: true,
  applicableCategoryIds: [] as string[],
  applicableProductIds: [] as string[],
  customerSegmentId: null,
  campaignId: null,
  rules: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const cartItems = [
  { variantId: 'v1', quantity: 2, unitPrice: 500, productId: 'p1', categoryIds: ['cat-1'] },
  { variantId: 'v2', quantity: 1, unitPrice: 300, productId: 'p2', categoryIds: ['cat-2'] },
];

describe('PromotionsService', () => {
  let service: PromotionsService;
  let prisma: ReturnType<typeof makePrisma>;
  let segmentsService: ReturnType<typeof makeSegmentsService>;

  beforeEach(() => {
    prisma = makePrisma();
    segmentsService = makeSegmentsService();
    service = new PromotionsService(prisma as any, segmentsService as any);
  });

  describe('evaluatePromotions', () => {
    const dto = {
      items: cartItems,
      subtotal: 1300,
    };

    it('applies a single active PERCENTAGE promotion', async () => {
      prisma.promotion.findMany.mockResolvedValue([makePromotion()]);
      const result = await service.evaluatePromotions(dto);
      expect(result.promotions).toHaveLength(1);
      // 15% of 1300 = 195
      expect(result.totalPromotionalDiscount.toNumber()).toBe(195);
      expect(result.finalSubtotal.toNumber()).toBe(1105);
    });

    it('skips promotion when minQuantity is not met', async () => {
      prisma.promotion.findMany.mockResolvedValue([makePromotion({ minQuantity: 10 })]);
      const result = await service.evaluatePromotions({ items: cartItems, subtotal: 1300 });
      expect(result.promotions).toHaveLength(0);
    });

    it('skips promotion when minOrderSubtotal is not met', async () => {
      prisma.promotion.findMany.mockResolvedValue([
        makePromotion({ minOrderSubtotal: new Prisma.Decimal('5000') }),
      ]);
      const result = await service.evaluatePromotions(dto);
      expect(result.promotions).toHaveLength(0);
    });

    it('stacks stackable promotions', async () => {
      const promo1 = makePromotion({ id: 'promo-1', value: new Prisma.Decimal('10'), isStackable: true });
      const promo2 = makePromotion({ id: 'promo-2', slug: 'promo-2', value: new Prisma.Decimal('5'), isStackable: true });
      prisma.promotion.findMany.mockResolvedValue([promo1, promo2]);

      const result = await service.evaluatePromotions(dto);
      // 10% + 5% = 15% of 1300 = 195
      expect(result.promotions).toHaveLength(2);
      expect(result.totalPromotionalDiscount.toNumber()).toBeCloseTo(195, 1);
    });

    it('chooses best non-stackable over stackable when it gives a higher discount', async () => {
      const stackable = makePromotion({ id: 'promo-1', value: new Prisma.Decimal('5'), isStackable: true });
      const nonStackable = makePromotion({ id: 'promo-2', slug: 'promo-2', value: new Prisma.Decimal('20'), isStackable: false });
      prisma.promotion.findMany.mockResolvedValue([stackable, nonStackable]);

      const result = await service.evaluatePromotions(dto);
      // stackable gives 5% of 1300 = 65
      // non-stackable gives 20% of 1300 = 260
      // should pick non-stackable
      expect(result.promotions).toHaveLength(1);
      expect(result.promotions[0].promotionId).toBe('promo-2');
      expect(result.totalPromotionalDiscount.toNumber()).toBe(260);
    });

    it('caps total stackable discount at subtotal', async () => {
      const promo1 = makePromotion({ id: 'promo-1', value: new Prisma.Decimal('60'), isStackable: true });
      const promo2 = makePromotion({ id: 'promo-2', slug: 'promo-2', value: new Prisma.Decimal('60'), isStackable: true });
      prisma.promotion.findMany.mockResolvedValue([promo1, promo2]);

      const result = await service.evaluatePromotions(dto);
      // 60% + 60% = 120% but subtotal is 1300, capped at 1300
      expect(result.totalPromotionalDiscount.toNumber()).toBeLessThanOrEqual(1300);
      expect(result.finalSubtotal.toNumber()).toBeGreaterThanOrEqual(0);
    });

    it('filters promotions to applicable products only', async () => {
      const promo = makePromotion({ applicableProductIds: ['p1'] });
      prisma.promotion.findMany.mockResolvedValue([promo]);

      const result = await service.evaluatePromotions(dto);
      // Only p1 items: quantity 2, unitPrice 500 = 1000
      // 15% of 1000 = 150
      expect(result.promotions).toHaveLength(1);
      expect(result.totalPromotionalDiscount.toNumber()).toBe(150);
    });
  });

  describe('create', () => {
    it('throws BadRequestException if endsAt <= startsAt', async () => {
      prisma.promotion.findUnique.mockResolvedValue(null);
      await expect(
        service.create({
          name: 'Bad Promo',
          slug: 'bad-promo',
          discountType: 'PERCENTAGE' as any,
          value: 10,
          startsAt: '2025-08-01T00:00:00Z',
          endsAt: '2025-07-01T00:00:00Z',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException if PERCENTAGE > 100', async () => {
      prisma.promotion.findUnique.mockResolvedValue(null);
      await expect(
        service.create({
          name: 'Too Big',
          slug: 'too-big',
          discountType: 'PERCENTAGE' as any,
          value: 150,
          startsAt: '2025-06-01T00:00:00Z',
          endsAt: '2025-08-01T00:00:00Z',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
