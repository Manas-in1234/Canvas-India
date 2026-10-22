import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AuditService } from '../../audit/audit.service.js';
import { StorageService } from '../assets/storage.service.js';
import sharp from 'sharp';
import potrace from 'potrace';
import svgpath from 'svgpath';

const PREVIEW_MAX_DIMENSION = 600;
const TRACE_THRESHOLD = 180; // tuned for plain/solid-background uploads

@Injectable()
export class ShapesService {
  private readonly logger = new Logger(ShapesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly storageService: StorageService,
  ) {}

  findOne(id: string) {
    return this.getExisting(id);
  }

  findAll(status?: string) {
    return this.prisma.customShape.findMany({
      where: status ? { status: status as never } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Shapes customers can actually pick from in the live customizer. */
  findApproved() {
    return this.prisma.customShape.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Admin uploads a photo of a shape; this traces its silhouette into a
   * normalized SVG path and saves it PENDING for review — mirrors Artwork's
   * create-then-review flow so a bad auto-trace never reaches customers
   * without a human looking at it first.
   */
  async create(dto: { name: string; sourceAssetId: string; createdBy: string }) {
    const sourceAsset = await this.prisma.asset.findUnique({ where: { id: dto.sourceAssetId } });
    if (!sourceAsset) {
      throw new NotFoundException(`Asset ${dto.sourceAssetId} not found`);
    }

    const original = await this.storageService.getObjectBuffer(sourceAsset.storageKey);
    const metadata = await sharp(original).metadata();
    const width = metadata.width;
    const height = metadata.height;
    if (!width || !height) {
      throw new BadRequestException('Could not read image dimensions for shape tracing');
    }

    const svgPathData = await this.traceToNormalizedPath(original, width, height);

    const previewBuffer = await sharp(original)
      .resize(PREVIEW_MAX_DIMENSION, PREVIEW_MAX_DIMENSION, { fit: 'inside' })
      .png()
      .toBuffer();
    const previewKey = this.storageService.buildStorageKey('CustomShape', dto.sourceAssetId, 'preview.png');
    await this.storageService.putObjectBuffer(previewKey, previewBuffer, 'image/png');

    const previewAsset = await this.prisma.asset.create({
      data: {
        ownerType: 'CustomShape',
        ownerId: dto.sourceAssetId,
        storageKey: previewKey,
        fileName: 'preview.png',
        mimeType: 'image/png',
        fileSize: previewBuffer.byteLength,
        assetType: 'PREVIEW',
        uploadStatus: 'READY',
      },
    });

    return this.prisma.customShape.create({
      data: {
        name: dto.name,
        sourceAssetId: dto.sourceAssetId,
        previewAssetId: previewAsset.id,
        svgPathData,
        status: 'PENDING',
        createdBy: dto.createdBy,
      },
    });
  }

  async approve(id: string, adminUserId: string, reason?: string) {
    const shape = await this.getReviewable(id);

    const updated = await this.prisma.customShape.update({
      where: { id: shape.id },
      data: { status: 'APPROVED', reviewedBy: adminUserId, reviewedAt: new Date() },
    });

    await this.auditService.record({
      adminUserId,
      action: 'CUSTOM_SHAPE_APPROVED',
      entityType: 'CustomShape',
      entityId: id,
      reason,
    });

    return updated;
  }

  async reject(id: string, adminUserId: string, reason?: string) {
    const shape = await this.getReviewable(id);

    const updated = await this.prisma.customShape.update({
      where: { id: shape.id },
      data: { status: 'REJECTED', reviewedBy: adminUserId, reviewedAt: new Date(), rejectionReason: reason },
    });

    await this.auditService.record({
      adminUserId,
      action: 'CUSTOM_SHAPE_REJECTED',
      entityType: 'CustomShape',
      entityId: id,
      reason,
    });

    return updated;
  }

  /**
   * Thresholds the image to a binary silhouette, traces its outline with
   * potrace, then rescales the resulting path from pixel space into the
   * objectBoundingBox (0-1) coordinate space the storefront's hand-authored
   * clipPaths already use (see acrylic-clip-shape-heart), so a dynamically
   * injected <clipPath> for this shape behaves identically to a built-in one.
   */
  private traceToNormalizedPath(imageBuffer: Buffer, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
      potrace.trace(
        imageBuffer,
        { threshold: TRACE_THRESHOLD, blackOnWhite: false, optCurve: true },
        (err: Error | null, svg: string) => {
          if (err) {
            this.logger.error('Potrace tracing failed', err);
            reject(new BadRequestException('Could not trace an outline from this image'));
            return;
          }

          const pathMatch = /<path[^>]*\sd="([^"]+)"/.exec(svg);
          if (!pathMatch) {
            reject(new BadRequestException('Tracing produced no usable outline for this image'));
            return;
          }

          const normalized = svgpath(pathMatch[1]).scale(1 / width, 1 / height).round(4).toString();
          resolve(normalized);
        },
      );
    });
  }

  private async getExisting(id: string) {
    const shape = await this.prisma.customShape.findUnique({ where: { id } });
    if (!shape) {
      throw new NotFoundException(`Shape ${id} not found`);
    }
    return shape;
  }

  private async getReviewable(id: string) {
    const shape = await this.getExisting(id);
    if (shape.status !== 'PENDING') {
      throw new BadRequestException('This shape has already been reviewed');
    }
    return shape;
  }
}
