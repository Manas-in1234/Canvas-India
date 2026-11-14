import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AuditService } from '../../audit/audit.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import type { Prisma, ProductStatus } from '../../generated/prisma/client.js';

type AdminProductRow = {
  id: string; name: string; status: ProductStatus; basePrice: Prisma.Decimal;
  createdAt: Date; productType: { id: string; name: string; isActive: boolean };
  storefront: { image: string | null };
};

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  findAll(admin = false) {
    return this.prisma.product.findMany({
      where: { deletedAt: null, ...(admin ? {} : { status: 'ACTIVE' as const }) },
      include: { productType: true, categories: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAdminSummaries() {
    return this.prisma.$queryRaw<AdminProductRow[]>`
      SELECT p.id, p.name, p.status::text AS status, p.base_price AS "basePrice", p.created_at AS "createdAt",
        jsonb_build_object('id', t.id, 'name', t.name, 'isActive', t.is_active) AS "productType",
        jsonb_build_object('image', p.storefront ->> 'image') AS storefront
      FROM products p
      JOIN product_types t ON t.id = p.product_type_id
      WHERE p.deleted_at IS NULL
      ORDER BY p.created_at DESC, p.id DESC
    `;
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
    if (dto.status !== undefined && dto.status !== 'DRAFT' && dto.status !== 'ACTIVE') {
      throw new BadRequestException('Choose draft or live visibility.');
    }
    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        productTypeId: dto.productTypeId,
        basePrice: dto.basePrice,
        costPrice: dto.costPrice,
        storefront: dto.storefront,
        status: dto.status,
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

    // Showing or hiding a product on the website is a status change worth tracing.
    if (dto.status !== undefined && dto.status !== existing.status) {
      await this.auditService.record({
        adminUserId: actingAdminId,
        action: 'PRODUCT_STATUS_CHANGED',
        entityType: 'Product',
        entityId: id,
        changes: { status: { old: existing.status, new: dto.status } },
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
