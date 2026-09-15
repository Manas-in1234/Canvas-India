import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiscountsService } from './discounts.service.js';
import { Prisma } from '../../generated/prisma/client.js';

const makePrisma = () => ({
  discount: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  discountRedemption: {
    count: vi.fn(),
    create: vi.fn(),
  },
  $transaction: vi.fn(),
});

const makeSegmentsService = () => ({
  findOne: vi.fn(),
  isCustomerInSegment: vi.fn(),
});

const baseDiscount = {
  id: 'disc-1',
  code: 'SUMMER10',
  description: 'Summer sale',
  discountType: 'PERCENTAGE' as const,
  value: new Prisma.Decimal('10'),
  maxDiscountAmount: null,
  minOrderSubtotal: null,
  usageLimit: null,
  usageCount: 0,
  perCustomerLimit: null,
  startsAt: null,
  expiresAt: null,
  isActive: true,
  isExclusive: false,
  applicableCategoryIds: [] as string[],
  applicableProductIds: [] as string[],
  customerSegmentId: null,
  campaignId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('DiscountsService', () => {
  let service: DiscountsService;
  let prisma: ReturnType<typeof makePrisma>;
  let segmentsService: ReturnType<typeof makeSegmentsService>;

  beforeEach(() => {
    prisma = makePrisma();
    segmentsService = makeSegmentsService();
    service = new DiscountsService(prisma as any, segmentsService as any);
  });

  describe('validateDiscount', () => {
    it('throws NotFoundException for unknown code', async () => {
      prisma.discount.findUnique.mockResolvedValue(null);
      await expect(service.validateDiscount({ code: 'BAD' })).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when discount is inactive', async () => {
      prisma.discount.findUnique.mockResolvedValue({ ...baseDiscount, isActive: false });
      await expect(service.validateDiscount({ code: 'SUMMER10' })).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when discount has not started', async () => {
      const future = new Date(Date.now() + 60 * 60 * 1000);
      prisma.discount.findUnique.mockResolvedValue({ ...baseDiscount, startsAt: future });
      await expect(service.validateDiscount({ code: 'SUMMER10' })).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when discount has expired', async () => {
      const past = new Date(Date.now() - 60 * 60 * 1000);
      prisma.discount.findUnique.mockResolvedValue({ ...baseDiscount, expiresAt: past });
      await expect(service.validateDiscount({ code: 'SUMMER10' })).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when usage limit is reached', async () => {
      prisma.discount.findUnique.mockResolvedValue({ ...baseDiscount, usageLimit: 5, usageCount: 5 });
      await expect(service.validateDiscount({ code: 'SUMMER10' })).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when subtotal is below minimum', async () => {
      prisma.discount.findUnique.mockResolvedValue({
        ...baseDiscount,
        minOrderSubtotal: new Prisma.Decimal('500'),
      });
      await expect(service.validateDiscount({ code: 'SUMMER10', subtotal: 300 })).rejects.toThrow(BadRequestException);
    });

    it('calculates PERCENTAGE discount correctly', async () => {
      prisma.discount.findUnique.mockResolvedValue(baseDiscount);
      const result = await service.validateDiscount({ code: 'SUMMER10', subtotal: 1000 });
      expect(result.isValid).toBe(true);
      expect(result.discountAmount.toNumber()).toBe(100); // 10% of 1000
    });

    it('caps PERCENTAGE discount at maxDiscountAmount', async () => {
      prisma.discount.findUnique.mockResolvedValue({
        ...baseDiscount,
        value: new Prisma.Decimal('50'), // 50%
        maxDiscountAmount: new Prisma.Decimal('200'),
      });
      const result = await service.validateDiscount({ code: 'SUMMER10', subtotal: 1000 });
      // 50% of 1000 = 500, capped at 200
      expect(result.discountAmount.toNumber()).toBe(200);
    });

    it('calculates FIXED_AMOUNT discount correctly', async () => {
      prisma.discount.findUnique.mockResolvedValue({
        ...baseDiscount,
        discountType: 'FIXED_AMOUNT',
        value: new Prisma.Decimal('150'),
      });
      const result = await service.validateDiscount({ code: 'SUMMER10', subtotal: 1000 });
      expect(result.discountAmount.toNumber()).toBe(150);
    });

    it('does not give FIXED_AMOUNT discount exceeding subtotal', async () => {
      prisma.discount.findUnique.mockResolvedValue({
        ...baseDiscount,
        discountType: 'FIXED_AMOUNT',
        value: new Prisma.Decimal('2000'),
      });
      const result = await service.validateDiscount({ code: 'SUMMER10', subtotal: 500 });
      expect(result.discountAmount.toNumber()).toBe(500);
    });

    it('throws BadRequestException when per-customer limit is reached', async () => {
      prisma.discount.findUnique.mockResolvedValue({ ...baseDiscount, perCustomerLimit: 1 });
      prisma.discountRedemption.count.mockResolvedValue(1);
      await expect(
        service.validateDiscount({ code: 'SUMMER10', customerId: 'cust-1' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when customer is not in required segment', async () => {
      prisma.discount.findUnique.mockResolvedValue({ ...baseDiscount, customerSegmentId: 'seg-1' });
      segmentsService.isCustomerInSegment.mockResolvedValue(false);
      await expect(
        service.validateDiscount({ code: 'SUMMER10', customerId: 'cust-1' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('passes when customer is in required segment', async () => {
      prisma.discount.findUnique.mockResolvedValue({ ...baseDiscount, customerSegmentId: 'seg-1' });
      segmentsService.isCustomerInSegment.mockResolvedValue(true);
      const result = await service.validateDiscount({ code: 'SUMMER10', customerId: 'cust-1', subtotal: 100 });
      expect(result.isValid).toBe(true);
    });
  });

  describe('create', () => {
    it('throws ConflictException when code already exists', async () => {
      prisma.discount.findUnique.mockResolvedValue(baseDiscount);
      await expect(
        service.create({
          code: 'SUMMER10',
          discountType: 'PERCENTAGE' as any,
          value: 10,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('throws BadRequestException if percentage > 100', async () => {
      prisma.discount.findUnique.mockResolvedValue(null);
      await expect(
        service.create({
          code: 'TOOBIG',
          discountType: 'PERCENTAGE' as any,
          value: 110,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException if expiresAt <= startsAt', async () => {
      prisma.discount.findUnique.mockResolvedValue(null);
      await expect(
        service.create({
          code: 'BAD-DATE',
          discountType: 'PERCENTAGE' as any,
          value: 10,
          startsAt: '2025-01-10T00:00:00Z',
          expiresAt: '2025-01-05T00:00:00Z',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('normalizes code to uppercase', async () => {
      prisma.discount.findUnique.mockResolvedValue(null);
      prisma.discount.create.mockResolvedValue({ ...baseDiscount });
      await service.create({ code: 'summer10', discountType: 'PERCENTAGE' as any, value: 10 });
      expect(prisma.discount.create.mock.calls[0][0].data.code).toBe('SUMMER10');
    });
  });
});
