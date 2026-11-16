import { expect, it, vi } from 'vitest';
import { isSupportPage, SupportPages } from './support-pages.js';

it('publishes edits only to supported pages and restores the original by clearing overrides', async () => {
  const rows = new Map<string, { contentBytes: Uint8Array; updatedAt: Date }>();
  const asset = {
    findUnique: vi.fn(async ({ where }) => rows.get(where.storageKey)),
    upsert: vi.fn(async ({ where, update }) => rows.set(where.storageKey, { ...update, updatedAt: new Date() })),
  };
  const auditLog = { create: vi.fn() };
  const pages = new SupportPages({ asset, $transaction: async (run) => run({ asset, auditLog }) } as never);
  expect(isSupportPage('shipping-policy')).toBe(false);
  expect(isSupportPage('track-order')).toBe(false);
  const about = await pages.admin('about-us');
  const image = about.fields.find(field => field.kind === 'image')!;
  const link = about.fields.find(field => field.kind === 'link')!;
  await expect(pages.save('about-us', { [link.key]: 'javascript:alert(1)' }, 'admin')).rejects.toThrow('HTTPS');
  await expect(pages.save('about-us', { [image.key]: '//another.example/image' }, 'admin')).rejects.toThrow('HTTPS');
  await expect(pages.save('about-us', { unknown: 'copy' }, 'admin')).rejects.toThrow('Invalid field');
  expect(asset.upsert).not.toHaveBeenCalled();
  expect((await pages.save('about-us', { [image.key]: '/assets/new.webp', [link.key]: '/canvas' }, 'admin')).content)
    .toEqual({ [image.key]: '/assets/new.webp', [link.key]: '/canvas' });
  expect((await pages.read('privacy-policy')).content).toEqual({});
  expect((await pages.save('about-us', {}, 'admin')).content).toEqual({});
  expect(auditLog.create).toHaveBeenCalledTimes(2);
});
