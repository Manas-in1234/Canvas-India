import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AuditService } from '../../audit/audit.service.js';
import { JobsService } from '../../production/jobs/jobs.service.js';
import { StorageService } from '../assets/storage.service.js';
import { PreflightService } from './preflight.service.js';
import sharp from 'sharp';

@Injectable()
export class ArtworkService {
  private readonly logger = new Logger(ArtworkService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly jobsService: JobsService,
    private readonly storageService: StorageService,
    private readonly preflightService: PreflightService,
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

  /**
   * Lists artwork for the admin review queue. No listing endpoint existed
   * before this — a reviewer had no way to see what was awaiting review
   * without already knowing an artwork's id.
   */
  findAll(status?: string) {
    return this.prisma.artwork.findMany({
      where: status ? { status: status as never } : undefined,
      include: { designVersion: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Kicks off pre-flight (scope §27-29); processing runs synchronously. */
  async create(designVersionId: string) {
    const artwork = await this.prisma.artwork.create({
      data: { designVersionId, status: 'PENDING' },
    });

    // Run pre-flight checks synchronously
    const artworkWithDetails = await this.prisma.artwork.findUnique({
      where: { id: artwork.id },
      include: { designVersion: { include: { elements: { include: { asset: true } } } } },
    });

    if (!artworkWithDetails) {
      this.logger.warn(`Artwork ${artwork.id} not found; skipping pre-flight`);
      return artwork;
    }

    const primaryImageElement = artworkWithDetails.designVersion.elements.find((el) => el.type === 'image' && el.asset);

    if (!primaryImageElement?.asset) {
      await this.prisma.artwork.update({
        where: { id: artwork.id },
        data: {
          status: 'PREFLIGHT_FAILED',
          preflightResult: { overall: 'FAIL', message: 'No image asset found in design' },
        },
      });
      return this.prisma.artwork.findUnique({
        where: { id: artwork.id },
        include: { designVersion: true },
      });
    }

    try {
      const original = await this.storageService.getObjectBuffer(primaryImageElement.asset.storageKey);
      const metadata = await sharp(original).metadata();

      const report = this.preflightService.evaluate({
        imageWidthPx: metadata.width ?? 0,
        imageHeightPx: metadata.height ?? 0,
        targetWidthInches: Number(artworkWithDetails.designVersion.targetWidthInches),
        targetHeightInches: Number(artworkWithDetails.designVersion.targetHeightInches),
      });

      const statusByResult = {
        PASS: 'PREFLIGHT_PASSED',
        WARNING: 'PREFLIGHT_WARNING',
        FAIL: 'PREFLIGHT_FAILED',
      } as const;

      await this.prisma.artwork.update({
        where: { id: artwork.id },
        data: {
          status: statusByResult[report.overall],
          preflightResult: report as never,
        },
      });
    } catch (error) {
      this.logger.error(`Artwork generation failed for ${artwork.id}`, error as Error);
      await this.prisma.artwork.update({
        where: { id: artwork.id },
        data: { status: 'PREFLIGHT_FAILED', preflightResult: { overall: 'FAIL', message: 'Processing error' } },
      });
    }

    return this.prisma.artwork.findUnique({
      where: { id: artwork.id },
      include: { designVersion: true },
    });
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
    const orderItemId = artwork.orderItemId;

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

    if (orderItemId) {
      await this.jobsService.createForOrderItem(orderItemId);
    }

    return updated;
  }

  async reject(id: string, adminUserId: string, reason?: string) {
    await this.getReviewable(id);

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
