import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AuditService } from '../../audit/audit.service.js';
import type { CreateSizePresetDto } from './dto/create-size-preset.dto.js';
import type { UpdateSizePresetDto } from './dto/update-size-preset.dto.js';

@Injectable()
export class SizePresetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  findAll(productTypeId?: string) {
    return this.prisma.sizePreset.findMany({
      where: productTypeId ? { productTypeId } : undefined,
      orderBy: [{ productTypeId: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async findOne(id: string) {
    const preset = await this.prisma.sizePreset.findUnique({ where: { id } });
    if (!preset) {
      throw new NotFoundException(`Size preset ${id} not found`);
    }
    return preset;
  }

  /**
   * Public, unauthenticated read used by the storefront customize page.
   * shapeId narrows to the "standard shape size" scope when provided; when
   * omitted, returns every active preset for the product (the multi-panel
   * layout scope, where presets are self-contained and don't vary by shape).
   */
  findActiveForProduct(productTypeId: string, shapeId?: string) {
    return this.prisma.sizePreset.findMany({
      where: {
        productTypeId,
        isActive: true,
        ...(shapeId ? { shapeId } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(dto: CreateSizePresetDto, adminUserId: string) {
    const maxSortOrder = await this.prisma.sizePreset.aggregate({
      where: { productTypeId: dto.productTypeId },
      _max: { sortOrder: true },
    });

    const preset = await this.prisma.sizePreset.create({
      data: { ...dto, sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1 } as never,
    });

    await this.auditService.record({
      adminUserId,
      action: 'SIZE_PRESET_CREATED',
      entityType: 'SizePreset',
      entityId: preset.id,
    });

    return preset;
  }

  async update(id: string, dto: UpdateSizePresetDto, adminUserId: string) {
    await this.findOne(id);

    const updated = await this.prisma.sizePreset.update({ where: { id }, data: dto as never });

    await this.auditService.record({
      adminUserId,
      action: 'SIZE_PRESET_UPDATED',
      entityType: 'SizePreset',
      entityId: id,
    });

    return updated;
  }

  async remove(id: string, adminUserId: string) {
    await this.findOne(id);
    await this.prisma.sizePreset.delete({ where: { id } });

    await this.auditService.record({
      adminUserId,
      action: 'SIZE_PRESET_DELETED',
      entityType: 'SizePreset',
      entityId: id,
    });
  }

  async reorder(productTypeId: string, presetIds: string[], adminUserId: string) {
    await this.prisma.$transaction(
      presetIds.map((id, index) =>
        this.prisma.sizePreset.update({
          where: { id, productTypeId },
          data: { sortOrder: index },
        }),
      ),
    );

    await this.auditService.record({
      adminUserId,
      action: 'SIZE_PRESETS_REORDERED',
      entityType: 'SizePreset',
      entityId: productTypeId,
    });

    return this.findAll(productTypeId);
  }
}
