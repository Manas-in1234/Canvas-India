import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateDesignDto } from './dto/create-design.dto.js';
import { SaveVersionDto } from './dto/save-version.dto.js';

interface DesignJsonElement {
  type: string;
  asset_id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  z_index?: number;
}

@Injectable()
export class DesignsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const design = await this.prisma.design.findUnique({
      where: { id },
      include: { currentVersion: true, versions: { orderBy: { versionNumber: 'asc' } } },
    });
    if (!design) {
      throw new NotFoundException(`Design ${id} not found`);
    }
    return design;
  }

  findByCustomer(customerId: string) {
    return this.prisma.design.findMany({
      where: { customerId },
      include: { currentVersion: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /** Creates a Design and its first version (scope §21-24). */
  async create(dto: CreateDesignDto) {
    return this.prisma.$transaction(async (tx) => {
      const design = await tx.design.create({
        data: { customerId: dto.customerId, productId: dto.productId, status: 'DRAFT' },
      });

      const version = await tx.designVersion.create({
        data: {
          designId: design.id,
          versionNumber: 1,
          canvasWidth: dto.canvasWidth,
          canvasHeight: dto.canvasHeight,
          targetWidthInches: dto.targetWidthInches,
          targetHeightInches: dto.targetHeightInches,
          designJson: dto.designJson as never,
        },
      });

      await this.syncElements(tx, version.id, dto.designJson);

      return tx.design.update({
        where: { id: design.id },
        data: { currentVersionId: version.id },
        include: { currentVersion: true },
      });
    });
  }

  /**
   * Appends a new version (scope §24: never overwrites an existing version).
   * The customer can keep editing; only the version referenced by a cart
   * item / order at purchase time becomes permanent history.
   */
  async saveVersion(designId: string, dto: SaveVersionDto) {
    return this.prisma.$transaction(async (tx) => {
      const design = await tx.design.findUnique({ where: { id: designId }, include: { versions: true } });
      if (!design) {
        throw new NotFoundException(`Design ${designId} not found`);
      }

      const nextVersionNumber = design.versions.length + 1;

      const version = await tx.designVersion.create({
        data: {
          designId,
          versionNumber: nextVersionNumber,
          canvasWidth: dto.canvasWidth,
          canvasHeight: dto.canvasHeight,
          targetWidthInches: dto.targetWidthInches,
          targetHeightInches: dto.targetHeightInches,
          designJson: dto.designJson as never,
          previewAssetId: dto.previewAssetId,
        },
      });

      await this.syncElements(tx, version.id, dto.designJson);

      return tx.design.update({
        where: { id: designId },
        data: { currentVersionId: version.id },
        include: { currentVersion: true },
      });
    });
  }

  async submit(designId: string) {
    return this.prisma.design.update({ where: { id: designId }, data: { status: 'SUBMITTED' } });
  }

  private async syncElements(
    tx: Prisma.TransactionClient,
    designVersionId: string,
    designJson: Record<string, unknown>,
  ) {
    const elements = Array.isArray((designJson as { elements?: unknown }).elements)
      ? ((designJson as { elements: DesignJsonElement[] }).elements)
      : [];

    if (elements.length === 0) return;

    await tx.designElement.createMany({
      data: elements.map((el) => ({
        designVersionId,
        type: el.type,
        assetId: el.asset_id,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
        rotation: el.rotation ?? 0,
        zIndex: el.z_index ?? 0,
      })),
    });
  }
}
