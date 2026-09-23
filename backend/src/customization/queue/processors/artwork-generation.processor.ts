import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import sharp from 'sharp';
import { PrismaService } from '../../../database/prisma.service.js';
import { StorageService } from '../../assets/storage.service.js';
import { PreflightService } from '../../artwork/preflight.service.js';
import { ARTWORK_GENERATION_QUEUE, type ArtworkGenerationJobData } from '../queue-names.js';

/**
 * Runs pre-flight checks against the design's primary image (scope §27-29).
 * Full rendering to a production-ready TIFF/PDF (scope §85's "Rendering
 * Engine") is intentionally out of scope for Phase 2 — see plan notes; this
 * processor only produces the preflight verdict, it does not set
 * productionFileAssetId.
 */
@Processor(ARTWORK_GENERATION_QUEUE)
export class ArtworkGenerationProcessor extends WorkerHost {
  private readonly logger = new Logger(ArtworkGenerationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly preflightService: PreflightService,
  ) {
    super();
  }

  async process(job: Job<ArtworkGenerationJobData>): Promise<void> {
    const { artworkId } = job.data;
    const artwork = await this.prisma.artwork.findUnique({
      where: { id: artworkId },
      include: { designVersion: { include: { elements: { include: { asset: true } } } } },
    });

    if (!artwork) {
      this.logger.warn(`Artwork ${artworkId} not found; skipping`);
      return;
    }

    const primaryImageElement = artwork.designVersion.elements.find((el) => el.type === 'image' && el.asset);

    if (!primaryImageElement?.asset) {
      await this.prisma.artwork.update({
        where: { id: artworkId },
        data: {
          status: 'PREFLIGHT_FAILED',
          preflightResult: { overall: 'FAIL', message: 'No image asset found in design' },
        },
      });
      return;
    }

    try {
      const original = await this.storageService.getObjectBuffer(primaryImageElement.asset.storageKey);
      const metadata = await sharp(original).metadata();

      const report = this.preflightService.evaluate({
        imageWidthPx: metadata.width ?? 0,
        imageHeightPx: metadata.height ?? 0,
        targetWidthInches: Number(artwork.designVersion.targetWidthInches),
        targetHeightInches: Number(artwork.designVersion.targetHeightInches),
      });

      const statusByResult = {
        PASS: 'PREFLIGHT_PASSED',
        WARNING: 'PREFLIGHT_WARNING',
        FAIL: 'PREFLIGHT_FAILED',
      } as const;

      await this.prisma.artwork.update({
        where: { id: artworkId },
        data: {
          status: statusByResult[report.overall],
          preflightResult: report as never,
        },
      });
    } catch (error) {
      this.logger.error(`Artwork generation failed for ${artworkId}`, error as Error);
      await this.prisma.artwork.update({
        where: { id: artworkId },
        data: { status: 'PREFLIGHT_FAILED', preflightResult: { overall: 'FAIL', message: 'Processing error' } },
      });
      throw error;
    }
  }
}
