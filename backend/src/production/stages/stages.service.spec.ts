import { BadRequestException } from '@nestjs/common';
import { StagesService } from './stages.service.js';
import type { PrismaService } from '../../database/prisma.service.js';
import type { MaterialsService } from '../materials/materials.service.js';

function buildTx(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    qualityCheck: { create: vi.fn().mockResolvedValue({}) },
    productionJobStage: {
      update: vi.fn().mockResolvedValue({}),
      create: vi.fn().mockResolvedValue({}),
      count: vi.fn().mockResolvedValue(1), // "still stages remaining" by default
      findUnique: vi.fn().mockResolvedValue({ id: 'stage-1', status: 'FAILED' }),
    },
    productionJob: { update: vi.fn().mockResolvedValue({}) },
    productionEvent: { create: vi.fn().mockResolvedValue({}) },
    ...overrides,
  };
}

function buildPrisma(tx: ReturnType<typeof buildTx>, stage: Record<string, unknown>) {
  return {
    productionJobStage: {
      findUnique: vi.fn().mockResolvedValue(stage),
    },
    $transaction: vi.fn().mockImplementation((callback: (tx: unknown) => unknown) => callback(tx)),
  } as unknown as PrismaService;
}

const qcAllPass = {
  printQuality: 'PASS' as const,
  colorQuality: 'PASS' as const,
  alignment: 'PASS' as const,
  materialQuality: 'PASS' as const,
  assemblyQuality: 'PASS' as const,
  packagingQuality: 'PASS' as const,
};

describe('StagesService.recordQc', () => {
  const materialsService = {} as MaterialsService;

  it('rejects QC on a non-QC stage', async () => {
    const stage = { id: 'stage-1', stage: 'PRINTING', status: 'IN_PROGRESS', productionJobId: 'job-1' };
    const tx = buildTx();
    const prisma = buildPrisma(tx, stage);
    const service = new StagesService(prisma, materialsService);

    await expect(service.recordQc('stage-1', qcAllPass)).rejects.toThrow(BadRequestException);
  });

  it('marks the QC stage PASSED and does not open a rework stage when every check passes', async () => {
    const stage = { id: 'stage-1', stage: 'QC', status: 'IN_PROGRESS', productionJobId: 'job-1' };
    const tx = buildTx({ productionJobStage: { ...buildTx().productionJobStage, count: vi.fn().mockResolvedValue(0) } });
    const prisma = buildPrisma(tx, stage);
    const service = new StagesService(prisma, materialsService);

    await service.recordQc('stage-1', qcAllPass, 'admin-1');

    expect(tx.productionJobStage.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'stage-1' }, data: expect.objectContaining({ status: 'PASSED' }) }),
    );
    expect(tx.productionJobStage.create).not.toHaveBeenCalled();
    // No PENDING/IN_PROGRESS stages remain -> the job completes.
    expect(tx.productionJob.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'COMPLETED' }) }),
    );
  });

  it('fails the QC stage and opens a new PENDING rework stage when a check fails (scope §108)', async () => {
    const stage = { id: 'stage-1', stage: 'QC', status: 'IN_PROGRESS', productionJobId: 'job-1' };
    const tx = buildTx();
    const prisma = buildPrisma(tx, stage);
    const service = new StagesService(prisma, materialsService);

    await service.recordQc('stage-1', { ...qcAllPass, printQuality: 'FAIL' }, 'admin-1');

    // The failed stage's history is preserved, not overwritten...
    expect(tx.productionJobStage.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'stage-1' }, data: expect.objectContaining({ status: 'FAILED' }) }),
    );
    // ...and a fresh PENDING instance is created for the retry.
    expect(tx.productionJobStage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ stage: 'QC', status: 'PENDING', reworkOfStageId: 'stage-1' }),
      }),
    );
    expect(tx.productionJob.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { reworkCount: { increment: 1 } } }),
    );
  });

  it('rejects QC recording when the stage is not currently IN_PROGRESS', async () => {
    const stage = { id: 'stage-1', stage: 'QC', status: 'PENDING', productionJobId: 'job-1' };
    const tx = buildTx();
    const prisma = buildPrisma(tx, stage);
    const service = new StagesService(prisma, materialsService);

    await expect(service.recordQc('stage-1', qcAllPass)).rejects.toThrow(BadRequestException);
  });
});
