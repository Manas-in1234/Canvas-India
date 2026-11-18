import { BadRequestException } from '@nestjs/common';
import type { PrismaClient } from '../generated/prisma/client.js';

const storageKey = 'storefront/homepage-layout';
const ownerType = 'HomepageLayout';

// Must match src/api/homepageLayoutApi.ts's DEFAULT_HOMEPAGE_LAYOUT on the
// storefront — these are the fixed, built-in section keys the storefront
// already knows how to render; admins can reorder, retitle, disable them,
// and for 'bestsellers'/'occasions' curate which products show.
const BUILTIN_SECTION_KEYS = ['categories', 'canvas', 'acrylic', 'cork', 'occasions', 'bestsellers', 'bulk', 'why', 'testimonials'];
const CURATABLE_SECTION_KEYS = new Set(['occasions', 'bestsellers']);

interface SectionSetting {
  key: string;
  enabled: boolean;
  title: string;
  productIds?: string[];
}

interface Layout {
  storeOpen: boolean;
  closedMessage: string;
  sections: SectionSetting[];
}

const defaults: Layout = {
  storeOpen: true,
  closedMessage: '',
  sections: BUILTIN_SECTION_KEYS.map((key) => ({ key, enabled: true, title: '' })),
};

export class HomepageLayout {
  constructor(private readonly prisma: PrismaClient) {}

  async settings(): Promise<Layout> {
    const asset = await this.prisma.asset.findUnique({ where: { storageKey }, select: { contentBytes: true } });
    if (!asset?.contentBytes) return defaults;
    const saved = JSON.parse(new TextDecoder().decode(asset.contentBytes)) as Partial<Layout>;
    // Backfill any builtin section key added since this was last saved, so a
    // storefront update never silently drops a new section for admins who
    // already saved a layout.
    const savedKeys = new Set((saved.sections ?? []).map((s) => s.key));
    const sections = [...(saved.sections ?? []), ...BUILTIN_SECTION_KEYS.filter((key) => !savedKeys.has(key)).map((key) => ({ key, enabled: true, title: '' }))];
    return { storeOpen: saved.storeOpen ?? true, closedMessage: saved.closedMessage ?? '', sections };
  }

  async storefront() {
    return this.settings();
  }

  async save(body: unknown, adminUserId: string) {
    const input = (body ?? {}) as Partial<Layout>;
    if (typeof input.storeOpen !== 'boolean') {
      throw new BadRequestException('storeOpen must be true or false.');
    }
    const closedMessage = typeof input.closedMessage === 'string' ? input.closedMessage.trim().slice(0, 200) : '';
    if (!Array.isArray(input.sections) || input.sections.length === 0) {
      throw new BadRequestException('At least one homepage section is required.');
    }
    const sections: SectionSetting[] = input.sections.map((section) => {
      if (!section || typeof section !== 'object' || typeof (section as SectionSetting).key !== 'string') {
        throw new BadRequestException('Each section needs a key.');
      }
      const key = (section as SectionSetting).key;
      const enabled = (section as SectionSetting).enabled !== false;
      const title = typeof (section as SectionSetting).title === 'string' ? (section as SectionSetting).title.trim().slice(0, 80) : '';
      const result: SectionSetting = { key, enabled, title };
      if (CURATABLE_SECTION_KEYS.has(key)) {
        const productIds = (section as SectionSetting).productIds;
        if (productIds !== undefined) {
          if (!Array.isArray(productIds) || productIds.some((id) => typeof id !== 'string')) {
            throw new BadRequestException(`productIds for section "${key}" must be a list of product ids.`);
          }
          result.productIds = productIds.slice(0, 24);
        }
      }
      return result;
    });
    const keys = sections.map((s) => s.key);
    if (new Set(keys).size !== keys.length) {
      throw new BadRequestException('Each homepage section must have a unique key.');
    }
    const settings: Layout = { storeOpen: input.storeOpen, closedMessage, sections };
    const bytes = new TextEncoder().encode(JSON.stringify(settings));
    const data = { contentBytes: bytes, fileSize: bytes.byteLength };
    await this.prisma.$transaction(async (tx) => {
      await tx.asset.upsert({
        where: { storageKey },
        update: data,
        create: { ...data, storageKey, ownerType, ownerId: 'homepage', fileName: 'layout.json', mimeType: 'application/json', assetType: 'ORIGINAL', uploadStatus: 'READY' },
      });
      await tx.auditLog.create({ data: { adminUserId, action: 'HOMEPAGE_LAYOUT_UPDATED', entityType: ownerType, entityId: 'homepage' } });
    });
    return settings;
  }
}
