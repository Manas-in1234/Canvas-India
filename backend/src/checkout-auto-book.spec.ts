import { afterEach, expect, it, vi } from 'vitest';
import worker from './worker.js';

afterEach(() => vi.unstubAllGlobals());

// Flushes pending microtasks/macrotasks so a fire-and-forget background()
// task (no ctx.waitUntil in these tests, so it's `void task.catch(...)`)
// has a chance to run before assertions check its side effects.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function basePrisma(overrides: Record<string, unknown> = {}) {
  const create = vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'order-1', orderStatus: 'CONFIRMED', paymentStatus: 'PENDING', ...data }));
  return {
    product: { findMany: async () => [{ id: 'canvas-1', basePrice: '500', storefront: {} }] },
    customer: { findFirst: async () => ({ id: 'customer' }) },
    order: { findFirst: async () => null, create, findUnique: vi.fn() },
    $transaction: async (run: (tx: unknown) => unknown) => run({ order: { create } }),
    auditLog: { create: vi.fn() },
    ...overrides,
  };
}

const address = { name: 'Test Customer', phone: '9000000000', street_address: 'Test address', city: 'Hyderabad', state: 'Telangana', postal_code: '500001' };
const place = (prisma: unknown, total = 689) =>
  worker.fetch(
    new Request('https://test.invalid/api/v1/storefront/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentMethod: 'COD', requestId: crypto.randomUUID(), customerEmail: 'checkout@example.test',
        shippingAddress: address, items: [{ productId: 'canvas-1', price: 500, quantity: 1 }], total, payment: { status: 'captured' },
      }),
    }),
    { _prisma: prisma, _services: {}, DATABASE_URL: '', JWT_ACCESS_SECRET: 'test', DELHIVERY_API_TOKEN: 'test' } as never,
  );

it('does not attempt to book with Delhivery when auto_book_delhivery is off (the default)', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ delivery_codes: [{ postal_code: { cod: 'Y' } }] })));
  const shipmentCreate = vi.fn();
  const prisma = basePrisma({
    storeSetting: { findUnique: async () => null }, // no row at all = off, same as an admin who never touched the setting
    shipment: { create: shipmentCreate },
  });

  const res = await place(prisma);
  expect(res.status).toBe(201);
  await flush();
  expect(shipmentCreate).not.toHaveBeenCalled();
});

it('does not attempt to book with Delhivery when auto_book_delhivery is explicitly off', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ delivery_codes: [{ postal_code: { cod: 'Y' } }] })));
  const shipmentCreate = vi.fn();
  const prisma = basePrisma({
    storeSetting: { findUnique: async ({ where }: { where: { key: string } }) => (where.key === 'auto_book_delhivery' ? { value: '0' } : null) },
    shipment: { create: shipmentCreate },
  });

  const res = await place(prisma);
  expect(res.status).toBe(201);
  await flush();
  expect(shipmentCreate).not.toHaveBeenCalled();
});

it('attempts to book with Delhivery automatically when auto_book_delhivery is on, never blocking the checkout response', async () => {
  const fetchMock = vi.fn(async (url: string) => {
    if (String(url).includes('pin-codes')) return Response.json({ delivery_codes: [{ postal_code: { cod: 'Y', pre_paid: 'Y' } }] });
    if (String(url).includes('cmu/create')) return Response.json({ success: true, packages: [{ status: 'Success', waybill: '9999000011' }] });
    return Response.json({});
  });
  vi.stubGlobal('fetch', fetchMock);

  const createdOrder = { id: 'order-1', orderNumber: 'CC-AUTO-TEST', orderStatus: 'CONFIRMED', paymentStatus: 'PENDING', total: 599, customer: { name: 'Test Customer', phone: '9000000000' }, shipments: [], payments: [{ id: 'pay-1', provider: 'COD', status: 'PENDING' }], items: [{ id: 'item-1', quantity: 1, productNameSnapshot: 'Canvas', configurationSnapshot: {} }], addresses: [{ type: 'SHIPPING', line1: 'Test address', line2: null, city: 'Hyderabad', state: 'Telangana', postalCode: '500001', phone: '9000000000' }] };
  const shipmentCreate = vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'shipment-1', ...data }));
  const orderUpdate = vi.fn();
  const prisma = basePrisma({
    storeSetting: { findUnique: async ({ where }: { where: { key: string } }) => (where.key === 'auto_book_delhivery' ? { value: '1' } : null) },
    order: { findFirst: async () => null, create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ ...createdOrder, ...data })), findUnique: async () => createdOrder, update: orderUpdate },
    warehouse: { findUnique: async () => null, create: async () => ({ id: 'wh-1', name: 'Test Warehouse' }) },
    shipment: { create: shipmentCreate },
    $transaction: async (run: (tx: unknown) => unknown) => run({ order: { create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ ...createdOrder, ...data })), update: orderUpdate }, shipment: { create: shipmentCreate }, auditLog: { create: vi.fn() } }),
  });

  const res = await place(prisma);
  expect(res.status).toBe(201); // checkout succeeds regardless of what auto-booking does
  await flush();
  expect(shipmentCreate).toHaveBeenCalledTimes(1);
  expect(shipmentCreate.mock.calls[0][0].data).toMatchObject({ awbNumber: '9999000011', status: 'READY' });
});

it('auto-booking failure does not affect the checkout response or throw unhandled', async () => {
  const fetchMock = vi.fn(async (url: string) => {
    if (String(url).includes('pin-codes')) return Response.json({ delivery_codes: [{ postal_code: { cod: 'Y', pre_paid: 'Y' } }] });
    if (String(url).includes('cmu/create')) return Response.json({ success: false, rmk: 'wallet balance too low' });
    return Response.json({});
  });
  vi.stubGlobal('fetch', fetchMock);

  const createdOrder = { id: 'order-1', orderNumber: 'CC-AUTO-FAIL', orderStatus: 'CONFIRMED', paymentStatus: 'PENDING', total: 599, customer: { name: 'Test Customer', phone: '9000000000' }, shipments: [], payments: [{ id: 'pay-1', provider: 'COD', status: 'PENDING' }], items: [{ id: 'item-1', quantity: 1, productNameSnapshot: 'Canvas', configurationSnapshot: {} }], addresses: [{ type: 'SHIPPING', line1: 'Test address', line2: null, city: 'Hyderabad', state: 'Telangana', postalCode: '500001', phone: '9000000000' }] };
  const shipmentCreate = vi.fn();
  const prisma = basePrisma({
    storeSetting: { findUnique: async ({ where }: { where: { key: string } }) => (where.key === 'auto_book_delhivery' ? { value: '1' } : null) },
    order: { findFirst: async () => null, create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ ...createdOrder, ...data })), findUnique: async () => createdOrder },
    warehouse: { findUnique: async () => null, create: async () => ({ id: 'wh-1', name: 'Test Warehouse' }) },
    shipment: { create: shipmentCreate },
  });

  const res = await place(prisma);
  expect(res.status).toBe(201); // still succeeds - Delhivery's wallet being empty is not the customer's problem
  await flush();
  expect(shipmentCreate).not.toHaveBeenCalled(); // booking was rejected by Delhivery, so nothing was recorded (no fake AWB)
});
