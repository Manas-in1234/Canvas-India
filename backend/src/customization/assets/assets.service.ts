import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { PrismaService } from '../../database/prisma.service.js';
import { StorageService } from './storage.service.js';
import { IMAGE_PROCESSING_QUEUE, type ImageProcessingJobData } from '../queue/queue-names.js';

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

@Injectable()
export class AssetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    @InjectQueue(IMAGE_PROCESSING_QUEUE) private readonly imageQueue: Queue<ImageProcessingJobData>,
  ) {}

  /**
   * Client requests a signed PUT URL and uploads directly to object storage
   * (scope §90-91) — the file bytes never pass through this API server.
   */
  async requestUploadUrl(ownerType: string, ownerId: string, fileName: string, mimeType: string, fileSize: number) {
    if (fileSize > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(`File exceeds the maximum allowed size of ${MAX_FILE_SIZE_BYTES} bytes`);
    }

    const storageKey = this.storageService.buildStorageKey(ownerType, ownerId, fileName);

    const asset = await this.prisma.asset.create({
      data: {
        ownerType,
        ownerId,
        storageKey,
        fileName,
        mimeType,
        fileSize,
        assetType: 'ORIGINAL',
        uploadStatus: 'PENDING_UPLOAD',
      },
    });

    const uploadUrl = await this.storageService.getSignedUploadUrl(storageKey, mimeType);

    return { assetId: asset.id, uploadUrl, storageKey };
  }

  /**
   * Client confirms the direct upload completed; this enqueues thumbnail/
   * preview generation and returns immediately (scope §84 — the API must not
   * block on image processing).
   */
  async confirmUpload(assetId: string) {
    const asset = await this.prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      throw new NotFoundException(`Asset ${assetId} not found`);
    }

    await this.prisma.asset.update({ where: { id: assetId }, data: { uploadStatus: 'PROCESSING' } });
    await this.imageQueue.add('process', { assetId });

    return { assetId, status: 'PROCESSING' };
  }

  async findOne(id: string) {
    const asset = await this.prisma.asset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Asset ${id} not found`);
    }
    return asset;
  }

  async getDownloadUrl(id: string) {
    const asset = await this.findOne(id);
    const url = await this.storageService.getSignedDownloadUrl(asset.storageKey);
    return { url };
  }

  findByOwner(ownerType: string, ownerId: string) {
    return this.prisma.asset.findMany({
      where: { ownerType, ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
