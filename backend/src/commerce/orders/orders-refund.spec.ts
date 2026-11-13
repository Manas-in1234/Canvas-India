import { describe, expect, it, vi } from 'vitest';
import { Prisma } from '../../generated/prisma/client.js';
import { OrdersService } from './orders.service.js';

const money = (v: string) => new Prisma.Decimal(v);

function build(payment: Record<string, unknown> | null, orderOverrides: Record<string, unknown> = {}) {
  const order = {
    id: 'o1',
    orderNumber: 'CI-1',
    orderStatus: 'CONFIRMED',
    shippingStatus: 'NOT_SHIPPED',
    items: [],
    payments: payment ? [payment] : [],
    ...orderOverrides,
  };
  const tx = {
    paymentTransaction: { create: vi.fn().mockResolvedValue({}) },
    payment: { update: vi.fn().mockResolvedValue({}) },
    order: { update: vi.fn().mockResolvedValue({}) },
  };
  const prisma = {
    order: {
      findUnique: vi.fn().mockResolvedValue(order),
      update: vi.fn().mockResolvedValue({ ...order, orderStatus: 'CANCELLED' }),
    },
    orderEvent: { create: vi.fn().mockResolvedValue({}) },
    $transaction: vi.fn(async (fn: (t: typeof tx) => unknown) => fn(tx)),
  };
  const audit = { record: vi.fn().mockResolvedValue({}) };
  const service = new OrdersService(prisma as never, {} as never, {} as never, audit as never, {} as never, {} as never);
  return { service, prisma, tx };
}

const paid = (extra: Record<string, unknown> = {}) => ({
  id: 'p1',
  provider: 'RAZORPAY',
  status: 'PAID',
  amount: money('1000'),
  providerRef: 'pay_abc',
  transactions: [],
  ...extra,
});

describe('OrdersService refunds', () => {
  it('refunds through the gateway in paise and marks the payment refunded', async () => {
    const { service, tx } = build(paid());
    const gateway = vi.fn().mockResolvedValue({ id: 'rfnd_1', status: 'processed' });
    service.setRefundGateway(gateway);

    const result = await service.refund('o1', '1000.00', 'Order cancelled');

    expect(gateway).toHaveBeenCalledWith('pay_abc', 100000, expect.objectContaining({ order: 'CI-1' }));
    expect(tx.payment.update).toHaveBeenCalledWith({ where: { id: 'p1' }, data: { status: 'REFUNDED' } });
    expect(result.status).toBe('REFUNDED');
  });

  it('marks a partial refund as partially refunded', async () => {
    const { service, tx } = build(paid());
    service.setRefundGateway(vi.fn().mockResolvedValue({ id: 'rfnd_2', status: 'processed' }));
    await service.refund('o1', '250.00');
    expect(tx.payment.update).toHaveBeenCalledWith({ where: { id: 'p1' }, data: { status: 'PARTIALLY_REFUNDED' } });
  });

  it('never refunds more than was paid, counting earlier refunds', async () => {
    const { service } = build(
      paid({ status: 'PARTIALLY_REFUNDED', transactions: [{ type: 'REFUND', rawPayload: { amount: '900.00' } }] }),
    );
    const gateway = vi.fn();
    service.setRefundGateway(gateway);
    await expect(service.refund('o1', '200.00')).rejects.toThrow(/remaining/);
    expect(gateway).not.toHaveBeenCalled();
  });

  it('refuses when there is no online payment (cash on delivery or free order)', async () => {
    const { service } = build(null);
    service.setRefundGateway(vi.fn());
    await expect(service.refund('o1', '10.00')).rejects.toThrow(/no online payment/);
  });

  it('refuses a refund on an already fully refunded payment', async () => {
    const { service } = build(paid({ status: 'REFUNDED' }));
    service.setRefundGateway(vi.fn());
    await expect(service.refund('o1', '10.00')).rejects.toThrow(/no online payment/);
  });

  it('cancelling a paid order refunds the full amount automatically', async () => {
    const { service } = build(paid());
    const gateway = vi.fn().mockResolvedValue({ id: 'rfnd_3', status: 'processed' });
    service.setRefundGateway(gateway);
    await service.cancel('o1', undefined, 'Order cancelled by the customer');
    expect(gateway).toHaveBeenCalledWith('pay_abc', 100000, expect.anything());
  });

  it('keeps the cancellation and records an event when the automatic refund fails', async () => {
    const { service, prisma } = build(paid());
    service.setRefundGateway(vi.fn().mockRejectedValue(new Error('gateway down')));
    const result = await service.cancel('o1');
    expect(result.orderStatus).toBe('CANCELLED');
    expect(prisma.orderEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ type: 'refund.failed' }) }),
    );
  });

  it('cancelling a cash-on-delivery order triggers no refund', async () => {
    const { service } = build(paid({ provider: 'COD', providerRef: null }));
    const gateway = vi.fn();
    service.setRefundGateway(gateway);
    await service.cancel('o1');
    expect(gateway).not.toHaveBeenCalled();
  });

  it('customers can cancel before production but not after', () => {
    const { service } = build(null);
    expect(service.isCustomerCancellable({ orderStatus: 'CONFIRMED', shippingStatus: 'NOT_SHIPPED' })).toBe(true);
    expect(service.isCustomerCancellable({ orderStatus: 'PAID', shippingStatus: 'NOT_SHIPPED' })).toBe(true);
    expect(service.isCustomerCancellable({ orderStatus: 'PROCESSING', shippingStatus: 'NOT_SHIPPED' })).toBe(false);
    expect(service.isCustomerCancellable({ orderStatus: 'CONFIRMED', shippingStatus: 'IN_TRANSIT' })).toBe(false);
    expect(service.isCustomerCancellable({ orderStatus: 'CANCELLED', shippingStatus: 'NOT_SHIPPED' })).toBe(false);
  });
});
