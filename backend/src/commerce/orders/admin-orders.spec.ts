import { expect, it, vi } from 'vitest';
import { AdminOrders, orderVisibility } from './admin-orders.js';
import { Prisma, type PrismaClient } from '../../generated/prisma/client.js';

it('creates an unpaid catalog-priced draft and keeps visibility changes separate from payment', async () => {
  const events: { type: string }[] = [];
  const draft = vi.fn().mockResolvedValue({ id: 'new-order' });
  const order = {
    findUnique: vi.fn(async () => ({ updatedAt: new Date(), events })),
    create: draft,
    updateMany: vi.fn().mockResolvedValue({ count: 1 }),
  };
  const tx = {
    order,
    orderEvent: { create: async ({ data }: { data: { type: string } }) => events.unshift(data) },
    customer: { findUnique: async () => ({ id: 'customer' }) },
    product: { findMany: async () => [{ id: 'print', name: 'Print', slug: 'print', basePrice: new Prisma.Decimal(99.5) }] },
  };
  const service = new AdminOrders({ ...tx, $transaction: async (run: (client: unknown) => unknown) => run(tx) } as unknown as PrismaClient);
  order.findUnique.mockResolvedValueOnce(null as never);
  await expect(service.create({
    requestId: '0906792c-5a7b-4157-9914-497b1d20d548', customerId: 'customer',
    items: [{ productId: 'print', quantity: 2, price: 1 }], total: 2,
    shippingAddress: { name: 'Test', line1: 'Road', city: 'City', state: 'State', postalCode: '123456', country: 'IN' },
  }, 'admin')).resolves.toEqual({ id: 'new-order' });
  const { data } = draft.mock.calls[0][0];
  expect(Number(data.total)).toBe(199);
  expect(data.paymentStatus).toBeUndefined();
  expect(data.payments).toBeUndefined();

  await service.setVisibility('new-order', 'hide', 'admin');
  expect(orderVisibility(events)).toBe('HIDDEN');
  await service.setVisibility('new-order', 'archive', 'admin');
  expect(orderVisibility(events)).toBe('ARCHIVED');
  await expect(service.setVisibility('new-order', 'show', 'admin')).rejects.toThrow('Restore');
  await service.setVisibility('new-order', 'restore', 'admin');
  expect(orderVisibility(events)).toBe('VISIBLE');
  expect(order.updateMany).toHaveBeenCalledTimes(3);
  expect(order.updateMany.mock.calls.every(([argument]) => !('paymentStatus' in argument.data))).toBe(true);
});
