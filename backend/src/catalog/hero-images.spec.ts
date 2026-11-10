import { createHmac } from 'node:crypto';
import { expect, it, vi } from 'vitest';
import worker from '../worker.js';
import { HERO_IMAGE_MAX_BYTES, HERO_IMAGE_SLOTS } from './hero-image-slots.js';

it('publishes and restores one hero slot without changing the others', async () => {
  const rows = new Map();
  const asset = {
    upsert: vi.fn(async ({ where, create, update }) => {
      const value = rows.has(where.storageKey) ? { ...rows.get(where.storageKey), ...update } : create;
      rows.set(where.storageKey, value);
      return { ownerId: value.ownerId, fileName: value.fileName, checksum: value.checksum };
    }),
    findUnique: vi.fn(async ({ where }) => rows.get(where.storageKey) ?? null),
    findMany: vi.fn(async () => Array.from(rows.values(), ({ ownerId, fileName, checksum }) => ({ ownerId, fileName, checksum }))),
    deleteMany: vi.fn(async ({ where }) => ({ count: Number(rows.delete(where.storageKey)) })),
  };
  const auditLog = { create: vi.fn() };
  const prisma = {
    asset,
    $transaction: vi.fn(async (run) => run({ asset, auditLog })),
    adminUser: {
      findUnique: vi.fn(async ({ where }) => ({
        id: where.id,
        isActive: true,
        updatedAt: new Date(0),
        role: { permissions: where.id === 'editor' ? [{ permission: { key: 'products.edit' } }] : [] },
      })),
    },
  };
  const secret = 'test-secret';
  function authorization(sub: string) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ sub })).toString('base64url');
    const signature = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
    return { Authorization: `Bearer ${header}.${payload}.${signature}` };
  }
  const editor = authorization('editor');
  const env = { _prisma: prisma, _services: {}, DATABASE_URL: '', JWT_ACCESS_SECRET: secret, JWT_REFRESH_SECRET: '' };
  const fetch = (path: string, init?: RequestInit) => worker.fetch(new Request(`https://test.invalid/api/v1${path}`, init), env);
  const slot = '/hero-images/canvas';
  const adminSlot = '/admin' + slot;
  const png = Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jIioAAAAASUVORK5CYII=', 'base64'));
  function upload(file: Blob, fileName: string, headers?: HeadersInit) {
    const body = new FormData();
    body.set('file', file, fileName);
    return fetch(adminSlot, { method: 'POST', headers, body });
  }
  const image = new Blob([png], { type: 'image/png' });
  expect((await upload(image, 'one.png')).status).toBe(401);
  expect((await upload(image, 'one.png', authorization('viewer'))).status).toBe(403);
  const logging = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    expect((await upload(new Blob(['<svg/>'], { type: 'image/png' }), 'fake.png', editor)).status).toBe(400);
    expect((await upload(new Blob([new Uint8Array(HERO_IMAGE_MAX_BYTES + 1)]), 'large.png', editor)).status).toBe(400);
  } finally {
    logging.mockRestore();
  }
  expect(rows.size).toBe(0);
  expect((await upload(image, 'one.png', editor)).status).toBe(200);
  expect((await upload(image, 'replacement.png', editor)).status).toBe(200);
  const entries = await (await fetch('/admin/hero-images', { headers: editor })).json();
  expect(entries).toEqual([{ ownerId: 'canvas', fileName: 'replacement.png', checksum: expect.any(String) }]);
  const response = await fetch(slot);
  expect(response.headers.get('Content-Type')).toBe('image/png');
  expect(new Uint8Array(await response.arrayBuffer())).toEqual(png);
  expect((await fetch(slot, { headers: { 'If-None-Match': response.headers.get('ETag')! } })).status).toBe(304);
  for (const [otherSlot, settings] of Object.entries(HERO_IMAGE_SLOTS)) {
    if (otherSlot === 'canvas') continue;
    const fallback = await fetch('/hero-images/' + otherSlot);
    expect(fallback.status).toBe(307);
    expect(fallback.headers.get('Location')).toBe(new URL(settings.fallback, 'https://canvassindia.com').href);
  }
  expect((await fetch(adminSlot, { method: 'DELETE', headers: editor })).status).toBe(204);
  expect((await fetch(slot)).headers.get('Location')).toBe('https://canvassindia.com' + HERO_IMAGE_SLOTS.canvas.fallback);
  expect(auditLog.create).toHaveBeenCalledTimes(3);
});
