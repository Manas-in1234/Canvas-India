import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { WarehousesService } from './warehouses.service.js';

describe('WarehousesService', () => {
  const warehouse = {
    id: 'warehouse-1',
    name: 'Bengaluru Production Warehouse',
    code: 'BLR-01',
    addressLine1: 'Industrial Area, Peenya',
    addressLine2: null,
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560058',
    country: 'IN',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const prisma = {
    warehouse: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  };

  const service = new WarehousesService(prisma as never);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists warehouses ordered by creation date', async () => {
    prisma.warehouse.findMany.mockResolvedValue([warehouse]);

    const result = await service.findAll();

    expect(result).toEqual([warehouse]);
    expect(prisma.warehouse.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  it('creates a warehouse when the code is available', async () => {
    prisma.warehouse.findUnique.mockResolvedValue(null);
    prisma.warehouse.create.mockResolvedValue(warehouse);

    const dto = {
      name: 'Bengaluru Production Warehouse',
      code: 'BLR-01',
      addressLine1: 'Industrial Area, Peenya',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560058',
    };

    const result = await service.create(dto);

    expect(result).toEqual(warehouse);
    expect(prisma.warehouse.create).toHaveBeenCalledWith({
      data: {
        name: 'Bengaluru Production Warehouse',
        code: 'BLR-01',
        addressLine1: 'Industrial Area, Peenya',
        addressLine2: undefined,
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560058',
        country: 'IN',
      },
    });
  });

  it('rejects creation when the warehouse code already exists', async () => {
    prisma.warehouse.findUnique.mockResolvedValue(warehouse);

    const dto = {
      name: 'Another Warehouse',
      code: 'BLR-01',
      addressLine1: 'Some Address',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
    };

    await expect(service.create(dto)).rejects.toThrow(ConflictException);

    expect(prisma.warehouse.create).not.toHaveBeenCalled();
  });

  it('throws when the requested warehouse does not exist', async () => {
    prisma.warehouse.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deactivates an existing warehouse', async () => {
    prisma.warehouse.findUnique.mockResolvedValue(warehouse);

    const deactivatedWarehouse = {
      ...warehouse,
      isActive: false,
    };

    prisma.warehouse.update.mockResolvedValue(deactivatedWarehouse);

    const result = await service.deactivate('warehouse-1');

    expect(result).toEqual(deactivatedWarehouse);
    expect(prisma.warehouse.update).toHaveBeenCalledWith({
      where: { id: 'warehouse-1' },
      data: { isActive: false },
    });
  });
});
