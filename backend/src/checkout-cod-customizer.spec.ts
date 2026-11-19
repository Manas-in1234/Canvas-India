import { afterEach, expect, it, vi } from 'vitest';
import worker from './worker.js';

afterEach(() => vi.unstubAllGlobals());

it('blocks COD for a customized item unless the admin has enabled it, and allows catalog-only COD regardless', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ delivery_codes: [{ postal_code: { cod: 'Y' } }] })));
  const create = vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'order-1', ...data }));
  let codEnabledForCustomizer = false;
  const prisma = {
    product: { findMany: async () => [] },
    customer: { findFirst: async () => ({ id: 'customer' }) },
    storeSetting: {
      findUnique: async ({ where }: { where: { key: string } }) =>
        where.key === 'cod_enabled_for_customizer' ? { value: codEnabledForCustomizer ? '1' : '0' } : null,
    },
    order: { findFirst: async () => null, create },
    $transaction: async (run: (tx: unknown) => unknown) => run({ order: { create } }),
  };
  const address = { name: 'Test Customer', phone: '9000000000', street_address: 'Test address', city: 'Hyderabad', state: 'Telangana', postal_code: '500001' };
  const place = (items: unknown[], total: number) => worker.fetch(new Request('https://test.invalid/api/v1/storefront/orders', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      paymentMethod: 'COD', requestId: crypto.randomUUID(), customerEmail: 'checkout@example.test',
      shippingAddress: address, items, total, payment: { status: 'captured' },
    }),
  }), { _prisma: prisma, _services: {}, DATABASE_URL: '', JWT_ACCESS_SECRET: 'test', DELHIVERY_API_TOKEN: 'test' } as never);

  const customizedItem = [{ price: 500, quantity: 1, customizationDetails: { shapeName: 'Square' } }];

  const blocked = await place(customizedItem, 599);
  expect(blocked.status).toBe(422);
  expect(create).not.toHaveBeenCalled();

  codEnabledForCustomizer = true;
  const allowed = await place(customizedItem, 599);
  expect(allowed.status).toBe(201);
});

it('adds the admin-configured COD surcharge to the expected total', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ delivery_codes: [{ postal_code: { cod: 'Y' } }] })));
  const create = vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'order-1', ...data }));
  const prisma = {
    product: { findMany: async () => [{ id: 'canvas-1', basePrice: '500', storefront: {} }] },
    customer: { findFirst: async () => ({ id: 'customer' }) },
    storeSetting: {
      findUnique: async ({ where }: { where: { key: string } }) =>
        where.key === 'cod_surcharge' ? { value: '25' } : null,
    },
    order: { findFirst: async () => null, create },
    $transaction: async (run: (tx: unknown) => unknown) => run({ order: { create } }),
  };
  const address = { name: 'Test Customer', phone: '9000000000', street_address: 'Test address', city: 'Hyderabad', state: 'Telangana', postal_code: '500001' };
  const place = (total: number) => worker.fetch(new Request('https://test.invalid/api/v1/storefront/orders', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      paymentMethod: 'COD', requestId: crypto.randomUUID(), customerEmail: 'checkout@example.test',
      shippingAddress: address, items: [{ productId: 'canvas-1', price: 500, quantity: 1 }], total, payment: { status: 'captured' },
    }),
  }), { _prisma: prisma, _services: {}, DATABASE_URL: '', JWT_ACCESS_SECRET: 'test', DELHIVERY_API_TOKEN: 'test' } as never);

  // Without the surcharge included, the total no longer matches what the server expects.
  expect((await place(599)).status).toBe(409);
  // 500 subtotal + 99 shipping (under 999) + 25 COD surcharge = 624.
  expect((await place(624)).status).toBe(201);
});
