import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AuditService } from '../../audit/audit.service.js';
import { CustomerSegmentsService } from '../customer-segments/customer-segments.service.js';
import { CampaignStatus, CreateCampaignDto } from './dto/create-campaign.dto.js';
import { UpdateCampaignDto } from './dto/update-campaign.dto.js';
import { ChangeCampaignStatusDto } from './dto/change-campaign-status.dto.js';
import { Prisma } from '../../generated/prisma/client.js';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly segmentsService: CustomerSegmentsService,
  ) {}

  findAll(filter?: { status?: string; type?: string }) {
    const where: Prisma.CampaignWhereInput = {};
    if (filter?.status) where.status = filter.status as any;
    if (filter?.type) where.type = filter.type as any;

    return this.prisma.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        targetSegment: { select: { id: true, name: true } },
        _count: { select: { discounts: true, promotions: true } },
      },
    });
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        targetSegment: true,
        discounts: {
          select: { id: true, code: true, discountType: true, value: true, usageCount: true, isActive: true },
        },
        promotions: {
          select: { id: true, name: true, slug: true, discountType: true, value: true, isActive: true },
        },
        _count: { select: { discounts: true, promotions: true } },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async findByCode(code: string) {
    const normalized = code.trim().toUpperCase();
    const campaign = await this.prisma.campaign.findUnique({
      where: { code: normalized },
      include: {
        targetSegment: true,
        discounts: true,
        promotions: true,
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with code '${normalized}' not found`);
    }

    return campaign;
  }

  async create(dto: CreateCampaignDto) {
    const normalizedCode = dto.code.trim().toUpperCase();

    const existing = await this.prisma.campaign.findUnique({
      where: { code: normalizedCode },
    });

    if (existing) {
      throw new ConflictException(`Campaign with code '${normalizedCode}' already exists`);
    }

    const startsAt = new Date(dto.startsAt);
    const endsAt = dto.endsAt ? new Date(dto.endsAt) : null;

    if (endsAt && startsAt >= endsAt) {
      throw new BadRequestException('End date must be after start date');
    }

    if (dto.targetSegmentId) {
      await this.segmentsService.findOne(dto.targetSegmentId);
    }

    return this.prisma.campaign.create({
      data: {
        name: dto.name,
        code: normalizedCode,
        description: dto.description,
        type: dto.type ?? 'SEASONAL',
        status: dto.status ?? 'DRAFT',
        startsAt,
        endsAt,
        budget: dto.budget ? new Prisma.Decimal(dto.budget) : null,
        targetSegmentId: dto.targetSegmentId,
      },
      include: {
        targetSegment: true,
      },
    });
  }

  async update(id: string, dto: UpdateCampaignDto) {
    const current = await this.findOne(id);

    const startsAt = dto.startsAt ? new Date(dto.startsAt) : current.startsAt;
    const endsAt = dto.endsAt !== undefined ? (dto.endsAt ? new Date(dto.endsAt) : null) : current.endsAt;

    if (startsAt && endsAt && startsAt >= endsAt) {
      throw new BadRequestException('End date must be after start date');
    }

    if (dto.targetSegmentId) {
      await this.segmentsService.findOne(dto.targetSegmentId);
    }

    return this.prisma.campaign.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        status: dto.status,
        startsAt: dto.startsAt ? startsAt : undefined,
        endsAt: dto.endsAt !== undefined ? endsAt : undefined,
        budget:
          dto.budget !== undefined
            ? dto.budget
              ? new Prisma.Decimal(dto.budget)
              : null
            : undefined,
        targetSegmentId: dto.targetSegmentId,
      },
      include: {
        targetSegment: true,
      },
    });
  }

  async changeStatus(id: string, dto: ChangeCampaignStatusDto, actingAdminId?: string) {
    const campaign = await this.findOne(id);
    const fromStatus = campaign.status;
    const toStatus = dto.status;

    // Validate state machine
    const allowedTransitions: Record<string, string[]> = {
      DRAFT: ['SCHEDULED', 'ACTIVE', 'CANCELLED'],
      SCHEDULED: ['ACTIVE', 'CANCELLED', 'PAUSED'],
      ACTIVE: ['PAUSED', 'COMPLETED', 'CANCELLED'],
      PAUSED: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (fromStatus === toStatus) {
      return campaign;
    }

    const allowed = allowedTransitions[fromStatus] ?? [];
    if (!allowed.includes(toStatus)) {
      throw new BadRequestException(
        `Cannot change campaign status from ${fromStatus} to ${toStatus}. Allowed transitions: [${allowed.join(', ')}]`,
      );
    }

    const updated = await this.prisma.campaign.update({
      where: { id },
      data: { status: toStatus },
      include: { targetSegment: true },
    });

    await this.auditService.record({
      adminUserId: actingAdminId,
      action: 'CAMPAIGN_STATUS_CHANGED',
      entityType: 'Campaign',
      entityId: id,
      changes: {
        status: { old: fromStatus, new: toStatus },
      },
      reason: dto.reason,
    });

    return updated;
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.campaign.delete({ where: { id } });
  }

  async getMetrics(id: string) {
    const campaign = await this.findOne(id);

    // Sum discounts and total redemptions
    const discountIds = campaign.discounts.map((d) => d.id);

    const redemptions = await this.prisma.discountRedemption.findMany({
      where: { discountId: { in: discountIds } },
      include: { order: true },
    });

    const totalDiscountAmount = redemptions.reduce(
      (sum, r) => sum.plus(r.amount),
      new Prisma.Decimal(0),
    );

    const attributedOrders = redemptions.filter((r) => r.order !== null);
    const totalAttributedRevenue = attributedOrders.reduce(
      (sum, r) => sum.plus(r.order!.total),
      new Prisma.Decimal(0),
    );

    return {
      campaignId: campaign.id,
      name: campaign.name,
      code: campaign.code,
      status: campaign.status,
      budget: campaign.budget,
      totalDiscountsOffered: campaign.discounts.length,
      totalPromotionsOffered: campaign.promotions.length,
      totalRedemptionsCount: redemptions.length,
      totalDiscountAmountGiven: totalDiscountAmount,
      totalAttributedRevenue,
      attributedOrdersCount: attributedOrders.length,
      roi:
        campaign.budget && campaign.budget.greaterThan(0)
          ? totalAttributedRevenue.minus(campaign.budget).dividedBy(campaign.budget).times(100).toFixed(2) + '%'
          : null,
    };
  }
}
