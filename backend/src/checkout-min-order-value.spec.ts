import { expect, it, vi } from 'vitest';
import worker from './worker.js';

it('rejects checkout below the configured minimum order value, allows it once met or disabled', async () => {
  const create = vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'order-1', orderNumber: 'CC10001', ...data }));
  let minOrderValue = '500';
  const prisma = {
    storeSetting: { findUnique: async () => (minOrderValue ? { key: 'min_order_value', value: minOrderValue } : null) },
    customer: { findFirst: async () => null, create: async (args: { data: Record<string, unknown> }) => ({ id: 'customer', ...args.data }) },
    order: { findUnique: async () => null, count: async () => 0, create },
    $transaction: async (run: (tx: unknown) => unknown) => run({ order: { create } }),
  };
  const payload = {
    customerEmail: 'checkout@example.test',
    items: [{ productId: 'canvas-1', price: 300, quantity: 1 }],
    subtotal: 300,
    total: 300,
  };
  const place = (body: unknown) => worker.fetch(new Request('https://test.invalid/api/v1/storefront/orders', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }), { _prisma: prisma, _services: {}, DATABASE_URL: '', JWT_ACCESS_SECRET: 'test' } as never);

  const belowMin = await place(payload);
  expect(belowMin.status).toBe(400);
  expect(create).not.toHaveBeenCalled();

  const atMin = await place({ ...payload, items: [{ productId: 'canvas-1', price: 500, quantity: 1 }], subtotal: 500, total: 500 });
  expect(atMin.status).toBe(201);

  minOrderValue = '';
  const disabled = await place(payload);
  expect(disabled.status).toBe(201);
});
