import { BadRequestException } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CampaignsService } from './campaigns.service.js';

const makePrisma = () => ({
  campaign: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  discountRedemption: {
    findMany: vi.fn(),
  },
});

const makeAuditService = () => ({ record: vi.fn() });
const makeSegmentsService = () => ({ findOne: vi.fn() });

const baseCampaign = {
  id: 'camp-1',
  name: 'Summer Festival',
  code: 'SUMMER2025',
  description: null,
  type: 'SEASONAL' as const,
  status: 'DRAFT' as const,
  startsAt: new Date('2025-06-01T00:00:00Z'),
  endsAt: new Date('2025-08-31T00:00:00Z'),
  budget: null,
  revenueGenerated: { toNumber: () => 0 } as any,
  targetSegmentId: null,
  targetSegment: null,
  discounts: [],
  promotions: [],
  _count: { discounts: 0, promotions: 0 },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CampaignsService', () => {
  let service: CampaignsService;
  let prisma: ReturnType<typeof makePrisma>;
  let auditService: ReturnType<typeof makeAuditService>;
  let segmentsService: ReturnType<typeof makeSegmentsService>;

  beforeEach(() => {
    prisma = makePrisma();
    auditService = makeAuditService();
    segmentsService = makeSegmentsService();
    service = new CampaignsService(prisma as any, auditService as any, segmentsService as any);
  });

  describe('changeStatus', () => {
    it('allows DRAFT → ACTIVE transition', async () => {
      prisma.campaign.findUnique.mockResolvedValue(baseCampaign);
      prisma.campaign.update.mockResolvedValue({ ...baseCampaign, status: 'ACTIVE' });
      const result = await service.changeStatus('camp-1', { status: 'ACTIVE' });
      expect(result.status).toBe('ACTIVE');
      expect(auditService.record).toHaveBeenCalledOnce();
    });

    it('throws BadRequestException for invalid transition COMPLETED → ACTIVE', async () => {
      prisma.campaign.findUnique.mockResolvedValue({ ...baseCampaign, status: 'COMPLETED' });
      await expect(service.changeStatus('camp-1', { status: 'ACTIVE' })).rejects.toThrow(BadRequestException);
    });

    it('returns unchanged campaign when status does not change', async () => {
      prisma.campaign.findUnique.mockResolvedValue(baseCampaign);
      const result = await service.changeStatus('camp-1', { status: 'DRAFT' });
      expect(result.status).toBe('DRAFT');
      expect(prisma.campaign.update).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('throws BadRequestException when endsAt <= startsAt', async () => {
      prisma.campaign.findUnique.mockResolvedValue(null);
      await expect(
        service.create({
          name: 'Bad Campaign',
          code: 'BADCMP',
          startsAt: '2025-08-01T00:00:00Z',
          endsAt: '2025-07-01T00:00:00Z',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getMetrics', () => {
    it('returns zero metrics when no redemptions', async () => {
      prisma.campaign.findUnique.mockResolvedValue(baseCampaign);
      prisma.discountRedemption.findMany.mockResolvedValue([]);
      const metrics = await service.getMetrics('camp-1');
      expect(metrics.totalRedemptionsCount).toBe(0);
      expect(metrics.roi).toBeNull();
    });
  });
});
