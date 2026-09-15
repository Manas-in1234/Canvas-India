import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import sharp from 'sharp';
import { PrismaService } from '../../../database/prisma.service.js';
import { StorageService } from '../../assets/storage.service.js';
import { IMAGE_PROCESSING_QUEUE, type ImageProcessingJobData } from '../queue-names.js';

const THUMBNAIL_MAX_DIMENSION = 300;
const PREVIEW_MAX_DIMENSION = 1600;

/**
 * Runs off the request path (scope §84: "The API should not wait for heavy
 * image processing"). Confirming an upload only enqueues this job; the Asset
 * stays PROCESSING until this worker finishes.
 */
@Processor(IMAGE_PROCESSING_QUEUE)
export class ImageProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(ImageProcessingProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {
    super();
  }

  async process(job: Job<ImageProcessingJobData>): Promise<void> {
    const { assetId } = job.data;
    const asset = await this.prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      this.logger.warn(`Asset ${assetId} not found; skipping`);
      return;
    }

    try {
      const original = await this.storageService.getObjectBuffer(asset.storageKey);
      const metadata = await sharp(original).metadata();

      const thumbnailBuffer = await sharp(original)
        .resize(THUMBNAIL_MAX_DIMENSION, THUMBNAIL_MAX_DIMENSION, { fit: 'inside' })
        .toBuffer();
      const previewBuffer = await sharp(original)
        .resize(PREVIEW_MAX_DIMENSION, PREVIEW_MAX_DIMENSION, { fit: 'inside' })
        .toBuffer();

      const thumbnailKey = this.storageService.buildStorageKey(asset.ownerType, asset.ownerId, 'thumbnail.jpg');
      const previewKey = this.storageService.buildStorageKey(asset.ownerType, asset.ownerId, 'preview.jpg');

      await this.storageService.putObjectBuffer(thumbnailKey, thumbnailBuffer, 'image/jpeg');
      await this.storageService.putObjectBuffer(previewKey, previewBuffer, 'image/jpeg');

      await this.prisma.$transaction([
        this.prisma.asset.update({
          where: { id: assetId },
          data: {
            width: metadata.width,
            height: metadata.height,
            uploadStatus: 'READY',
          },
        }),
        this.prisma.asset.create({
          data: {
            ownerType: asset.ownerType,
            ownerId: asset.ownerId,
            storageKey: thumbnailKey,
            fileName: 'thumbnail.jpg',
            mimeType: 'image/jpeg',
            fileSize: thumbnailBuffer.byteLength,
            assetType: 'THUMBNAIL',
            uploadStatus: 'READY',
          },
        }),
        this.prisma.asset.create({
          data: {
            ownerType: asset.ownerType,
            ownerId: asset.ownerId,
            storageKey: previewKey,
            fileName: 'preview.jpg',
            mimeType: 'image/jpeg',
            fileSize: previewBuffer.byteLength,
            assetType: 'PREVIEW',
            uploadStatus: 'READY',
          },
        }),
      ]);
    } catch (error) {
      this.logger.error(`Image processing failed for asset ${assetId}`, error as Error);
      await this.prisma.asset.update({ where: { id: assetId }, data: { uploadStatus: 'FAILED' } });
      throw error;
    }
  }
}
