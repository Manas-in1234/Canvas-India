import { expect, it, vi } from 'vitest';
import type { PrismaClient } from '../generated/prisma/client.js';
import { Occasions } from './occasions.js';

it('publishes new occasions and restores existing covers independently of the text', async () => {
  type Asset = { ownerId: string; ownerType: string; storageKey: string; contentBytes: Uint8Array; checksum?: string };
  const rows = new Map<string, Asset>();
  const asset = {
    findUnique: async ({ where }: { where: { storageKey: string } }) => rows.get(where.storageKey),
    findMany: async ({ where }: { where: { ownerType: string } }) =>
      [...rows.values()].filter(row => row.ownerType === where.ownerType),
    upsert: async ({ where, create, update }: { where: { storageKey: string }; create: Asset; update: Partial<Asset> }) => {
      const row = rows.get(where.storageKey);
      const saved = row ? { ...row, ...update } : create;
      rows.set(where.storageKey, saved);
      return saved;
    },
    create: async ({ data }: { data: Asset }) => rows.set(data.storageKey, data),
    deleteMany: async ({ where }: { where: { storageKey: string } }) => ({ count: Number(rows.delete(where.storageKey)) }),
  };
  const auditLog = { create: vi.fn() };
  const prisma = { asset, $transaction: async (run: (tx: unknown) => Promise<unknown>) => run({ asset, auditLog }) };
  const occasions = new Occasions(prisma as unknown as PrismaClient);
  const original = (await occasions.list()).find(row => row.slug === 'brothers-day');
  expect(original?.heroTitle).toBe("Brother's Day Gifts & Prints");
  const details = {
    name: 'Sibling Day',
    heroTitle: 'Gifts to celebrate siblings',
    tagline: 'Personalized prints',
    pitchHeadline: 'Celebrate together',
    pitchText: 'Print a favourite memory.',
  };
  await occasions.save('brothers-day', details, false, 'editor');
  const bytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jIioAAAAASUVORK5CYII=', 'base64');
  const form = new FormData();
  form.set('file', new Blob([bytes], { type: 'image/png' }), 'cover.png');
  await occasions.images.upload('brothers-day', new Request('https://test.invalid', { method: 'POST', body: form }), 'editor');
  const custom = (await occasions.list(true)).find(row => row.slug === 'brothers-day');
  expect(custom).toMatchObject({ ...details, hasCustomCover: true, originalImage: original?.bannerImage });
  expect(custom?.bannerImage).toMatch(/^\/api\/v1\/occasions\/brothers-day\/cover\?v=/);
  expect((await occasions.images.get('brothers-day'))?.contentBytes).toEqual(new Uint8Array(bytes));
  await occasions.images.reset('brothers-day', 'editor');
  expect((await occasions.list(true)).find(row => row.slug === 'brothers-day')).toMatchObject({
    ...details, bannerImage: original?.bannerImage, hasCustomCover: false,
  });

  await occasions.save('graduation', { ...details, name: 'Graduation' }, true, 'editor');
  expect((await occasions.list()).find(row => row.slug === 'graduation')).toMatchObject({
    name: 'Graduation', group: 'occasion', categorySlugs: ['canvas', 'acrylic'], bannerImage: '/assets/acrylic/acrylic-gift.webp',
  });
  await expect(occasions.save('graduation', details, true, 'editor')).rejects.toThrow('already exists');
  expect((await occasions.list()).find(row => row.slug === 'graduation')?.name).toBe('Graduation');
});
