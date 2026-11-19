import { BadRequestException } from '@nestjs/common';
import type { PrismaClient } from '../generated/prisma/client.js';

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  text: string;
  img: string;
}

const storageKey = 'storefront/homepage-testimonials';
const ownerType = 'HomepageTestimonials';

// Seeded from the hardcoded list the storefront shipped with before this was
// admin-editable, so existing homepage content doesn't change until an admin
// actually edits it.
const defaults: Testimonial[] = [
  { id: 'seed-1', name: 'Asha S.', city: 'Bengaluru', text: 'Amazing quality and vibrant colours! My canvas turned out even better than I imagined!', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'seed-2', name: 'Rohit P.', city: 'Mumbai', text: 'Loved the personal touch and quick delivery. Will definitely order again!', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 'seed-3', name: 'Sneha T.', city: 'Hyderabad', text: 'Beautiful products, great service and such unique designs. Highly recommended!', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 'seed-4', name: 'Vikram R.', city: 'Delhi', text: 'The acrylic print looks stunning on our living room wall. Packaging was superb.', img: 'https://randomuser.me/api/portraits/men/75.jpg' },
];

function validate(input: unknown): Testimonial[] {
  if (!Array.isArray(input) || input.length > 24) {
    throw new BadRequestException('Provide a list of up to 24 testimonials.');
  }
  return input.map((raw, i) => {
    const row = (raw ?? {}) as Partial<Testimonial>;
    const name = typeof row.name === 'string' ? row.name.trim() : '';
    const city = typeof row.city === 'string' ? row.city.trim() : '';
    const text = typeof row.text === 'string' ? row.text.trim() : '';
    const img = typeof row.img === 'string' ? row.img.trim() : '';
    if (!name || name.length > 80) throw new BadRequestException(`Testimonial ${i + 1}: enter a name (up to 80 characters).`);
    if (!city || city.length > 80) throw new BadRequestException(`Testimonial ${i + 1}: enter a city (up to 80 characters).`);
    if (!text || text.length > 400) throw new BadRequestException(`Testimonial ${i + 1}: enter the review text (up to 400 characters).`);
    if (img && img.length > 2000) throw new BadRequestException(`Testimonial ${i + 1}: photo URL is too long.`);
    const id = typeof row.id === 'string' && row.id.trim() ? row.id.trim() : crypto.randomUUID();
    return { id, name, city, text, img };
  });
}

export class HomepageTestimonials {
  constructor(private readonly prisma: PrismaClient) {}

  async list(): Promise<Testimonial[]> {
    const asset = await this.prisma.asset.findUnique({ where: { storageKey }, select: { contentBytes: true } });
    return asset?.contentBytes ? JSON.parse(new TextDecoder().decode(asset.contentBytes)) : defaults;
  }

  async save(body: unknown, adminUserId: string) {
    const testimonials = validate(body);
    const bytes = new TextEncoder().encode(JSON.stringify(testimonials));
    await this.prisma.$transaction(async tx => {
      const data = { contentBytes: bytes, fileSize: bytes.byteLength };
      await tx.asset.upsert({ where: { storageKey }, update: data, create: {
        ...data, storageKey, ownerType, ownerId: 'homepage', fileName: 'testimonials.json',
        mimeType: 'application/json', assetType: 'ORIGINAL', uploadStatus: 'READY',
      } });
      await tx.auditLog.create({ data: { adminUserId, action: 'HOMEPAGE_TESTIMONIALS_UPDATED', entityType: ownerType, entityId: 'homepage' } });
    });
    return testimonials;
  }
}
