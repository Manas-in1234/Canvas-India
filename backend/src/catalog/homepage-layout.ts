import { BadRequestException } from '@nestjs/common';
import type { PrismaClient } from '../generated/prisma/client.js';

const storageKey = 'storefront/homepage-layout';
const ownerType = 'HomepageLayout';
const curatedKey = /^curated-[a-z0-9-]{1,64}$/;
const maxCuratedRows = 12;
const maxProductsPerRow = 24;
const productId = /^[a-zA-Z0-9_-]{1,100}$/;

/** The homepage blocks an admin can show, hide, reorder and rename. The hero banner always comes first. */
export const HOMEPAGE_SECTIONS = [
  { key: 'categories', label: 'Shop by Category', renamable: true },
  { key: 'canvas', label: 'Canvas & Boards', renamable: true },
  { key: 'acrylic', label: 'Acrylic Prints', renamable: true },
  { key: 'cork', label: 'Cork Products', renamable: true },
  { key: 'occasions', label: 'Shop by Occasion', renamable: true },
  { key: 'bestsellers', label: 'Best Sellers', renamable: true },
  { key: 'bulk', label: 'Corporate & Bulk Orders', renamable: false },
  { key: 'why', label: 'Why Choose Canvas India', renamable: false },
  { key: 'testimonials', label: 'What Our Customers Say', renamable: true },
] as const;

export interface HomepageSectionSetting {
  key: string;
  enabled: boolean;
  /** Replaces the section heading on the storefront; empty keeps the built-in heading. */
  title: string;
  productIds?: string[];
}

export interface HomepageLayoutSettings {
  storeOpen: boolean;
  /** Shown in a banner at the top of the homepage while the store is closed. */
  closedMessage: string;
  sections: HomepageSectionSetting[];
}

const DEFAULT_CLOSED_MESSAGE = 'We are currently closed. You can still browse and design, and we will process your order when we reopen.';

export const DEFAULT_LAYOUT: HomepageLayoutSettings = {
  storeOpen: true,
  closedMessage: DEFAULT_CLOSED_MESSAGE,
  sections: HOMEPAGE_SECTIONS.map((s) => ({ key: s.key, enabled: true, title: '' })),
};

const KNOWN = new Set<string>(HOMEPAGE_SECTIONS.map((s) => s.key));

/**
 * Turns whatever was saved into a complete, valid layout: unknown sections are dropped, sections added to
 * the site later appear (enabled, at the end), and text is trimmed. Never throws on old or partial data.
 */
export function normalizeLayout(raw: unknown): HomepageLayoutSettings {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Partial<HomepageLayoutSettings>;
  const seen = new Set<string>();
  const sections: HomepageSectionSetting[] = [];
  let curatedCount = 0;
  for (const item of Array.isArray(input.sections) ? input.sections : []) {
    if (!item || typeof item.key !== 'string' || seen.has(item.key)) continue;
    const curated = curatedKey.test(item.key);
    if (!KNOWN.has(item.key) && !curated) continue;
    const title = typeof item.title === 'string' ? item.title.trim().slice(0, 80) : '';
    const ids = Array.isArray(item.productIds) ? [...new Set(item.productIds.filter(id => typeof id === 'string' && productId.test(id)))].slice(0, maxProductsPerRow) : [];
    if (curated && (!title || !ids.length || curatedCount >= maxCuratedRows)) continue;
    if (curated) curatedCount++;
    seen.add(item.key);
    sections.push({
      key: item.key,
      enabled: item.enabled !== false,
      title,
      ...(curated ? { productIds: ids } : {}),
    });
  }
  for (const s of HOMEPAGE_SECTIONS) if (!seen.has(s.key)) sections.push({ key: s.key, enabled: true, title: '' });
  const message = typeof input.closedMessage === 'string' ? input.closedMessage.trim().slice(0, 240) : '';
  return { storeOpen: input.storeOpen !== false, closedMessage: message || DEFAULT_CLOSED_MESSAGE, sections };
}

export class HomepageLayout {
  constructor(private readonly prisma: PrismaClient) {}

  /** What the storefront reads. Falls back to the built-in layout if nothing was saved or it cannot be read. */
  async settings(): Promise<HomepageLayoutSettings> {
    try {
      const asset = await this.prisma.asset.findUnique({ where: { storageKey }, select: { contentBytes: true } });
      return asset?.contentBytes ? normalizeLayout(JSON.parse(new TextDecoder().decode(asset.contentBytes))) : DEFAULT_LAYOUT;
    } catch {
      return DEFAULT_LAYOUT;
    }
  }

  async save(body: unknown, adminUserId: string): Promise<HomepageLayoutSettings> {
    const input = (body ?? {}) as Partial<HomepageLayoutSettings>;
    if (typeof input.storeOpen !== 'boolean') throw new BadRequestException('Choose whether the store is open or closed.');
    if (!Array.isArray(input.sections)) throw new BadRequestException('The section list is missing.');
    const seen = new Set<string>();
    let curatedCount = 0;
    for (const item of input.sections) {
      if (!item || typeof item.key !== 'string' || (!KNOWN.has(item.key) && !curatedKey.test(item.key))) {
        throw new BadRequestException('Unknown homepage section.');
      }
      if (seen.has(item.key)) throw new BadRequestException('Each homepage section must have a unique key.');
      seen.add(item.key);
      if (typeof item.enabled !== 'boolean') throw new BadRequestException('Each section must be shown or hidden.');
      if (item.title !== undefined && (typeof item.title !== 'string' || item.title.length > 80)) throw new BadRequestException('A section heading can be at most 80 characters.');
      if (curatedKey.test(item.key)) {
        if (++curatedCount > maxCuratedRows) throw new BadRequestException('Add up to 12 curated rows.');
        if (!item.title?.trim() || !Array.isArray(item.productIds) || item.productIds.length < 1 ||
          item.productIds.length > maxProductsPerRow || item.productIds.some(id => typeof id !== 'string' || !productId.test(id))) {
          throw new BadRequestException('Each curated row needs a heading and 1 to 24 products.');
        }
      }
    }
    if (input.closedMessage !== undefined && (typeof input.closedMessage !== 'string' || input.closedMessage.length > 240)) {
      throw new BadRequestException('The closed message can be at most 240 characters.');
    }
    const settings = normalizeLayout(input);
    const bytes = new TextEncoder().encode(JSON.stringify(settings));
    await this.prisma.$transaction(async (tx) => {
      const data = { contentBytes: bytes, fileSize: bytes.byteLength };
      await tx.asset.upsert({
        where: { storageKey },
        update: data,
        create: { ...data, storageKey, ownerType, ownerId: 'homepage', fileName: 'layout.json', mimeType: 'application/json', assetType: 'ORIGINAL', uploadStatus: 'READY' },
      });
      await tx.auditLog.create({
        data: { adminUserId, action: 'HOMEPAGE_LAYOUT_UPDATED', entityType: ownerType, entityId: 'homepage', changes: { storeOpen: settings.storeOpen, hidden: settings.sections.filter((s) => !s.enabled).map((s) => s.key) } },
      });
    });
    return settings;
  }
}
