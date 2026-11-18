import { expect, it } from 'vitest';
import worker from './worker.js';

const call = (prisma: unknown, body: unknown) => worker.fetch(new Request('https://test.invalid/api/v1/storefront/orders/validate', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
}), { _prisma: prisma, _services: {}, DATABASE_URL: '' } as never);

it('rejects when a catalog item price changed, accepts custom items regardless', async () => {
  const prisma = {
    product: { findMany: async () => [{ id: 'canvas-1', basePrice: '500', storefront: {} }] },
    storeSetting: { findUnique: async () => null },
  };
  const stale = await call(prisma, { items: [{ productId: 'canvas-1', price: 1, quantity: 1 }] });
  expect(stale.status).toBe(409);

  const fresh = await call(prisma, { items: [{ productId: 'canvas-1', price: 500, quantity: 1 }] });
  expect(fresh.status).toBe(200);

  const custom = await call(prisma, { items: [{ productId: 'canvas-1', price: 1, quantity: 1, customizationDetails: { size: 'A4' } }] });
  expect(custom.status).toBe(200);
});

it('rejects when below the configured minimum order value', async () => {
  const prisma = {
    product: { findMany: async () => [] },
    storeSetting: { findUnique: async () => ({ key: 'min_order_value', value: '500' }) },
  };
  const belowMin = await call(prisma, { items: [{ productId: 'x', price: 300, quantity: 1, customizationDetails: {} }] });
  expect(belowMin.status).toBe(400);

  const atMin = await call(prisma, { items: [{ productId: 'x', price: 500, quantity: 1, customizationDetails: {} }] });
  expect(atMin.status).toBe(200);
});

it('requires at least one item', async () => {
  const response = await call({}, { items: [] });
  expect(response.status).toBe(400);
});
