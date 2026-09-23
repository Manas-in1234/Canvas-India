import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CustomerSegmentsService } from '../customer-segments/customer-segments.service.js';
import { CreateDiscountDto } from './dto/create-discount.dto.js';
import { UpdateDiscountDto } from './dto/update-discount.dto.js';
import { ValidateDiscountDto } from './dto/validate-discount.dto.js';
import { Prisma } from '../../generated/prisma/client.js';

export interface DiscountCalculationResult {
  isValid: boolean;
  discountId: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: Prisma.Decimal;
  discountAmount: Prisma.Decimal;
  eligibleSubtotal: Prisma.Decimal;
  isExclusive: boolean;
  message?: string;
}

@Injectable()
export class DiscountsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly segmentsService: CustomerSegmentsService,
  ) {}

  findAll(filter?: { isActive?: boolean; campaignId?: string }) {
    const where: Prisma.DiscountWhereInput = {};
    if (filter?.isActive !== undefined) where.isActive = filter.isActive;
    if (filter?.campaignId) where.campaignId = filter.campaignId;

    return this.prisma.discount.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        campaign: { select: { id: true, name: true, code: true } },
        customerSegment: { select: { id: true, name: true } },
        _count: { select: { redemptions: true } },
      },
    });
  }

  async findOne(id: string) {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
      include: {
        campaign: true,
        customerSegment: true,
        redemptions: {
          take: 50,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: { select: { id: true, name: true, email: true } },
            order: { select: { id: true, orderNumber: true, total: true } },
          },
        },
        _count: { select: { redemptions: true } },
      },
    });

    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }

    return discount;
  }

  async findByCode(code: string) {
    const normalized = code.trim().toUpperCase();
    const discount = await this.prisma.discount.findUnique({
      where: { code: normalized },
      include: {
        campaign: true,
        customerSegment: true,
      },
    });

    if (!discount) {
      throw new NotFoundException(`Discount with code '${normalized}' not found`);
    }

    return discount;
  }

  async create(dto: CreateDiscountDto) {
    const normalizedCode = dto.code.trim().toUpperCase();

    const existing = await this.prisma.discount.findUnique({
      where: { code: normalizedCode },
    });

    if (existing) {
      throw new ConflictException(`Discount with code '${normalizedCode}' already exists`);
    }

    if (dto.startsAt && dto.expiresAt && new Date(dto.startsAt) >= new Date(dto.expiresAt)) {
      throw new BadRequestException('Expiration date must be after start date');
    }

    if (dto.discountType === 'PERCENTAGE' && dto.value > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100%');
    }

    if (dto.customerSegmentId) {
      await this.segmentsService.findOne(dto.customerSegmentId);
    }

    return this.prisma.discount.create({
      data: {
        code: normalizedCode,
        description: dto.description,
        discountType: dto.discountType,
        value: new Prisma.Decimal(dto.value),
        maxDiscountAmount: dto.maxDiscountAmount ? new Prisma.Decimal(dto.maxDiscountAmount) : null,
        minOrderSubtotal: dto.minOrderSubtotal ? new Prisma.Decimal(dto.minOrderSubtotal) : null,
        usageLimit: dto.usageLimit,
        perCustomerLimit: dto.perCustomerLimit,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        isActive: dto.isActive ?? true,
        isExclusive: dto.isExclusive ?? false,
        applicableCategoryIds: dto.applicableCategoryIds ?? [],
        applicableProductIds: dto.applicableProductIds ?? [],
        customerSegmentId: dto.customerSegmentId,
        campaignId: dto.campaignId,
      },
      include: {
        campaign: true,
        customerSegment: true,
      },
    });
  }

  async update(id: string, dto: UpdateDiscountDto) {
    const current = await this.findOne(id);

    const startsAt = dto.startsAt ? new Date(dto.startsAt) : current.startsAt;
    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : current.expiresAt;

    if (startsAt && expiresAt && startsAt >= expiresAt) {
      throw new BadRequestException('Expiration date must be after start date');
    }

    const discountType = dto.discountType ?? current.discountType;
    const value = dto.value !== undefined ? dto.value : Number(current.value);

    if (discountType === 'PERCENTAGE' && value > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100%');
    }

    if (dto.customerSegmentId) {
      await this.segmentsService.findOne(dto.customerSegmentId);
    }

    return this.prisma.discount.update({
      where: { id },
      data: {
        description: dto.description,
        discountType: dto.discountType,
        value: dto.value !== undefined ? new Prisma.Decimal(dto.value) : undefined,
        maxDiscountAmount:
          dto.maxDiscountAmount !== undefined
            ? dto.maxDiscountAmount
              ? new Prisma.Decimal(dto.maxDiscountAmount)
              : null
            : undefined,
        minOrderSubtotal:
          dto.minOrderSubtotal !== undefined
            ? dto.minOrderSubtotal
              ? new Prisma.Decimal(dto.minOrderSubtotal)
              : null
            : undefined,
        usageLimit: dto.usageLimit,
        perCustomerLimit: dto.perCustomerLimit,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        isActive: dto.isActive,
        isExclusive: dto.isExclusive,
        applicableCategoryIds: dto.applicableCategoryIds,
        applicableProductIds: dto.applicableProductIds,
        customerSegmentId: dto.customerSegmentId,
        campaignId: dto.campaignId,
      },
      include: {
        campaign: true,
        customerSegment: true,
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.discount.delete({ where: { id } });
  }

  async validateDiscount(dto: ValidateDiscountDto): Promise<DiscountCalculationResult> {
    const normalizedCode = dto.code.trim().toUpperCase();

    const discount = await this.prisma.discount.findUnique({
      where: { code: normalizedCode },
    });

    if (!discount) {
      throw new NotFoundException(`Discount code '${normalizedCode}' is invalid`);
    }

    if (!discount.isActive) {
      throw new BadRequestException(`Discount code '${normalizedCode}' is inactive`);
    }

    const now = new Date();

    if (discount.startsAt && discount.startsAt > now) {
      throw new BadRequestException(`Discount code '${normalizedCode}' is not yet active`);
    }

    if (discount.expiresAt && discount.expiresAt < now) {
      throw new BadRequestException(`Discount code '${normalizedCode}' has expired`);
    }

    if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
      throw new BadRequestException(`Discount code '${normalizedCode}' has reached its usage limit`);
    }

    if (dto.customerId && discount.perCustomerLimit !== null) {
      const customerRedemptions = await this.prisma.discountRedemption.count({
        where: {
          discountId: discount.id,
          customerId: dto.customerId,
        },
      });

      if (customerRedemptions >= discount.perCustomerLimit) {
        throw new BadRequestException(
          `You have reached the maximum redemptions (${discount.perCustomerLimit}) for discount '${normalizedCode}'`,
        );
      }
    }

    if (discount.customerSegmentId) {
      if (!dto.customerId) {
        throw new BadRequestException(
          `Discount '${normalizedCode}' is restricted to members of a customer segment. Please log in.`,
        );
      }

      const inSegment = await this.segmentsService.isCustomerInSegment(
        dto.customerId,
        discount.customerSegmentId,
      );

      if (!inSegment) {
        throw new BadRequestException(
          `Discount code '${normalizedCode}' is not available for your customer account`,
        );
      }
    }

    // Determine eligible items and calculate subtotal
    let eligibleSubtotal = new Prisma.Decimal(0);

    if (dto.items && dto.items.length > 0) {
      const hasProductFilter = discount.applicableProductIds.length > 0;
      const hasCategoryFilter = discount.applicableCategoryIds.length > 0;

      for (const item of dto.items) {
        let isItemEligible = true;

        if (hasProductFilter && item.productId) {
          if (!discount.applicableProductIds.includes(item.productId)) {
            isItemEligible = false;
          }
        }

        if (hasCategoryFilter && item.categoryIds) {
          const matchesCategory = item.categoryIds.some((cid) =>
            discount.applicableCategoryIds.includes(cid),
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
        throw new BadRequestException(
          `Discount code '${normalizedCode}' does not apply to any items in your cart`,
        );
      }
    } else if (dto.subtotal !== undefined) {
      eligibleSubtotal = new Prisma.Decimal(dto.subtotal);
    }

    if (discount.minOrderSubtotal && eligibleSubtotal.lessThan(discount.minOrderSubtotal)) {
      throw new BadRequestException(
        `Order subtotal (₹${eligibleSubtotal.toFixed(2)}) does not meet the minimum requirement of ₹${discount.minOrderSubtotal.toFixed(2)} for this discount`,
      );
    }

    // Calculate discount amount
    let discountAmount = new Prisma.Decimal(0);

    if (discount.discountType === 'PERCENTAGE') {
      discountAmount = eligibleSubtotal.times(discount.value).dividedBy(100);
      if (discount.maxDiscountAmount && discountAmount.greaterThan(discount.maxDiscountAmount)) {
        discountAmount = discount.maxDiscountAmount;
      }
    } else {
      // FIXED_AMOUNT
      discountAmount = Prisma.Decimal.min(discount.value, eligibleSubtotal);
    }

    // Round to 2 decimal places
    const roundedDiscount = new Prisma.Decimal(discountAmount.toFixed(2));

    return {
      isValid: true,
      discountId: discount.id,
      code: discount.code,
      discountType: discount.discountType as 'PERCENTAGE' | 'FIXED_AMOUNT',
      value: discount.value,
      discountAmount: roundedDiscount,
      eligibleSubtotal,
      isExclusive: discount.isExclusive,
    };
  }

  async recordRedemption(
    discountId: string,
    customerId: string,
    amount: Prisma.Decimal,
    orderId?: string,
    cartId?: string,
    externalTx?: Prisma.TransactionClient,
  ) {
    const run = async (tx: Prisma.TransactionClient) => {
      await tx.discount.update({
        where: { id: discountId },
        data: { usageCount: { increment: 1 } },
      });

      return tx.discountRedemption.create({
        data: {
          discountId,
          customerId,
          orderId,
          cartId,
          amount,
        },
      });
    };

    if (externalTx) {
      return run(externalTx);
    }

    return this.prisma.$transaction(run);
  }
}
