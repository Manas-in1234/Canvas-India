import { BadRequestException, ConflictException } from '@nestjs/common';
import type { PrismaClient } from '../generated/prisma/client.js';
import { OCCASION_DEFAULTS } from './occasion-defaults.js';
import { HeroImages } from './hero-images.js';

const ownerType = 'StorefrontOccasion';
const prefix = 'storefront/occasions/';
const defaultCover = '/assets/acrylic/acrylic-gift.webp';
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const maxSlug = 64;
const fields = { name: 80, heroTitle: 140, tagline: 250, pitchHeadline: 180, pitchText: 600 } as const;
const hexColor = /^#[0-9a-f]{6}$/i;

function assetKey(slug: string) {
  return prefix + slug + '/content';
}

export function isOccasionSlug(slug: string) {
  return slug.length <= maxSlug && slugPattern.test(slug);
}

export class Occasions {
  readonly images: HeroImages;

  constructor(private readonly prisma: PrismaClient) {
    this.images = new HeroImages(prisma, 'StorefrontOccasionCover', prefix + 'covers/');
  }

  async exists(slug: string) {
    return OCCASION_DEFAULTS.some(row => row.slug === slug)
      || !!await this.prisma.asset.findUnique({ where: { storageKey: assetKey(slug) }, select: { id: true } });
  }

  async list(includeImageStatus = false) {
    const [saved, covers] = await Promise.all([
      this.prisma.asset.findMany({ where: { ownerType }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        select: { ownerId: true, contentBytes: true } }),
      this.images.list(),
    ]);
    const originals = new Map(OCCASION_DEFAULTS.map(row => [row.slug, row]));
    const updates = new Map(saved.filter(row => row.contentBytes).map(row =>
      [row.ownerId, JSON.parse(new TextDecoder().decode(row.contentBytes!))]));
    const coverBySlug = new Map(covers.map(cover => [cover.ownerId, cover]));
    const slugs = new Set([...originals.keys(), ...updates.keys()]);
    return Array.from(slugs, slug => {
      const original = originals.get(slug);
      const cover = coverBySlug.get(slug);
      const originalImage = original?.bannerImage ?? defaultCover;
      return {
        emoji: '🎁', accent: '#0E4A93', tint: 'from-[#0E4A93]/90',
        categorySlugs: ['canvas', 'acrylic'], group: 'occasion',
        ...original, heroTitle: original ? `${original.name} Gifts & Prints` : '',
        ...updates.get(slug), slug,
        bannerImage: cover ? `/api/v1/occasions/${slug}/cover?v=${cover.checksum}` : originalImage,
        ...(includeImageStatus ? { hasCustomCover: !!cover, originalImage } : {}),
      };
    });
  }

  async save(slug: string, body: unknown, creating: boolean, adminUserId: string) {
    const input = (body ?? {}) as Record<string, unknown>;
    if (!isOccasionSlug(slug)) throw new BadRequestException('Use a URL slug with lowercase letters, numbers and hyphens.');
    const text = Object.fromEntries(Object.entries(fields).map(([key, max]) => {
      const raw = input[key];
      const value = typeof raw === 'string' ? raw.trim() : '';
      if (!value || value.length > max) throw new BadRequestException(`Fill in ${key} using up to ${max} characters.`);
      return [key, value];
    }));
    const { bannerColor } = input;
    if (bannerColor !== undefined && bannerColor !== null
      && (typeof bannerColor !== 'string' || !hexColor.test(bannerColor))) {
      throw new BadRequestException('Choose a valid banner fade color.');
    }
    const exists = await this.exists(slug);
    if (creating && exists) throw new ConflictException('An occasion with this URL already exists.');
    if (!creating && !exists) throw new BadRequestException('Occasion not found.');
    await this.prisma.$transaction(async tx => {
      const storageKey = assetKey(slug);
      let color = typeof bannerColor === 'string' ? bannerColor.toUpperCase() : null;
      if (!creating && bannerColor === undefined) {
        const previous = await tx.asset.findUnique({ where: { storageKey }, select: { contentBytes: true } });
        if (previous?.contentBytes) {
          color = JSON.parse(new TextDecoder().decode(previous.contentBytes)).bannerColor ?? null;
        }
      }
      const bytes = new TextEncoder().encode(JSON.stringify({ ...text, bannerColor: color }));
      const data = { contentBytes: bytes, fileSize: bytes.byteLength };
      const create = {
        ...data, storageKey, ownerType, ownerId: slug, fileName: 'occasion.json',
        mimeType: 'application/json', assetType: 'ORIGINAL' as const, uploadStatus: 'READY' as const,
      };
      if (creating) await tx.asset.create({ data: create });
      else await tx.asset.upsert({ where: { storageKey }, create, update: data });
      await tx.auditLog.create({ data: { adminUserId, action: creating ? 'OCCASION_CREATED' : 'OCCASION_UPDATED',
        entityType: ownerType, entityId: slug } });
    }).catch(error => {
      if (error?.code === 'P2002') throw new ConflictException('An occasion with this URL already exists.');
      throw error;
    });
    return { slug };
  }
}
