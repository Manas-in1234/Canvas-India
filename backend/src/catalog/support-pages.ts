import { BadRequestException } from '@nestjs/common';
import type { PrismaClient } from '../generated/prisma/client.js';
import fieldsByPage from './support-page-fields.js';

export const supportPages = {
  'about-us': 'About Us',
  'refund-policy': 'Returns & Replacement Policy',
  'cancellation-policy': 'Cancellation Policy',
  'privacy-policy': 'Privacy Policy',
  'terms-and-conditions': 'Terms of Service',
} as const;
export type SupportPage = keyof typeof supportPages;
export function isSupportPage(page: string): page is SupportPage {
  return Object.hasOwn(supportPages, page);
}

function allowedUrl(value: string, image: boolean) {
  if (!value) return !image;
  if (/[\\\u0000-\u0020\u007f]/.test(value)) return false;
  if (value.startsWith('/')) return !value.startsWith('//');
  if (!image && value.startsWith('#')) return true;
  try {
    const url = new URL(value);
    return !url.username && !url.password &&
      (url.protocol === 'https:' || (!image && ['mailto:', 'tel:'].includes(url.protocol)));
  } catch {
    return false;
  }
}

export class SupportPages {
  constructor(private readonly prisma: PrismaClient) {}

  async read(page: SupportPage) {
    const asset = await this.prisma.asset.findUnique({
      where: { storageKey: 'storefront/support-pages/' + page }, select: { contentBytes: true },
    });
    const content: Record<string, string> = asset?.contentBytes ? JSON.parse(new TextDecoder().decode(asset.contentBytes)) : {};
    return { content };
  }

  async admin(page: SupportPage) {
    return { title: supportPages[page], fields: fieldsByPage[page], ...await this.read(page) };
  }

  async save(page: SupportPage, body: unknown, adminUserId: string) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new BadRequestException('Invalid page content.');
    const fields = new Map(fieldsByPage[page].map(field => [field.key, field]));
    const changes: Record<string, string> = {};
    for (const [key, value] of Object.entries(body)) {
      const field = fields.get(key);
      if (!field || typeof value !== 'string' || value.length > 4000) throw new BadRequestException('Invalid field or field is too long.');
      if (field.kind !== 'text' && !allowedUrl(value, field.kind === 'image')) {
        throw new BadRequestException('Use an HTTPS URL or a website path. Contact links may use mailto: or tel:.');
      }
      if (value !== field.value) changes[key] = value;
    }
    const contentBytes = new TextEncoder().encode(JSON.stringify(changes));
    if (contentBytes.length > 128 * 1024) throw new BadRequestException('Page content is too large.');
    await this.prisma.$transaction(async tx => {
      const storageKey = 'storefront/support-pages/' + page;
      const data = { contentBytes, fileSize: contentBytes.length };
      await tx.asset.upsert({ where: { storageKey }, update: data, create: {
        ...data, storageKey, ownerType: 'SupportPage', ownerId: page, fileName: page + '.json',
        mimeType: 'application/json', assetType: 'ORIGINAL', uploadStatus: 'READY',
      } });
      await tx.auditLog.create({ data: { adminUserId, action: 'SUPPORT_PAGE_PUBLISHED', entityType: 'SupportPage', entityId: page } });
    });
    return this.admin(page);
  }
}
