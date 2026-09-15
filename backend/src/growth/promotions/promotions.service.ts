import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CustomerSegmentsService } from '../customer-segments/customer-segments.service.js';
import { CreatePromotionDto } from './dto/create-promotion.dto.js';
import { UpdatePromotionDto } from './dto/update-promotion.dto.js';
import { EvaluatePromotionsDto } from './dto/evaluate-promotions.dto.js';
import { Prisma } from '../../generated/prisma/client.js';

export interface EvaluatedPromotion {
  promotionId: string;
  name: string;
  slug: string;
  promotionType: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: Prisma.Decimal;
  discountAmount: Prisma.Decimal;
  isStackable: boolean;
}

export interface PromotionsEvaluationResult {
  promotions: EvaluatedPromotion[];
  totalPromotionalDiscount: Prisma.Decimal;
  finalSubtotal: Prisma.Decimal;
}

@Injectable()
export class PromotionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly segmentsService: CustomerSegmentsService,
  ) {}

  findAll(filter?: { isActive?: boolean; campaignId?: string }) {
    const where: Prisma.PromotionWhereInput = {};
    if (filter?.isActive !== undefined) where.isActive = filter.isActive;
    if (filter?.campaignId) where.campaignId = filter.campaignId;

    return this.prisma.promotion.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        campaign: { select: { id: true, name: true, code: true } },
        customerSegment: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        campaign: true,
        customerSegment: true,
      },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    return promotion;
  }

  async findBySlug(slug: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { slug },
      include: {
        campaign: true,
        customerSegment: true,
      },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with slug '${slug}' not found`);
    }

    return promotion;
  }

  async create(dto: CreatePromotionDto) {
    const existing = await this.prisma.promotion.findUnique({
      where: { slug: dto.slug.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException(`Promotion with slug '${dto.slug}' already exists`);
    }

    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);

    if (startsAt >= endsAt) {
      throw new BadRequestException('End date must be after start date');
    }

    if (dto.discountType === 'PERCENTAGE' && dto.value > 100) {
      throw new BadRequestException('Percentage promotion cannot exceed 100%');
    }

    if (dto.customerSegmentId) {
      await this.segmentsService.findOne(dto.customerSegmentId);
    }

    return this.prisma.promotion.create({
      data: {
        name: dto.name,
        slug: dto.slug.toLowerCase().trim(),
        description: dto.description,
        promotionType: dto.promotionType ?? 'AUTOMATIC_DISCOUNT',
        discountType: dto.discountType,
        value: new Prisma.Decimal(dto.value),
        minOrderSubtotal: dto.minOrderSubtotal ? new Prisma.Decimal(dto.minOrderSubtotal) : null,
        minQuantity: dto.minQuantity,
        maxDiscountAmount: dto.maxDiscountAmount ? new Prisma.Decimal(dto.maxDiscountAmount) : null,
        priority: dto.priority ?? 0,
        isStackable: dto.isStackable ?? false,
        startsAt,
        endsAt,
        isActive: dto.isActive ?? true,
        applicableCategoryIds: dto.applicableCategoryIds ?? [],
        applicableProductIds: dto.applicableProductIds ?? [],
        customerSegmentId: dto.customerSegmentId,
        campaignId: dto.campaignId,
        rules: dto.rules ? (dto.rules as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
      include: {
        campaign: true,
        customerSegment: true,
      },
    });
  }

  async update(id: string, dto: UpdatePromotionDto) {
    const current = await this.findOne(id);

    const startsAt = dto.startsAt ? new Date(dto.startsAt) : current.startsAt;
    const endsAt = dto.endsAt ? new Date(dto.endsAt) : current.endsAt;

    if (startsAt >= endsAt) {
      throw new BadRequestException('End date must be after start date');
    }

    const discountType = dto.discountType ?? current.discountType;
    const value = dto.value !== undefined ? dto.value : Number(current.value);

    if (discountType === 'PERCENTAGE' && value > 100) {
      throw new BadRequestException('Percentage promotion cannot exceed 100%');
    }

    if (dto.customerSegmentId) {
      await this.segmentsService.findOne(dto.customerSegmentId);
    }

    return this.prisma.promotion.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        promotionType: dto.promotionType,
        discountType: dto.discountType,
        value: dto.value !== undefined ? new Prisma.Decimal(dto.value) : undefined,
        minOrderSubtotal:
          dto.minOrderSubtotal !== undefined
            ? dto.minOrderSubtotal
              ? new Prisma.Decimal(dto.minOrderSubtotal)
              : null
            : undefined,
        minQuantity: dto.minQuantity,
        maxDiscountAmount:
          dto.maxDiscountAmount !== undefined
            ? dto.maxDiscountAmount
              ? new Prisma.Decimal(dto.maxDiscountAmount)
              : null
            : undefined,
        priority: dto.priority,
        isStackable: dto.isStackable,
        startsAt: dto.startsAt ? startsAt : undefined,
        endsAt: dto.endsAt ? endsAt : undefined,
        isActive: dto.isActive,
        applicableCategoryIds: dto.applicableCategoryIds,
        applicableProductIds: dto.applicableProductIds,
        customerSegmentId: dto.customerSegmentId,
        campaignId: dto.campaignId,
        rules: dto.rules ? (dto.rules as Prisma.InputJsonValue) : undefined,
      },
      include: {
        campaign: true,
        customerSegment: true,
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.promotion.delete({ where: { id } });
  }

  async evaluatePromotions(dto: EvaluatePromotionsDto): Promise<PromotionsEvaluationResult> {
    const now = new Date();

    const activePromotions = await this.prisma.promotion.findMany({
      where: {
        isActive: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      orderBy: { priority: 'desc' },
    });

    const totalQuantity = dto.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = new Prisma.Decimal(dto.subtotal);

    const candidates: EvaluatedPromotion[] = [];

    for (const promo of activePromotions) {
      if (promo.minQuantity && totalQuantity < promo.minQuantity) {
        continue;
      }

      if (promo.customerSegmentId) {
        if (!dto.customerId) continue;
        const inSegment = await this.segmentsService.isCustomerInSegment(
          dto.customerId,
          promo.customerSegmentId,
        );
        if (!inSegment) continue;
      }

      const hasProductFilter = promo.applicableProductIds.length > 0;
      const hasCategoryFilter = promo.applicableCategoryIds.length > 0;

      let eligibleSubtotal = new Prisma.Decimal(0);

      for (const item of dto.items) {
        let isItemEligible = true;

        if (hasProductFilter && item.productId) {
          if (!promo.applicableProductIds.includes(item.productId)) {
            isItemEligible = false;
          }
        }

        if (hasCategoryFilter && item.categoryIds) {
          const matchesCategory = item.categoryIds.some((cid) =>
            promo.applicableCategoryIds.includes(cid),
          );
          if (!matchesCategory) {
            isItemEligible = false;
          }
        }

        if (isItemEligible) {
          const lineTotal = new Prisma.Decimal(item.unitPrice).times(item.quantity);
          eligibleSubtotal = eligibleSubtotal.plus(lineTotal);
        }
      }

      if (eligibleSubtotal.equals(0) && (hasProductFilter || hasCategoryFilter)) {
        continue;
      }

      if (!hasProductFilter && !hasCategoryFilter) {
        eligibleSubtotal = subtotal;
      }

      if (promo.minOrderSubtotal && eligibleSubtotal.lessThan(promo.minOrderSubtotal)) {
        continue;
      }

      let discountAmount = new Prisma.Decimal(0);
      if (promo.discountType === 'PERCENTAGE') {
        discountAmount = eligibleSubtotal.times(promo.value).dividedBy(100);
        if (promo.maxDiscountAmount && discountAmount.greaterThan(promo.maxDiscountAmount)) {
          discountAmount = promo.maxDiscountAmount;
        }
      } else {
        discountAmount = Prisma.Decimal.min(promo.value, eligibleSubtotal);
      }

      const roundedDiscount = new Prisma.Decimal(discountAmount.toFixed(2));

      if (roundedDiscount.greaterThan(0)) {
        candidates.push({
          promotionId: promo.id,
          name: promo.name,
          slug: promo.slug,
          promotionType: promo.promotionType,
          discountType: promo.discountType as 'PERCENTAGE' | 'FIXED_AMOUNT',
          value: promo.value,
          discountAmount: roundedDiscount,
          isStackable: promo.isStackable,
        });
      }
    }

    // Determine applied promotions based on stackability
    // Strategy:
    // Option A: Sum of stackable promotions
    // Option B: Best single non-stackable promotion
    // Pick the combination that gives the highest discount to the customer (standard commerce practice)
    const stackableCandidates = candidates.filter((p) => p.isStackable);
    const nonStackableCandidates = candidates.filter((p) => !p.isStackable);

    const stackableTotal = stackableCandidates.reduce(
      (sum, p) => sum.plus(p.discountAmount),
      new Prisma.Decimal(0),
    );

    const bestNonStackable = nonStackableCandidates.sort((a, b) =>
      b.discountAmount.minus(a.discountAmount).toNumber(),
    )[0];

    let appliedPromotions: EvaluatedPromotion[] = [];
    let totalPromotionalDiscount = new Prisma.Decimal(0);

    if (bestNonStackable && bestNonStackable.discountAmount.greaterThan(stackableTotal)) {
      appliedPromotions = [bestNonStackable];
      totalPromotionalDiscount = bestNonStackable.discountAmount;
    } else if (stackableCandidates.length > 0) {
      appliedPromotions = stackableCandidates;
      totalPromotionalDiscount = Prisma.Decimal.min(stackableTotal, subtotal);
    } else if (bestNonStackable) {
      appliedPromotions = [bestNonStackable];
      totalPromotionalDiscount = bestNonStackable.discountAmount;
    }

    const finalSubtotal = Prisma.Decimal.max(new Prisma.Decimal(0), subtotal.minus(totalPromotionalDiscount));

    return {
      promotions: appliedPromotions,
      totalPromotionalDiscount,
      finalSubtotal,
    };
  }
}
