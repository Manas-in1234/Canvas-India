import { BadRequestException } from '@nestjs/common';
import type { PrismaClient } from '../generated/prisma/client.js';

const storageKey = 'storefront/homepage-promotions';
const ownerType = 'HomepagePromotions';
const defaults = { saleName: 'Festive Sale', percentage: 20, codes: ['CANVAS10', 'FIRSTPRINT'] };

export class HomepagePromotions {
  constructor(private readonly prisma: PrismaClient) {}

  async settings(): Promise<typeof defaults> {
    const asset = await this.prisma.asset.findUnique({ where: { storageKey }, select: { contentBytes: true } });
    return asset?.contentBytes ? JSON.parse(new TextDecoder().decode(asset.contentBytes)) : defaults;
  }

  async storefront() {
    const { codes, ...sale } = await this.settings();
    const discounts = await this.prisma.discount.findMany({ where: { code: { in: codes }, isActive: true } });
    const now = new Date();
    return { ...sale, coupons: codes.flatMap(code => {
      const discount = discounts.find(row => row.code === code);
      if (!discount || (discount.startsAt && discount.startsAt > now) || (discount.expiresAt && discount.expiresAt <= now) ||
          (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit)) return [];
      const value = Number(discount.value);
      const desc = discount.discountType === 'PERCENTAGE'
        ? `${value}% OFF${discount.maxDiscountAmount !== null ? ` (up to ₹${Number(discount.maxDiscountAmount)})` : ''}`
        : `₹${value} OFF`;
      return [{ code, desc }];
    }) };
  }

  async save(body: unknown, adminUserId: string) {
    const input = (body ?? {}) as Partial<typeof defaults>;
    const saleName = typeof input.saleName === 'string' ? input.saleName.trim() : '';
    const percentage = input.percentage;
    if (!saleName || saleName.length > 60 || typeof percentage !== 'number' || !Number.isInteger(percentage) || percentage < 1 || percentage > 100) {
      throw new BadRequestException('Enter a sale name and a whole percentage from 1 to 100.');
    }
    if (!Array.isArray(input.codes) || input.codes.length > 2 || input.codes.some(code => typeof code !== 'string' || code.length > 80)) {
      throw new BadRequestException('Enter up to two discount codes.');
    }
    const codes = [...new Set(input.codes.map(code => code.trim().toUpperCase()).filter(Boolean))];
    const settings = { saleName, percentage, codes };
    const bytes = new TextEncoder().encode(JSON.stringify(settings));
    await this.prisma.$transaction(async tx => {
      const discounts = await tx.discount.findMany({ where: { code: { in: codes } }, select: { code: true } });
      const missing = codes.find(code => !discounts.some(discount => discount.code === code));
      if (missing) throw new BadRequestException(`Discount code ${missing} has not been created yet. Create it in Discount Codes first.`);
      const data = { contentBytes: bytes, fileSize: bytes.byteLength };
      await tx.asset.upsert({ where: { storageKey }, update: data, create: {
        ...data, storageKey, ownerType, ownerId: 'homepage', fileName: 'promotions.json',
        mimeType: 'application/json', assetType: 'ORIGINAL', uploadStatus: 'READY',
      } });
      await tx.auditLog.create({ data: { adminUserId, action: 'HOMEPAGE_PROMOTIONS_UPDATED', entityType: ownerType, entityId: 'homepage' } });
    });
    return settings;
  }
}
