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
