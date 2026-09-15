import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class BomService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProduct(productId: string) {
    const bom = await this.prisma.billOfMaterials.findUnique({
      where: { productId },
      include: { items: { include: { rawMaterial: true } } },
    });
    if (!bom) {
      throw new NotFoundException(`No bill of materials for product ${productId}`);
    }
    return bom;
  }

  /** Replaces the full item list for a product's BOM (scope §35). */
  async upsert(productId: string, items: { rawMaterialId: string; quantityRequired: string }[]) {
    return this.prisma.$transaction(async (tx) => {
      const bom = await tx.billOfMaterials.upsert({
        where: { productId },
        update: {},
        create: { productId },
      });

      await tx.bomItem.deleteMany({ where: { billOfMaterialsId: bom.id } });
      await tx.bomItem.createMany({
        data: items.map((item) => ({
          billOfMaterialsId: bom.id,
          rawMaterialId: item.rawMaterialId,
          quantityRequired: item.quantityRequired,
        })),
      });

      return tx.billOfMaterials.findUnique({
        where: { id: bom.id },
        include: { items: { include: { rawMaterial: true } } },
      });
    });
  }
}
