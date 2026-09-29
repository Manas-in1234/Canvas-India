import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { StorageService } from './storage.service.js';
import sharp from 'sharp';

const MAX_FILE_SIZE_BYTES = 40 * 1024 * 1024; // 40 MB
const THUMBNAIL_MAX_DIMENSION = 300;
const PREVIEW_MAX_DIMENSION = 1600;

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
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
   * Client confirms the direct upload completed; this processes thumbnail/
   * preview generation synchronously.
   */
  async confirmUpload(assetId: string) {
    const asset = await this.prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      throw new NotFoundException(`Asset ${assetId} not found`);
    }

    await this.prisma.asset.update({ where: { id: assetId }, data: { uploadStatus: 'PROCESSING' } });

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

      return { assetId, status: 'READY' };
    } catch (error) {
      this.logger.error(`Image processing failed for asset ${assetId}`, error as Error);
      await this.prisma.asset.update({ where: { id: assetId }, data: { uploadStatus: 'FAILED' } });
      throw error;
    }
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
