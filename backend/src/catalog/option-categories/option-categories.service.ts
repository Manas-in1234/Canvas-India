import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AuditService } from '../../audit/audit.service.js';
import type { CreateOptionCategoryDto } from './dto/create-option-category.dto.js';
import type { UpdateOptionCategoryDto } from './dto/update-option-category.dto.js';
import type { CreateOptionCategoryItemDto } from './dto/create-option-category-item.dto.js';
import type { UpdateOptionCategoryItemDto } from './dto/update-option-category-item.dto.js';

@Injectable()
export class OptionCategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  findAll() {
    return this.prisma.optionCategory.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.optionCategory.findUnique({
      where: { id },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!category) {
      throw new NotFoundException(`Option category ${id} not found`);
    }
    return category;
  }

  /**
   * Public, unauthenticated read used by the storefront customize page —
   * only active categories/items, grouped by baseKey+materialScope exactly
   * as the storefront needs to pick the right list for canvas vs acrylic.
   */
  findActiveByBaseKey(baseKey: string, materialScope?: 'ACRYLIC' | 'CANVAS') {
    return this.prisma.optionCategory.findMany({
      where: {
        baseKey,
        isActive: true,
        ...(materialScope ? { materialScope: { in: [materialScope, 'BOTH'] } } : {}),
      },
      include: { items: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
    });
  }

  async create(dto: CreateOptionCategoryDto, adminUserId: string) {
    const category = await this.prisma.optionCategory.create({ data: dto });

    await this.auditService.record({
      adminUserId,
      action: 'OPTION_CATEGORY_CREATED',
      entityType: 'OptionCategory',
      entityId: category.id,
    });

    return category;
  }

  async update(id: string, dto: UpdateOptionCategoryDto, adminUserId: string) {
    await this.findOne(id);

    const updated = await this.prisma.optionCategory.update({ where: { id }, data: dto });

    await this.auditService.record({
      adminUserId,
      action: 'OPTION_CATEGORY_UPDATED',
      entityType: 'OptionCategory',
      entityId: id,
    });

    return updated;
  }

  async remove(id: string, adminUserId: string) {
    await this.findOne(id);
    await this.prisma.optionCategory.delete({ where: { id } });

    await this.auditService.record({
      adminUserId,
      action: 'OPTION_CATEGORY_DELETED',
      entityType: 'OptionCategory',
      entityId: id,
    });
  }

  async createItem(categoryId: string, dto: CreateOptionCategoryItemDto, adminUserId: string) {
    await this.findOne(categoryId);

    const maxSortOrder = await this.prisma.optionCategoryItem.aggregate({
      where: { categoryId },
      _max: { sortOrder: true },
    });

    const item = await this.prisma.optionCategoryItem.create({
      data: { ...dto, categoryId, sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1 } as never,
    });

    await this.auditService.record({
      adminUserId,
      action: 'OPTION_CATEGORY_ITEM_CREATED',
      entityType: 'OptionCategoryItem',
      entityId: item.id,
    });

    return item;
  }

  async updateItem(itemId: string, dto: UpdateOptionCategoryItemDto, adminUserId: string) {
    await this.getItem(itemId);

    const updated = await this.prisma.optionCategoryItem.update({ where: { id: itemId }, data: dto as never });

    await this.auditService.record({
      adminUserId,
      action: 'OPTION_CATEGORY_ITEM_UPDATED',
      entityType: 'OptionCategoryItem',
      entityId: itemId,
    });

    return updated;
  }

  async removeItem(itemId: string, adminUserId: string) {
    await this.getItem(itemId);
    await this.prisma.optionCategoryItem.delete({ where: { id: itemId } });

    await this.auditService.record({
      adminUserId,
      action: 'OPTION_CATEGORY_ITEM_DELETED',
      entityType: 'OptionCategoryItem',
      entityId: itemId,
    });
  }

  /** Reassigns sortOrder for every item in a category to match the given order. */
  async reorderItems(categoryId: string, itemIds: string[], adminUserId: string) {
    await this.findOne(categoryId);

    await this.prisma.$transaction(
      itemIds.map((itemId, index) =>
        this.prisma.optionCategoryItem.update({
          where: { id: itemId, categoryId },
          data: { sortOrder: index },
        }),
      ),
    );

    await this.auditService.record({
      adminUserId,
      action: 'OPTION_CATEGORY_ITEMS_REORDERED',
      entityType: 'OptionCategory',
      entityId: categoryId,
    });

    return this.findOne(categoryId);
  }

  private async getItem(itemId: string) {
    const item = await this.prisma.optionCategoryItem.findUnique({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException(`Option category item ${itemId} not found`);
    }
    return item;
  }
}
