import { expect, it } from 'vitest';
import worker from './worker.js';

const env = { _services: {}, DATABASE_URL: '' };

it('serves empty content for a page with no overrides, so every field falls back to its default', async () => {
  const prisma = { supportPageContent: { findUnique: async () => null } };
  const response = await worker.fetch(new Request('https://test.invalid/api/v1/support-pages/privacy-policy'),
    { _prisma: prisma, ...env } as never);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ slug: 'privacy-policy', content: {} });
});

it('serves saved overrides for a page', async () => {
  const prisma = { supportPageContent: { findUnique: async () => ({ slug: 'about-us', content: { f1: 'Our Story' } }) } };
  const response = await worker.fetch(new Request('https://test.invalid/api/v1/support-pages/about-us'),
    { _prisma: prisma, ...env } as never);
  expect(await response.json()).toEqual({ slug: 'about-us', content: { f1: 'Our Story' } });
});

it('requires authentication for the admin route', async () => {
  const response = await worker.fetch(new Request('https://test.invalid/api/v1/admin/support-pages/privacy-policy'),
    { _prisma: {}, ...env } as never);
  expect(response.status).toBe(401);
});
