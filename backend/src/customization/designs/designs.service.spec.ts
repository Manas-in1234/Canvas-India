import { NotFoundException } from '@nestjs/common';
import { DesignsService } from './designs.service.js';
import type { PrismaService } from '../../database/prisma.service.js';

function buildTx(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    design: {
      create: vi.fn().mockResolvedValue({ id: 'design-1' }),
      update: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'design-1', ...data })),
      findUnique: vi.fn(),
    },
    designVersion: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'version-1', ...data })),
    },
    designElement: {
      createMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
    ...overrides,
  };
}

function buildPrisma(tx: ReturnType<typeof buildTx>) {
  return {
    $transaction: vi.fn().mockImplementation((callback: (tx: unknown) => unknown) => callback(tx)),
  } as unknown as PrismaService;
}

describe('DesignsService', () => {
  it('creates a design with version 1 and sets it as the current version', async () => {
    const tx = buildTx();
    const prisma = buildPrisma(tx);
    const service = new DesignsService(prisma);

    await service.create({
      customerId: 'cust-1',
      productId: 'prod-1',
      canvasWidth: 2000,
      canvasHeight: 3000,
      targetWidthInches: '20',
      targetHeightInches: '30',
      designJson: { canvas: { width: 2000, height: 3000 }, elements: [] },
    });

    expect(tx.designVersion.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ versionNumber: 1 }) }),
    );
    expect(tx.design.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { currentVersionId: 'version-1' } }),
    );
  });

  it('appends a new version rather than mutating an existing one (scope §24)', async () => {
    const tx = buildTx({
      design: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'design-1',
          versions: [{ id: 'v1' }, { id: 'v2' }], // two existing versions already
        }),
        update: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'design-1', ...data })),
      },
      designVersion: {
        create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'version-3', ...data })),
      },
      designElement: { createMany: vi.fn().mockResolvedValue({ count: 0 }) },
    });
    const prisma = buildPrisma(tx);
    const service = new DesignsService(prisma);

    await service.saveVersion('design-1', {
      canvasWidth: 2000,
      canvasHeight: 3000,
      targetWidthInches: '20',
      targetHeightInches: '30',
      designJson: { elements: [] },
    });

    // Next version number continues the sequence rather than overwriting v1/v2.
    expect(tx.designVersion.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ versionNumber: 3 }) }),
    );
  });

  it('throws NotFoundException when saving a version for a missing design', async () => {
    const tx = buildTx({ design: { findUnique: vi.fn().mockResolvedValue(null) } });
    const prisma = buildPrisma(tx);
    const service = new DesignsService(prisma);

    await expect(
      service.saveVersion('missing', {
        canvasWidth: 100,
        canvasHeight: 100,
        targetWidthInches: '10',
        targetHeightInches: '10',
        designJson: {},
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
