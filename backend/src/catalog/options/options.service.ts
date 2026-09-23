import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

/**
 * Product configuration engine (scope §13-17): option groups/values and their
 * price adjustments are DB-driven, so admins can add new options without a
 * code change or redeploy.
 */
@Injectable()
export class OptionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllGroups() {
    return this.prisma.optionGroup.findMany({
      include: { values: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  createGroup(name: string) {
    return this.prisma.optionGroup.create({ data: { name } });
  }

  addValue(optionGroupId: string, value: string, priceAdjustment?: string, sortOrder?: number) {
    return this.prisma.optionValue.create({
      data: {
        optionGroupId,
        value,
        priceAdjustment: priceAdjustment ?? '0',
        sortOrder: sortOrder ?? 0,
      },
    });
  }

  attachToProduct(productId: string, optionGroupId: string, isRequired = true, sortOrder = 0) {
    return this.prisma.productOption.create({
      data: { productId, optionGroupId, isRequired, sortOrder },
    });
  }
}
