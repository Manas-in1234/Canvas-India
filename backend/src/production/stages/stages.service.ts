import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { MaterialsService } from '../materials/materials.service.js';
import { QcResultDto } from './dto/qc-result.dto.js';

@Injectable()
export class StagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly materialsService: MaterialsService,
  ) {}

  async findOne(id: string) {
    const stage = await this.prisma.productionJobStage.findUnique({
      where: { id },
      include: { productionJob: true },
    });
    if (!stage) {
      throw new NotFoundException(`Production job stage ${id} not found`);
    }
    return stage;
  }

  /**
   * Starts a stage (scope §32, §38). If this is the job's first stage to
   * start, consumes the product's BOM materials — the moment work actually
   * begins on physical stock, not merely when the job was queued.
   */
  async start(stageId: string, machineId?: string) {
    const stage = await this.findOne(stageId);
    if (stage.status !== 'PENDING') {
      throw new BadRequestException(`Cannot start a stage in status ${stage.status}`);
    }

    const isFirstStageOfJob = !(await this.prisma.productionJobStage.findFirst({
      where: { productionJobId: stage.productionJobId, status: { in: ['IN_PROGRESS', 'PASSED'] } },
    }));

    await this.prisma.$transaction(async (tx) => {
      await tx.productionJobStage.update({
        where: { id: stageId },
        data: { status: 'IN_PROGRESS', machineId, startedAt: new Date() },
      });

      if (stage.productionJob.status === 'QUEUED') {
        await tx.productionJob.update({
          where: { id: stage.productionJobId },
          data: { status: 'IN_PROGRESS', startedAt: new Date() },
        });
      }

      await tx.productionEvent.create({
        data: {
          productionJobId: stage.productionJobId,
          type: 'stage.started',
          message: `${stage.stage} started`,
        },
      });
    });

    if (isFirstStageOfJob) {
      await this.consumeBomForJob(stage.productionJobId);
    }

    return this.findOne(stageId);
  }

  /** Completes a stage; if it was the job's last stage, completes the job (scope §32). */
  async complete(stageId: string, notes?: string) {
    const stage = await this.findOne(stageId);
    if (stage.status !== 'IN_PROGRESS') {
      throw new BadRequestException(`Cannot complete a stage in status ${stage.status}`);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.productionJobStage.update({
        where: { id: stageId },
        data: { status: 'PASSED', completedAt: new Date(), notes },
      });

      await tx.productionEvent.create({
        data: {
          productionJobId: stage.productionJobId,
          type: 'stage.completed',
          message: `${stage.stage} completed`,
        },
      });

      const remaining = await tx.productionJobStage.count({
        where: { productionJobId: stage.productionJobId, status: { in: ['PENDING', 'IN_PROGRESS'] } },
      });

      if (remaining === 0) {
        await tx.productionJob.update({
          where: { id: stage.productionJobId },
          data: { status: 'COMPLETED', completedAt: new Date() },
        });
        await tx.productionEvent.create({
          data: { productionJobId: stage.productionJobId, type: 'production.completed' },
        });
      }

      return tx.productionJobStage.findUnique({ where: { id: stageId } });
    });
  }

  /**
   * Records QC (scope §108). On FAIL, creates a new stage instance of the
   * failed stage type for rework rather than mutating this stage's history
   * (scope §108, mirroring the immutability instinct applied to order
   * snapshots), and increments the job's reworkCount.
   */
  async recordQc(stageId: string, dto: QcResultDto, checkedBy?: string) {
    const stage = await this.findOne(stageId);
    if (stage.stage !== 'QC') {
      throw new BadRequestException('QC results can only be recorded on a QC stage');
    }
    if (stage.status !== 'IN_PROGRESS') {
      throw new BadRequestException(`Cannot record QC on a stage in status ${stage.status}`);
    }

    const results = [
      dto.printQuality,
      dto.colorQuality,
      dto.alignment,
      dto.materialQuality,
      dto.assemblyQuality,
      dto.packagingQuality,
    ];
    const overall = results.includes('FAIL') ? 'FAIL' : results.includes('REWORK') ? 'REWORK' : 'PASS';

    return this.prisma.$transaction(async (tx) => {
      await tx.qualityCheck.create({
        data: {
          productionJobStageId: stageId,
          printQuality: dto.printQuality,
          colorQuality: dto.colorQuality,
          alignment: dto.alignment,
          materialQuality: dto.materialQuality,
          assemblyQuality: dto.assemblyQuality,
          packagingQuality: dto.packagingQuality,
          result: overall,
          photos: dto.photos ?? [],
          checkedBy,
        },
      });

      if (overall === 'PASS') {
        await tx.productionJobStage.update({
          where: { id: stageId },
          data: { status: 'PASSED', completedAt: new Date() },
        });
        await tx.productionEvent.create({
          data: { productionJobId: stage.productionJobId, type: 'qc.passed' },
        });

        const remaining = await tx.productionJobStage.count({
          where: { productionJobId: stage.productionJobId, status: { in: ['PENDING', 'IN_PROGRESS'] } },
        });
        if (remaining === 0) {
          await tx.productionJob.update({
            where: { id: stage.productionJobId },
            data: { status: 'COMPLETED', completedAt: new Date() },
          });
        }

        return tx.productionJobStage.findUnique({ where: { id: stageId } });
      }

      // FAIL/REWORK: mark this QC stage FAILED and open a fresh instance of
      // the stage that actually needs redoing (the QC stage itself, unless a
      // future extension lets QC name a specific upstream stage to redo).
      await tx.productionJobStage.update({
        where: { id: stageId },
        data: { status: 'FAILED', completedAt: new Date(), failureReason: `QC ${overall}` },
      });

      await tx.productionJobStage.create({
        data: {
          productionJobId: stage.productionJobId,
          stage: stage.stage,
          status: 'PENDING',
          reworkOfStageId: stageId,
        },
      });

      await tx.productionJob.update({
        where: { id: stage.productionJobId },
        data: { reworkCount: { increment: 1 } },
      });

      await tx.productionEvent.create({
        data: {
          productionJobId: stage.productionJobId,
          type: 'qc.failed',
          message: `QC ${overall}; rework stage created`,
        },
      });

      return tx.productionJobStage.findUnique({ where: { id: stageId } });
    });
  }

  private async consumeBomForJob(productionJobId: string) {
    const job = await this.prisma.productionJob.findUnique({
      where: { id: productionJobId },
      include: { orderItem: { include: { variant: { include: { product: { include: { billOfMaterials: { include: { items: true } } } } } } } } },
    });

    const bomItems = job?.orderItem.variant?.product.billOfMaterials?.items ?? [];
    for (const item of bomItems) {
      await this.materialsService.consume(
        item.rawMaterialId,
        item.quantityRequired.toString(),
        'ProductionJob',
        productionJobId,
      );
    }
  }
}
