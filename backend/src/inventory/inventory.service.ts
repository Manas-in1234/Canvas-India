import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

/**
 * Inventory state machine (scope §37-39):
 *   Available -> Reserved      (on payment confirmation)
 *   Reserved  -> Consumed      (when production consumes material)
 *   Reserved  -> Available     (on order cancellation)
 * Every transition writes an inventory_movements row (append-only ledger).
 */
@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.inventoryItem.findMany({
      include: { variant: { select: { sku: true, productId: true } } },
    });
  }

  async findBySku(sku: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { variant: { sku } },
      include: { variant: true },
    });
    if (!item) {
      throw new NotFoundException(`No inventory item for SKU ${sku}`);
    }
    return item;
  }

  /**
   * Adds stock for a product. Uses the product's first variant (creating a default
   * variant + inventory record when the product has none yet), so any catalog
   * product can be stocked without extra setup.
   */
  async addStock(productId: string, quantity: number, performedBy?: string, reason?: string) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { variants: { orderBy: { createdAt: 'asc' }, take: 1 } },
      });
      if (!product) {
        throw new NotFoundException(`Product ${productId} not found`);
      }

      let variant = product.variants[0];
      if (!variant) {
        variant = await tx.productVariant.create({
          data: {
            productId,
            sku: `${product.slug}-default`.toUpperCase().slice(0, 100),
            price: product.basePrice,
          },
        });
      }

      const item = await tx.inventoryItem.upsert({
        where: { variantId: variant.id },
        create: { variantId: variant.id },
        update: {},
      });

      const afterQuantity = item.available + quantity;
      await tx.inventoryItem.update({ where: { id: item.id }, data: { available: afterQuantity } });
      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: item.id,
          movementType: 'PURCHASE',
          quantity,
          beforeQuantity: item.available,
          afterQuantity,
          performedBy,
          referenceType: reason ? 'ManualStockIn' : undefined,
        },
      });

      return tx.inventoryItem.findUnique({ where: { id: item.id }, include: { variant: { select: { sku: true, productId: true } } } });
    });
  }

  async adjust(variantId: string, quantity: number, performedBy?: string, reason?: string) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({ where: { variantId } });
      if (!item) {
        throw new NotFoundException(`No inventory item for variant ${variantId}`);
      }

      const beforeQuantity = item.available;
      const afterQuantity = beforeQuantity + quantity;
      if (afterQuantity < 0) {
        throw new BadRequestException('Adjustment would result in negative available stock');
      }

      await tx.inventoryItem.update({
        where: { variantId },
        data: { available: afterQuantity },
      });

      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: item.id,
          movementType: 'ADJUSTMENT',
          quantity,
          beforeQuantity,
          afterQuantity,
          performedBy,
          referenceType: reason ? 'ManualAdjustment' : undefined,
        },
      });

      return tx.inventoryItem.findUnique({ where: { variantId } });
    });
  }

  async reserve(variantId: string, quantity: number, referenceType: string, referenceId: string) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({ where: { variantId } });
      if (!item) {
        throw new NotFoundException(`No inventory item for variant ${variantId}`);
      }
      if (item.available < quantity) {
        throw new BadRequestException('Insufficient available stock to reserve');
      }

      const beforeQuantity = item.available;
      await tx.inventoryItem.update({
        where: { variantId },
        data: { available: { decrement: quantity }, reserved: { increment: quantity } },
      });

      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: item.id,
          movementType: 'RESERVATION',
          quantity,
          beforeQuantity,
          afterQuantity: beforeQuantity - quantity,
          referenceType,
          referenceId,
        },
      });

      return tx.inventoryItem.findUnique({ where: { variantId } });
    });
  }

  async release(variantId: string, quantity: number, referenceType: string, referenceId: string) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({ where: { variantId } });
      if (!item) {
        throw new NotFoundException(`No inventory item for variant ${variantId}`);
      }
      if (item.reserved < quantity) {
        throw new BadRequestException('Cannot release more than currently reserved');
      }

      const beforeQuantity = item.available;
      await tx.inventoryItem.update({
        where: { variantId },
        data: { available: { increment: quantity }, reserved: { decrement: quantity } },
      });

      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: item.id,
          movementType: 'RELEASE',
          quantity,
          beforeQuantity,
          afterQuantity: beforeQuantity + quantity,
          referenceType,
          referenceId,
        },
      });

      return tx.inventoryItem.findUnique({ where: { variantId } });
    });
  }
}
