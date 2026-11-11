import { expect, it, vi } from 'vitest';
import { HomepagePromotions } from './homepage-promotions.js';
import type { PrismaClient } from '../generated/prisma/client.js';

it('rejects an uncreated code before writing and displays the saved discount value', async () => {
  let contentBytes: Uint8Array | undefined;
  const discount = { code: 'DEMO', discountType: 'PERCENTAGE', value: '12', maxDiscountAmount: null, startsAt: null, expiresAt: null, usageLimit: null };
  const asset = {
    findUnique: async () => contentBytes ? { contentBytes } : null,
    upsert: vi.fn(async ({ create }) => { contentBytes = create.contentBytes; }),
  };
  const tx = { asset, discount: { findMany: async () => [discount] }, auditLog: { create: vi.fn() } };
  const service = new HomepagePromotions({ ...tx, $transaction: async (run: (db: typeof tx) => unknown) => run(tx) } as unknown as PrismaClient);
  const sale = { saleName: 'Anniversary Sale', percentage: 25 };
  await expect(service.save({ ...sale, codes: ['MISSING'] }, 'admin')).rejects.toThrow('has not been created yet');
  expect(asset.upsert).not.toHaveBeenCalled();
  await service.save({ ...sale, codes: [' demo '] }, 'admin');
  expect(await service.storefront()).toEqual({ ...sale, coupons: [{ code: 'DEMO', desc: '12% OFF' }] });
});
