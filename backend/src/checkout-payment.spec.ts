import { afterEach, expect, it, vi } from 'vitest';
import worker from './worker.js';

afterEach(() => vi.unstubAllGlobals());

it('requires a matching Razorpay capture or verified zero-total coupon before marking orders paid', async () => {
  const create = vi.fn(async ({ data }) => ({ id: 'test-order', ...data }));
  const prisma = {
    order: { findUnique: vi.fn().mockResolvedValue(null) },
    customer: { findFirst: vi.fn().mockResolvedValue({ id: 'customer' }) },
    $transaction: async (run: (tx: unknown) => unknown) => run({ order: { create } }),
  };
  const services = { discounts: {
    validateDiscount: vi.fn().mockResolvedValue({ discountId: 'coupon', discountAmount: 100 }),
    recordRedemption: vi.fn(),
  } };
  const base = {
    items: [{ title: 'Test print', price: 100, quantity: 1 }],
    orderNumber: 'CI-20261114-9999', customerEmail: 'test@example.test', subtotal: 100, total: 100,
  };
  const place = (input: unknown, path = '') => worker.fetch(new Request('https://test.invalid/api/v1/storefront/orders' + path, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input),
  }), { _prisma: prisma, _services: services, RAZORPAY_KEY_ID: 'test', RAZORPAY_KEY_SECRET: 'test' } as never);
  const payment = { id: 'pay_test', status: 'captured', captured: true, amount: 10000, amount_refunded: 0, currency: 'INR', order_id: 'order_test' };
  const gateway = vi.fn().mockImplementation(async (url: string) => Response.json(url.includes('/payments/')
    ? payment : { receipt: base.orderNumber, amount_paid: 10000, currency: 'INR' }));
  vi.stubGlobal('fetch', gateway);

  expect((await place({ ...base, payment: { status: 'captured' } })).status).toBe(400);
  expect((await place({ status: 'captured' }, '/test-order/payment')).status).toBe(404);
  expect(gateway).not.toHaveBeenCalled();
  expect(create).not.toHaveBeenCalled();

  const online = { ...base, payment: { razorpayPaymentId: payment.id } };
  gateway.mockResolvedValueOnce(Response.json({ ...payment, captured: false }));
  expect((await place(online)).status).toBe(409);
  gateway.mockResolvedValueOnce(Response.json(payment)).mockResolvedValueOnce(Response.json({ receipt: 'other-order', amount_paid: 10000, currency: 'INR' }));
  expect((await place(online)).status).toBe(409);
  expect(create).not.toHaveBeenCalled();
  expect((await place(online)).status).toBe(201);
  expect(create.mock.calls[0][0].data.payments.create[0]).toMatchObject({ providerRef: payment.id, amount: 100, status: 'PAID' });

  gateway.mockClear();
  expect((await place({ ...base, total: 0, couponCode: 'FREE' })).status).toBe(201);
  expect(create.mock.calls[1][0].data).toMatchObject({ total: 0, discount: 100, paymentStatus: 'PAID' });
  expect(create.mock.calls[1][0].data.payments).toBeUndefined();
  expect(services.discounts.recordRedemption).toHaveBeenCalled();
  expect(gateway).not.toHaveBeenCalled();
});
