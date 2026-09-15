import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class VariantsService {
  constructor(private readonly prisma: PrismaService) {}

  findByProduct(productId: string) {
    return this.prisma.productVariant.findMany({
      where: { productId },
      include: { options: { include: { optionValue: true } }, inventory: true },
    });
  }

  /** Creates a variant and its zeroed inventory record in one transaction (scope §16, §36). */
  create(productId: string, sku: string, price: string, optionValueIds: string[]) {
    return this.prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.create({
        data: {
          productId,
          sku,
          price,
          options: {
            create: optionValueIds.map((optionValueId) => ({ optionValueId })),
          },
        },
        include: { options: { include: { optionValue: true } } },
      });

      await tx.inventoryItem.create({
        data: { variantId: variant.id, available: 0, reserved: 0, damaged: 0 },
      });

      return variant;
    });
  }
}
