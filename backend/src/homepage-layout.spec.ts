import { expect, it } from 'vitest';
import worker from './worker.js';

const env = { _services: {}, DATABASE_URL: '' };

it('serves the default layout when nothing has been saved yet', async () => {
  const prisma = { asset: { findUnique: async () => null } };
  const response = await worker.fetch(
    new Request('https://test.invalid/api/v1/homepage-layout'),
    { _prisma: prisma, ...env } as never,
    {} as never,
  );
  expect(response.status).toBe(200);
  const body = (await response.json()) as { storeOpen: boolean; sections: { key: string }[] };
  expect(body.storeOpen).toBe(true);
  expect(body.sections.map((s) => s.key)).toContain('bestsellers');
});

it('serves a saved layout', async () => {
  const saved = { storeOpen: false, closedMessage: 'Back soon', sections: [{ key: 'categories', enabled: false, title: 'Categories' }] };
  const bytes = new TextEncoder().encode(JSON.stringify(saved));
  const prisma = { asset: { findUnique: async () => ({ contentBytes: bytes }) } };
  const response = await worker.fetch(
    new Request('https://test.invalid/api/v1/homepage-layout'),
    { _prisma: prisma, ...env } as never,
    {} as never,
  );
  const body = (await response.json()) as typeof saved;
  expect(body.storeOpen).toBe(false);
  expect(body.closedMessage).toBe('Back soon');
});

it('requires authentication for the admin route', async () => {
  const response = await worker.fetch(
    new Request('https://test.invalid/api/v1/admin/homepage-layout'),
    { _prisma: {}, ...env } as never,
    {} as never,
  );
  expect(response.status).toBe(401);
});
