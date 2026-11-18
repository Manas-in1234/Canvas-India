import { describe, expect, it, beforeEach, vi } from 'vitest';
import { InventoryService } from './inventory.service.js';

describe('InventoryService.listMovements', () => {
  const prisma = {
    inventoryMovement: {
      findMany: vi.fn(),
    },
  };

  const service = new InventoryService(prisma as never);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists recent movements across all variants when none is specified', async () => {
    const rows = [{ id: 'movement-1', movementType: 'ADJUSTMENT' }];
    prisma.inventoryMovement.findMany.mockResolvedValue(rows);

    const result = await service.listMovements();

    expect(result).toEqual(rows);
    expect(prisma.inventoryMovement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: undefined, orderBy: { createdAt: 'desc' }, take: 200 }),
    );
  });

  it('filters movements to a single variant when one is specified', async () => {
    prisma.inventoryMovement.findMany.mockResolvedValue([]);

    await service.listMovements('variant-1');

    expect(prisma.inventoryMovement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { inventoryItem: { variantId: 'variant-1' } } }),
    );
  });
});
