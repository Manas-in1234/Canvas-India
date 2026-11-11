import { afterEach, expect, it, vi } from 'vitest';
import worker from './worker.js';

afterEach(() => vi.unstubAllGlobals());

it('prices COD from the catalog, leaves payment pending and reuses the same order on retry', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ delivery_codes: [{ postal_code: { cod: 'Y' } }] })));
  const id = '0906792c-5a7b-4157-9914-497b1d20d548';
  const findFirst = vi.fn().mockResolvedValue(null);
  const create = vi.fn(async ({ data }) => ({ ...data }));
  const prisma = {
    product: { findMany: async () => [{ id: 'canvas-1', name: 'Canvas', basePrice: '500', storefront: {} }] },
    customer: { findFirst: async () => ({ id: 'customer' }) },
    order: { findFirst, create },
    $transaction: async (run: (tx: unknown) => unknown) => run({ order: { create } }),
  };
  const payload = {
    paymentMethod: 'COD', requestId: id, customerEmail: 'checkout@example.test',
    shippingAddress: { name: 'Test Customer', phone: '9000000000', street_address: 'Test address', city: 'Hyderabad', state: 'Telangana', postal_code: '500001' },
    items: [{ productId: 'canvas-1', price: 500, quantity: 1 }],
    total: 599,
    payment: { status: 'captured' },
  };
  const place = (body: unknown) => worker.fetch(new Request('https://test.invalid/api/v1/storefront/orders', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }), { _prisma: prisma, _services: {}, DATABASE_URL: '', JWT_ACCESS_SECRET: 'test', DELHIVERY_API_TOKEN: 'test' } as never);

  expect((await place({ ...payload, total: 1 })).status).toBe(409);
  expect(create).not.toHaveBeenCalled();
  expect((await place(payload)).status).toBe(201);
  expect(create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({
    id, total: 599, paymentStatus: 'PENDING', payments: { create: [{ provider: 'COD', status: 'PENDING', amount: 599, currency: 'INR', providerRef: null }] },
  }) }));
  findFirst.mockResolvedValue({ id, orderNumber: 'CC-COD-test', total: 599 });
  expect((await place(payload)).status).toBe(200);
  expect(create).toHaveBeenCalledTimes(1);
});

