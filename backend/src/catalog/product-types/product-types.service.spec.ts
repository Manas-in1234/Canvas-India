import { describe, expect, it, vi } from 'vitest';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ProductTypesService } from './product-types.service.js';

function fakePrisma(rows: { id: string; name: string }[] = []) {
  return {
    productType: {
      findFirst: vi.fn(async ({ where }: any) => rows.find((r) => r.name.toLowerCase() === String(where.name.equals).toLowerCase() && r.id !== where.id?.not) ?? null),
      update: vi.fn(async ({ where, data }: any) => {
        const row = rows.find((r) => r.id === where.id);
        if (!row) { const err: any = new Error('not found'); err.code = 'P2025'; throw err; }
        Object.assign(row, data);
        return row;
      }),
    },
  } as any;
}

describe('ProductTypesService.rename', () => {
  it('renames a category to a new, unused name', async () => {
    const prisma = fakePrisma([{ id: 'c1', name: 'Canvas' }]);
    const service = new ProductTypesService(prisma);
    const updated = await service.rename('c1', 'Wall Canvas');
    expect(updated.name).toBe('Wall Canvas');
  });

  it('rejects an empty or too-long name', async () => {
    const prisma = fakePrisma([{ id: 'c1', name: 'Canvas' }]);
    const service = new ProductTypesService(prisma);
    await expect(service.rename('c1', '')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.rename('c1', '   ')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.rename('c1', 'x'.repeat(81))).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a name that collides with another category, case-insensitively', async () => {
    const prisma = fakePrisma([{ id: 'c1', name: 'Canvas' }, { id: 'c2', name: 'Acrylic' }]);
    const service = new ProductTypesService(prisma);
    await expect(service.rename('c1', 'acrylic')).rejects.toBeInstanceOf(ConflictException);
  });

  it('allows renaming a category to the same name it already has (case-only change)', async () => {
    const prisma = fakePrisma([{ id: 'c1', name: 'Canvas' }]);
    const service = new ProductTypesService(prisma);
    const updated = await service.rename('c1', 'CANVAS');
    expect(updated.name).toBe('CANVAS');
  });

  it('throws NotFoundException for a category that does not exist', async () => {
    const prisma = fakePrisma([]);
    const service = new ProductTypesService(prisma);
    await expect(service.rename('missing', 'New Name')).rejects.toBeInstanceOf(NotFoundException);
  });
});
