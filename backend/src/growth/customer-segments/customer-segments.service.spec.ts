import { BadRequestException, NotFoundException } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomerSegmentsService } from './customer-segments.service.js';

const makePrisma = () => ({
  customerSegment: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  customerSegmentMember: {
    findUnique: vi.fn(),
    createMany: vi.fn(),
    deleteMany: vi.fn(),
  },
  customer: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
  },
  $transaction: vi.fn(async (fn: any) => fn(makePrisma())),
});

const baseSegment = {
  id: 'seg-1',
  name: 'VIP Customers',
  slug: 'vip-customers',
  description: null,
  type: 'MANUAL' as const,
  criteria: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  members: [],
  _count: { members: 0, campaigns: 0, discounts: 0, promotions: 0 },
};

describe('CustomerSegmentsService', () => {
  let service: CustomerSegmentsService;
  let prisma: ReturnType<typeof makePrisma>;

  beforeEach(() => {
    prisma = makePrisma();
    service = new CustomerSegmentsService(prisma as any);
  });

  describe('findOne', () => {
    it('throws NotFoundException if segment does not exist', async () => {
      prisma.customerSegment.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });

    it('returns the segment when found', async () => {
      prisma.customerSegment.findUnique.mockResolvedValue(baseSegment);
      const result = await service.findOne('seg-1');
      expect(result.id).toBe('seg-1');
    });
  });

  describe('addMembers', () => {
    it('throws BadRequestException when adding to a DYNAMIC segment', async () => {
      prisma.customerSegment.findUnique.mockResolvedValue({
        ...baseSegment,
        type: 'DYNAMIC',
      });
      await expect(service.addMembers('seg-1', ['cust-1'])).rejects.toThrow(BadRequestException);
    });

    it('allows adding to a MANUAL segment', async () => {
      prisma.customerSegment.findUnique.mockResolvedValueOnce(baseSegment); // findOne inside addMembers
      prisma.customer.findMany.mockResolvedValue([{ id: 'cust-1' }]);
      prisma.customerSegmentMember.createMany.mockResolvedValue({ count: 1 });
      prisma.customerSegment.findUnique.mockResolvedValue(baseSegment); // final findOne
      await expect(service.addMembers('seg-1', ['cust-1'])).resolves.toBeDefined();
    });
  });

  describe('removeMember', () => {
    it('throws BadRequestException when removing from a DYNAMIC segment', async () => {
      prisma.customerSegment.findUnique.mockResolvedValue({
        ...baseSegment,
        type: 'DYNAMIC',
      });
      await expect(service.removeMember('seg-1', 'cust-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('isCustomerInSegment', () => {
    it('returns true when customer is a member', async () => {
      prisma.customerSegmentMember.findUnique.mockResolvedValue({ segmentId: 'seg-1', customerId: 'cust-1' });
      const result = await service.isCustomerInSegment('cust-1', 'seg-1');
      expect(result).toBe(true);
    });

    it('returns false when customer is not a member', async () => {
      prisma.customerSegmentMember.findUnique.mockResolvedValue(null);
      const result = await service.isCustomerInSegment('cust-99', 'seg-1');
      expect(result).toBe(false);
    });
  });
});
