import { BadRequestException } from '@nestjs/common';
import type { PrismaClient } from '../generated/prisma/client.js';
import { HERO_IMAGE_MAX_BYTES } from './hero-image-slots.js';

const ownerType = 'StorefrontHeroImage';

export function heroImageMime(bytes: Uint8Array): string | null {
  if (bytes.length < 24) return null;
  const data = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      && data.toString('ascii', 12, 16) === 'IHDR') return 'image/png';
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff
      && data.at(-2) === 0xff && data.at(-1) === 0xd9) return 'image/jpeg';
  if (data.toString('ascii', 0, 4) === 'RIFF'
      && data.toString('ascii', 8, 12) === 'WEBP'
      && data.readUInt32LE(4) + 8 === data.length
      && ['VP8 ', 'VP8L', 'VP8X'].includes(data.toString('ascii', 12, 16))) return 'image/webp';
  return null;
}

export class HeroImages {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly assetOwnerType = ownerType,
    private readonly storagePrefix = 'storefront/hero-images/',
  ) {}

  private key(slot: string) {
    return this.storagePrefix + slot;
  }

  list() {
    return this.prisma.asset.findMany({
      where: { ownerType: this.assetOwnerType, uploadStatus: 'READY' },
      select: { ownerId: true, fileName: true, checksum: true },
    });
  }

  get(slot: string) {
    return this.prisma.asset.findUnique({
      where: { storageKey: this.key(slot), ownerType: this.assetOwnerType, uploadStatus: 'READY' },
      select: { contentBytes: true, mimeType: true, checksum: true },
    });
  }

  async upload(slot: string, request: Request, adminUserId: string) {
    const maxSizeMessage = 'Choose an image no larger than 4 MB.';
    if (Number(request.headers.get('Content-Length')) > HERO_IMAGE_MAX_BYTES + 16_384) {
      throw new BadRequestException(maxSizeMessage);
    }
    if (!request.headers.get('Content-Type')?.startsWith('multipart/form-data;')) {
      throw new BadRequestException('Choose a JPEG, PNG, or WebP image.');
    }
    // Limit the actual request stream too, since Content-Length can be absent.
    const reader = request.body?.getReader();
    if (!reader) throw new BadRequestException('Choose an image to upload.');
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > HERO_IMAGE_MAX_BYTES + 16_384) {
          await reader.cancel();
          throw new BadRequestException(maxSizeMessage);
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    const form = await new Response(Buffer.concat(chunks), { headers: request.headers }).formData()
      .catch(() => { throw new BadRequestException('The image upload could not be read.'); });
    const file = form.get('file');
    if (!file || typeof file === 'string' || !file.size) throw new BadRequestException('Choose an image to upload.');
    if (file.size > HERO_IMAGE_MAX_BYTES) throw new BadRequestException(maxSizeMessage);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const mimeType = heroImageMime(bytes);
    if (!mimeType) throw new BadRequestException('Choose a valid JPEG, PNG, or WebP image.');
    const checksum = Buffer.from(await crypto.subtle.digest('SHA-256', bytes)).toString('hex');
    const image = {
      fileName: file.name.slice(0, 255),
      fileSize: file.size,
      mimeType,
      checksum,
      contentBytes: bytes,
    };

    return this.prisma.$transaction(async (tx) => {
      const saved = await tx.asset.upsert({
        where: { storageKey: this.key(slot) },
        create: { ...image, ownerType: this.assetOwnerType, ownerId: slot, storageKey: this.key(slot), assetType: 'ORIGINAL', uploadStatus: 'READY' },
        update: image,
        select: { ownerId: true, fileName: true, checksum: true },
      });
      await tx.auditLog.create({ data: {
        adminUserId, action: 'HERO_IMAGE_REPLACED', entityType: this.assetOwnerType, entityId: slot,
      } });
      return saved;
    });
  }

  async reset(slot: string, adminUserId: string) {
    await this.prisma.$transaction(async (tx) => {
      const deleted = await tx.asset.deleteMany({ where: { storageKey: this.key(slot), ownerType: this.assetOwnerType } });
      if (deleted.count) await tx.auditLog.create({ data: {
        adminUserId, action: 'HERO_IMAGE_RESET', entityType: this.assetOwnerType, entityId: slot,
      } });
    });
  }
}
