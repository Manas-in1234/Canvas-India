import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { PrismaService } from '../../database/prisma.service.js';
import { AuditService } from '../../audit/audit.service.js';
import { JobsService } from '../../production/jobs/jobs.service.js';
import { ARTWORK_GENERATION_QUEUE, type ArtworkGenerationJobData } from '../queue/queue-names.js';

@Injectable()
export class ArtworkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly jobsService: JobsService,
    @InjectQueue(ARTWORK_GENERATION_QUEUE) private readonly artworkQueue: Queue<ArtworkGenerationJobData>,
  ) {}

  async findOne(id: string) {
    const artwork = await this.prisma.artwork.findUnique({
      where: { id },
      include: { designVersion: true },
    });
    if (!artwork) {
      throw new NotFoundException(`Artwork ${id} not found`);
    }
    return artwork;
  }

  /** Kicks off pre-flight (scope §27-29); processing runs off the request path. */
  async create(designVersionId: string) {
    const artwork = await this.prisma.artwork.create({
      data: { designVersionId, status: 'PENDING' },
    });

    await this.artworkQueue.add('generate', { artworkId: artwork.id });

    return artwork;
  }

  /**
   * Approving completes the Order -> Artwork -> Production chain (scope
   * §27-31): once an artwork tied to a real order item is approved, a
   * production job is created so the item starts moving through the factory
   * floor. Artwork submitted before checkout (orderItemId still null) is
   * approved without creating a job — a job only exists once there's a real
   * order item to attach it to.
   */
  async approve(id: string, adminUserId: string, reason?: string) {
    const artwork = await this.getReviewable(id);

    const updated = await this.prisma.artwork.update({
      where: { id },
      data: { status: 'APPROVED', reviewedBy: adminUserId, reviewedAt: new Date() },
    });

    await this.auditService.record({
      adminUserId,
      action: 'ARTWORK_APPROVED',
      entityType: 'Artwork',
      entityId: id,
      reason,
    });

    if (artwork.orderItemId) {
      await this.jobsService.createForOrderItem(artwork.orderItemId);
    }

    return updated;
  }

  async reject(id: string, adminUserId: string, reason?: string) {
    const artwork = await this.getReviewable(id);

    const updated = await this.prisma.artwork.update({
      where: { id },
      data: { status: 'REJECTED', reviewedBy: adminUserId, reviewedAt: new Date() },
    });

    await this.auditService.record({
      adminUserId,
      action: 'ARTWORK_REJECTED',
      entityType: 'Artwork',
      entityId: id,
      reason,
    });

    return updated;
  }

  private async getReviewable(id: string) {
    const artwork = await this.prisma.artwork.findUnique({ where: { id } });
    if (!artwork) {
      throw new NotFoundException(`Artwork ${id} not found`);
    }
    if (artwork.status === 'PENDING') {
      throw new BadRequestException('Cannot review artwork before pre-flight has completed');
    }
    return artwork;
  }
}
