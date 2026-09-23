import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';

/**
 * Raw-material stock, separate from finished-variant InventoryItem (scope
 * §36). Same available/reserved/consumed/damaged state machine and movement
 * ledger as InventoryService, plus a consume() transition specific to
 * production (a variant never gets "consumed", only reserved/released).
 */
@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.rawMaterial.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const material = await this.prisma.rawMaterial.findUnique({ where: { id } });
    if (!material) {
      throw new NotFoundException(`Raw material ${id} not found`);
    }
    return material;
  }

  create(name: string, unit: string, reorderLevel?: string) {
    return this.prisma.rawMaterial.create({ data: { name, unit, reorderLevel: reorderLevel ?? '0' } });
  }

  async adjust(rawMaterialId: string, quantity: string, performedBy?: string) {
    return this.prisma.$transaction(async (tx) => {
      const material = await tx.rawMaterial.findUnique({ where: { id: rawMaterialId } });
      if (!material) {
        throw new NotFoundException(`Raw material ${rawMaterialId} not found`);
      }

      const delta = new Prisma.Decimal(quantity);
      const beforeQuantity = material.available;
      const afterQuantity = beforeQuantity.plus(delta);
      if (afterQuantity.isNegative()) {
        throw new BadRequestException('Adjustment would result in negative available stock');
      }

      await tx.rawMaterial.update({ where: { id: rawMaterialId }, data: { available: afterQuantity } });

      await tx.rawMaterialMovement.create({
        data: {
          rawMaterialId,
          movementType: 'ADJUSTMENT',
          quantity: delta,
          beforeQuantity,
          afterQuantity,
          performedBy,
        },
      });

      return tx.rawMaterial.findUnique({ where: { id: rawMaterialId } });
    });
  }

  async reserve(rawMaterialId: string, quantity: string, referenceType: string, referenceId: string) {
    return this.prisma.$transaction(async (tx) => {
      const material = await tx.rawMaterial.findUnique({ where: { id: rawMaterialId } });
      if (!material) {
        throw new NotFoundException(`Raw material ${rawMaterialId} not found`);
      }

      const amount = new Prisma.Decimal(quantity);
      if (material.available.lessThan(amount)) {
        throw new BadRequestException('Insufficient available stock to reserve');
      }

      const beforeQuantity = material.available;
      await tx.rawMaterial.update({
        where: { id: rawMaterialId },
        data: { available: { decrement: amount }, reserved: { increment: amount } },
      });

      await tx.rawMaterialMovement.create({
        data: {
          rawMaterialId,
          movementType: 'RESERVATION',
          quantity: amount,
          beforeQuantity,
          afterQuantity: beforeQuantity.minus(amount),
          referenceType,
          referenceId,
        },
      });

      return tx.rawMaterial.findUnique({ where: { id: rawMaterialId } });
    });
  }

  async release(rawMaterialId: string, quantity: string, referenceType: string, referenceId: string) {
    return this.prisma.$transaction(async (tx) => {
      const material = await tx.rawMaterial.findUnique({ where: { id: rawMaterialId } });
      if (!material) {
        throw new NotFoundException(`Raw material ${rawMaterialId} not found`);
      }

      const amount = new Prisma.Decimal(quantity);
      if (material.reserved.lessThan(amount)) {
        throw new BadRequestException('Cannot release more than currently reserved');
      }

      const beforeQuantity = material.available;
      await tx.rawMaterial.update({
        where: { id: rawMaterialId },
        data: { available: { increment: amount }, reserved: { decrement: amount } },
      });

      await tx.rawMaterialMovement.create({
        data: {
          rawMaterialId,
          movementType: 'RELEASE',
          quantity: amount,
          beforeQuantity,
          afterQuantity: beforeQuantity.plus(amount),
          referenceType,
          referenceId,
        },
      });

      return tx.rawMaterial.findUnique({ where: { id: rawMaterialId } });
    });
  }

  /**
   * Reserved -> Consumed (scope §37-38: "When production consumes material").
   * Falls back to consuming directly from available stock if nothing was
   * reserved ahead of time, so a job can still start even without a prior
   * explicit reservation step.
   */
  async consume(rawMaterialId: string, quantity: string, referenceType: string, referenceId: string) {
    return this.prisma.$transaction(async (tx) => {
      const material = await tx.rawMaterial.findUnique({ where: { id: rawMaterialId } });
      if (!material) {
        throw new NotFoundException(`Raw material ${rawMaterialId} not found`);
      }

      const amount = new Prisma.Decimal(quantity);
      const fromReserved = Prisma.Decimal.min(material.reserved, amount);
      const fromAvailable = amount.minus(fromReserved);

      if (material.available.lessThan(fromAvailable)) {
        throw new BadRequestException('Insufficient stock (reserved + available) to consume');
      }

      const beforeQuantity = material.available;
      await tx.rawMaterial.update({
        where: { id: rawMaterialId },
        data: {
          reserved: { decrement: fromReserved },
          available: { decrement: fromAvailable },
          consumed: { increment: amount },
        },
      });

      await tx.rawMaterialMovement.create({
        data: {
          rawMaterialId,
          movementType: 'CONSUMPTION',
          quantity: amount,
          beforeQuantity,
          afterQuantity: beforeQuantity.minus(fromAvailable),
          referenceType,
          referenceId,
        },
      });

      return tx.rawMaterial.findUnique({ where: { id: rawMaterialId } });
    });
  }
}
