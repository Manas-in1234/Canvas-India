import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AuditService } from '../../audit/audit.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  findAll() {
    return this.prisma.product.findMany({
      where: { deletedAt: null },
      include: { productType: true, categories: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: {
        productType: true,
        options: { include: { optionGroup: { include: { values: true } } } },
        variants: { include: { options: { include: { optionValue: true } }, inventory: true } },
        pricingRules: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return product;
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        productTypeId: dto.productTypeId,
        basePrice: dto.basePrice,
        costPrice: dto.costPrice,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto, actingAdminId?: string) {
    const existing = await this.prisma.product.findFirstOrThrow({ where: { id, deletedAt: null } });

    const updated = await this.prisma.product.update({
      where: { id },
      data: dto,
    });

    // Price changes are called out explicitly in scope §74 as an audited action.
    if (dto.basePrice !== undefined && dto.basePrice !== existing.basePrice.toString()) {
      await this.auditService.record({
        adminUserId: actingAdminId,
        action: 'PRODUCT_PRICE_CHANGED',
        entityType: 'Product',
        entityId: id,
        changes: {
          basePrice: { old: existing.basePrice.toString(), new: dto.basePrice },
        },
      });
    }

    return updated;
  }

  async softDelete(id: string, actingAdminId?: string) {
    const product = await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    });

    await this.auditService.record({
      adminUserId: actingAdminId,
      action: 'PRODUCT_ARCHIVED',
      entityType: 'Product',
      entityId: id,
    });

    return product;
  }
}
