import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';
import { SlaService } from '../sla/sla.service.js';

// Pipeline order (scope §30) — ARTWORK_QUEUE is reflected on the board
// (§33) but its actual work happens in ArtworkModule (Phase 2), so job
// creation only seeds the stages this module is responsible for driving.
const PIPELINE_STAGES = ['PRINTING', 'CUTTING', 'FRAMING', 'ASSEMBLY', 'QC', 'PACKAGING'] as const;

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slaService: SlaService,
  ) {}

  findAll() {
    return this.prisma.productionJob.findMany({
      orderBy: { createdAt: 'desc' },
      include: { stages: true },
    });
  }

  /**
   * Kanban board data (scope §33): active stages grouped by column, so the
   * admin UI can render "PRINTING: [CC10291, CC10292]" style lanes without a
   * client-side join.
   */
  async board() {
    const stages = await this.prisma.productionJobStage.findMany({
      where: { status: { in: ['PENDING', 'IN_PROGRESS'] } },
      include: {
        productionJob: {
          include: { orderItem: { include: { order: { select: { orderNumber: true } } } } },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const board: Record<string, unknown[]> = {};
    for (const stage of stages) {
      board[stage.stage] ??= [];
      board[stage.stage].push({
        stageId: stage.id,
        productionJobId: stage.productionJobId,
        orderNumber: stage.productionJob.orderItem.order.orderNumber,
        status: stage.status,
        slaDueAt: stage.slaDueAt,
      });
    }
    return board;
  }

  async findOne(id: string) {
    const job = await this.prisma.productionJob.findUnique({
      where: { id },
      include: { stages: { orderBy: { createdAt: 'asc' } }, events: { orderBy: { createdAt: 'asc' } } },
    });
    if (!job) {
      throw new NotFoundException(`Production job ${id} not found`);
    }
    return job;
  }

  /**
   * Creates a job for an order item and seeds one PENDING stage per pipeline
   * step (scope §31), each with an SLA due date resolved from the product's
   * type. Called by ArtworkService.approve once an approved artwork is tied
   * to a real order item — completing Order -> Artwork -> Production.
   */
  async createForOrderItem(
    orderItemId: string,
    forceNew = false,
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.prisma;

    if (!forceNew) {
      const existing = await db.productionJob.findFirst({
        where: { orderItemId },
        orderBy: { createdAt: 'asc' },
      });

      if (existing) {
        return existing;
      }
    }

    const orderItem = await db.orderItem.findUnique({
      where: { id: orderItemId },
      include: { variant: { include: { product: true } } },
    });

    if (!orderItem) {
      throw new NotFoundException(`Order item ${orderItemId} not found`);
    }

    const productTypeId = orderItem.variant?.product.productTypeId;
    const now = new Date();

    const createJob = async (client: Prisma.TransactionClient) => {
      const job = await client.productionJob.create({
        data: {
          orderItemId,
          status: 'QUEUED',
          events: {
            create: {
              type: 'production.created',
              message: 'Production job created',
            },
          },
        },
      });

      let cursor = now;

      for (const stage of PIPELINE_STAGES) {
        const slaDueAt = productTypeId
          ? await this.slaService.resolveDueDate(productTypeId, stage, cursor)
          : null;

        if (slaDueAt) {
          cursor = slaDueAt;
        }

        await client.productionJobStage.create({
          data: {
            productionJobId: job.id,
            stage,
            status: 'PENDING',
            slaDueAt,
          },
        });
      }

      return client.productionJob.findUnique({
        where: { id: job.id },
        include: { stages: true },
      });
    };

    if (tx) {
      return createJob(tx);
    }

    return this.prisma.$transaction(createJob);
  }
}

