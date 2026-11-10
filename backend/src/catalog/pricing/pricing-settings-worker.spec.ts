import { createHmac } from 'node:crypto';
import { expect, it, vi } from 'vitest';
import worker from '../../worker.js';

it('publishes authorized material rate edits, rejects invalid writes and protects admin routes', async () => {
  const values = new Map([['shape_area_rate_per_sqin', '1.65']]);
  const prisma = {
    pricingSetting: {
      findMany: vi.fn(async () => [...values].map(([key, value]) => ({ key, value }))),
      upsert: vi.fn(async ({ where, create, update }) => {
        values.set(where.key, (values.has(where.key) ? update : create).value);
        return { key: where.key, value: values.get(where.key) };
      }),
    },
    adminUser: { findUnique: vi.fn(async () => ({ id: 'editor', isActive: true, updatedAt: new Date(0), role: { permissions: [{ permission: { key: 'pricing.manage' } }] } })) },
  };
  const secret = 'test-secret';
  const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: 'editor' })).toString('base64url');
  const signature = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  const headers = { Authorization: `Bearer ${header}.${payload}.${signature}`, 'Content-Type': 'application/json' };
  const env = { _prisma: prisma, _services: { audit: { record: vi.fn() } }, DATABASE_URL: '', JWT_ACCESS_SECRET: secret };
  const get = (path: string, init?: RequestInit) => worker.fetch(new Request(`https://test.invalid/api/v1${path}`, init), env);
  expect((await get('/admin/pricing-settings')).status).toBe(401);
  for (const [material, value] of [['canvas', '2.35'], ['acrylic', '4.75']]) {
    expect((await get(`/admin/pricing-settings/${material}_shape_area_rate_per_sqin`, { method: 'PATCH', headers, body: JSON.stringify({ value }) })).status).toBe(200);
  }
  for (const value of ['', -1, 'NaN', null]) {
    expect((await get('/admin/pricing-settings/canvas_shape_area_rate_per_sqin', { method: 'PATCH', headers, body: JSON.stringify({ value }) })).status).toBe(400);
  }
  const response = await get('/pricing-settings');
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual(expect.arrayContaining([
    { key: 'canvas_shape_area_rate_per_sqin', value: '2.35' },
    { key: 'acrylic_shape_area_rate_per_sqin', value: '4.75' },
  ]));
  expect(prisma.pricingSetting.upsert).toHaveBeenCalledTimes(2);
});
