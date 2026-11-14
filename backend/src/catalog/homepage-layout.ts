import { BadRequestException } from '@nestjs/common';
import type { PrismaClient } from '../generated/prisma/client.js';

const storageKey = 'storefront/homepage-layout';
const ownerType = 'HomepageLayout';

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
  for (const item of Array.isArray(input.sections) ? input.sections : []) {
    if (!item || typeof item !== 'object' || !KNOWN.has((item as any).key) || seen.has((item as any).key)) continue;
    seen.add((item as any).key);
    sections.push({
      key: (item as any).key,
      enabled: (item as any).enabled !== false,
      title: typeof (item as any).title === 'string' ? (item as any).title.trim().slice(0, 80) : '',
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
    for (const item of input.sections as any[]) {
      if (!item || !KNOWN.has(item.key)) throw new BadRequestException('Unknown homepage section.');
      if (typeof item.enabled !== 'boolean') throw new BadRequestException('Each section must be shown or hidden.');
      if (item.title !== undefined && (typeof item.title !== 'string' || item.title.length > 80)) throw new BadRequestException('A section heading can be at most 80 characters.');
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
