import { expect, it, vi } from 'vitest';
import type { PrismaClient } from '../generated/prisma/client.js';
import { Occasions } from './occasions.js';

it('publishes new occasions and restores existing covers independently of the text', async () => {
  type Asset = { ownerId: string; ownerType: string; storageKey: string; fileName: string; contentBytes?: Uint8Array; checksum?: string };
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
    deleteMany: async ({ where }: { where: { storageKey: string | { in: string[] }; fileName?: string } }) => {
      const keys = typeof where.storageKey === 'string' ? [where.storageKey] : where.storageKey.in;
      return { count: keys.filter(key => (!where.fileName || rows.get(key)?.fileName === where.fileName) && rows.delete(key)).length };
    },
  };
  const auditLog = { create: vi.fn() };
  const prisma = { asset, $transaction: async (run: (tx: unknown) => Promise<unknown>) => run({ asset, auditLog }) };
  const occasions = new Occasions(prisma as unknown as PrismaClient);
  const original = (await occasions.list()).find(row => row.slug === 'brothers-day');
  expect(original?.heroTitle).toBe("Brother's Day Gifts & Prints");
  expect(original?.bannerColor).toBeUndefined();
  const details = {
    name: 'Sibling Day',
    heroTitle: 'Gifts to celebrate siblings',
    tagline: 'Personalized prints',
    pitchHeadline: 'Celebrate together',
    pitchText: 'Print a favourite memory.',
  };
  await expect(occasions.save('brothers-day', { ...details, bannerColor: 'red' }, false, 'editor'))
    .rejects.toThrow('valid banner fade color');
  await occasions.save('brothers-day', { ...details, bannerColor: '#a1b2c3' }, false, 'editor');
  await occasions.save('brothers-day', details, false, 'editor');
  const bytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jIioAAAAASUVORK5CYII=', 'base64');
  const form = new FormData();
  form.set('file', new Blob([bytes], { type: 'image/png' }), 'cover.png');
  await occasions.images.upload('brothers-day', new Request('https://test.invalid', { method: 'POST', body: form }), 'editor');
  const custom = (await occasions.list(true)).find(row => row.slug === 'brothers-day');
  expect(custom).toMatchObject({ ...details, bannerColor: '#A1B2C3', accent: original?.accent,
    hasCustomCover: true, originalImage: original?.bannerImage });
  expect(custom?.bannerImage).toMatch(/^\/api\/v1\/occasions\/brothers-day\/cover\?v=/);
  expect((await occasions.images.get('brothers-day'))?.contentBytes).toEqual(new Uint8Array(bytes));
  await occasions.images.reset('brothers-day', 'editor');
  expect((await occasions.list(true)).find(row => row.slug === 'brothers-day')).toMatchObject({
    ...details, bannerColor: '#A1B2C3', bannerImage: original?.bannerImage, hasCustomCover: false,
  });
  await occasions.save('brothers-day', { ...details, bannerColor: null }, false, 'editor');
  expect((await occasions.list()).find(row => row.slug === 'brothers-day')).toMatchObject({
    ...details, bannerColor: null, accent: original?.accent,
  });

  await occasions.save('graduation', { ...details, name: 'Graduation', bannerColor: '#e0f2fe' }, true, 'editor');
  expect((await occasions.list()).find(row => row.slug === 'graduation')).toMatchObject({
    name: 'Graduation', group: 'occasion', categorySlugs: ['canvas', 'acrylic'],
    bannerImage: '/assets/acrylic/acrylic-gift.webp', bannerColor: '#E0F2FE',
  });
  await expect(occasions.save('graduation', details, true, 'editor')).rejects.toThrow('already exists');
  expect((await occasions.list()).find(row => row.slug === 'graduation')?.name).toBe('Graduation');

  await occasions.setVisibility('brothers-day', 'hidden', 'editor');
  expect((await occasions.list()).some(row => row.slug === 'brothers-day')).toBe(false);
  expect((await occasions.list(true)).find(row => row.slug === 'brothers-day')).toMatchObject({ ...details, hidden: true });
  await occasions.save('brothers-day', { ...details, name: 'Edited while hidden' }, false, 'editor');
  expect((await occasions.list()).some(row => row.slug === 'brothers-day')).toBe(false);
  await occasions.setVisibility('brothers-day', 'visible', 'editor');
  expect((await occasions.list()).find(row => row.slug === 'brothers-day')?.name).toBe('Edited while hidden');
  await occasions.setVisibility('brothers-day', 'deleted', 'editor');
  await occasions.setVisibility('graduation', 'deleted', 'editor');
  await occasions.setVisibility('graduation', 'deleted', 'editor');
  expect((await occasions.list(true)).some(row => ['brothers-day', 'graduation'].includes(row.slug))).toBe(false);
  await expect(occasions.setVisibility('brothers-day', 'visible', 'editor')).rejects.toThrow('Occasion not found');
  await expect(occasions.save('graduation', details, true, 'editor')).rejects.toThrow('previously used');
});

it('lets a new occasion be created as a festival, and rejects an invalid group', async () => {
  type Asset = { ownerId: string; ownerType: string; storageKey: string; contentBytes: Uint8Array };
  const rows = new Map<string, Asset>();
  const asset = {
    findUnique: async ({ where }: { where: { storageKey: string } }) => rows.get(where.storageKey),
    findMany: async ({ where }: { where: { ownerType: string } }) =>
      [...rows.values()].filter(row => row.ownerType === where.ownerType),
    create: async ({ data }: { data: Asset }) => rows.set(data.storageKey, data),
  };
  const auditLog = { create: vi.fn() };
  const prisma = { asset, $transaction: async (run: (tx: unknown) => Promise<unknown>) => run({ asset, auditLog }) };
  const occasions = new Occasions(prisma as unknown as PrismaClient);
  const details = {
    name: 'Pride Day', heroTitle: 'Celebrate', tagline: 'Prints', pitchHeadline: 'Headline', pitchText: 'Text.',
  };

  await occasions.save('pride-day', { ...details, group: 'festival' }, true, 'editor');
  expect((await occasions.list()).find(row => row.slug === 'pride-day')).toMatchObject({ group: 'festival' });

  await expect(occasions.save('bad-group', { ...details, group: 'holiday' }, true, 'editor'))
    .rejects.toThrow("group must be 'occasion' or 'festival'");

  // Omitted entirely: defaults to 'occasion', matching every existing call site that never sends it.
  await occasions.save('no-group-given', details, true, 'editor');
  expect((await occasions.list()).find(row => row.slug === 'no-group-given')).toMatchObject({ group: 'occasion' });
});

it('does not change an existing default occasion\'s group when only its text is edited', async () => {
  const rows = new Map<string, { ownerId: string; ownerType: string; storageKey: string; contentBytes: Uint8Array }>();
  const asset = {
    findUnique: async ({ where }: { where: { storageKey: string } }) => rows.get(where.storageKey),
    findMany: async ({ where }: { where: { ownerType: string } }) =>
      [...rows.values()].filter(row => row.ownerType === where.ownerType),
    upsert: async ({ where, create, update }: { where: { storageKey: string }; create: any; update: any }) => {
      const row = rows.get(where.storageKey);
      const saved = row ? { ...row, ...update } : create;
      rows.set(where.storageKey, saved);
      return saved;
    },
  };
  const auditLog = { create: vi.fn() };
  const prisma = { asset, $transaction: async (run: (tx: unknown) => Promise<unknown>) => run({ asset, auditLog }) };
  const occasions = new Occasions(prisma as unknown as PrismaClient);
  const before = (await occasions.list()).find(row => row.slug === 'diwali');
  expect(before?.group).toBe('festival');

  await occasions.save('diwali', {
    name: 'Diwali', heroTitle: 'New title', tagline: 'New tagline', pitchHeadline: 'New headline', pitchText: 'New text.',
  }, false, 'editor');

  const after = (await occasions.list()).find(row => row.slug === 'diwali');
  expect(after?.group).toBe('festival');
  expect(after?.heroTitle).toBe('New title');
});
