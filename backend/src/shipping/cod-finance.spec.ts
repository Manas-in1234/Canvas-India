import { describe, expect, it, vi } from 'vitest';
import { CodFinance } from './cod-finance.js';

function fakePrisma(initialPayments: any[] = []) {
  const state = { payments: initialPayments, remittances: [] as any[], audits: [] as any[], orderEvents: [] as any[] };
  const prisma: any = {
    payment: {
      findMany: vi.fn(async ({ where, include }: any) => {
        let rows = state.payments.filter((p: any) => {
          if (where?.provider && p.provider !== where.provider) return false;
          if (where?.codCollectionStatus && p.codCollectionStatus !== where.codCollectionStatus) return false;
          if (where?.id?.in && !where.id.in.includes(p.id)) return false;
          if (where?.remittanceItems?.none) {
            const hasItems = state.remittances.some((r: any) => r.items.some((i: any) => i.paymentId === p.id));
            if (hasItems) return false;
          }
          return true;
        });
        return rows.map((p: any) => ({
          ...p,
          order: include?.order ? { id: p.orderId, orderNumber: `CC${p.orderId}`, shippingStatus: 'DELIVERED', total: p.amount, shipments: [] } : undefined,
          remittanceItems: include?.remittanceItems ? state.remittances.flatMap((r: any) => r.items.filter((i: any) => i.paymentId === p.id)) : undefined,
        }));
      }),
      findUnique: vi.fn(async ({ where, include }: any) => {
        const p = state.payments.find((x: any) => x.id === where.id);
        if (!p) return null;
        const remittanceItems = state.remittances.flatMap((r: any) => r.items.filter((i: any) => i.paymentId === p.id));
        return { ...p, order: include?.order ? { id: p.orderId, orderNumber: `CC${p.orderId}`, total: p.amount } : undefined, remittanceItems: include?.remittanceItems ? remittanceItems : undefined };
      }),
      update: vi.fn(async ({ where, data }: any) => {
        const p = state.payments.find((x: any) => x.id === where.id);
        Object.assign(p, data);
        return p;
      }),
    },
    codRemittanceItem: {
      aggregate: vi.fn(async () => ({ _sum: { amount: state.remittances.flatMap((r: any) => r.items).reduce((s: number, i: any) => s + i.amount, 0) } })),
    },
    codRemittance: {
      groupBy: vi.fn(async () => {
        const byStatus: Record<string, { amount: number; count: number }> = {};
        for (const r of state.remittances) {
          byStatus[r.status] ??= { amount: 0, count: 0 };
          byStatus[r.status].amount += r.amount;
          byStatus[r.status].count += 1;
        }
        return Object.entries(byStatus).map(([status, v]) => ({ status, _sum: { amount: v.amount }, _count: { _all: v.count } }));
      }),
      findMany: vi.fn(async () => state.remittances),
      findUnique: vi.fn(async ({ where }: any) => state.remittances.find((r: any) => r.id === where.id) ?? null),
      create: vi.fn(async ({ data }: any) => {
        const { items, ...rest } = data;
        const created = { id: `rem${state.remittances.length + 1}`, ...rest, items: (items.create as any[]).map((i, idx) => ({ id: `item${idx}`, ...i })) };
        state.remittances.push(created);
        return created;
      }),
      update: vi.fn(async ({ where, data }: any) => {
        const r = state.remittances.find((x: any) => x.id === where.id);
        Object.assign(r, data);
        return r;
      }),
    },
    order: {
      update: vi.fn(async ({ data }: any) => { if (data.events) state.orderEvents.push(data.events.create); }),
    },
    auditLog: { create: vi.fn(async ({ data }: any) => { state.audits.push(data); }) },
    $transaction: async (fn: any) => fn(prisma),
  };
  return { prisma, state };
}

describe('CodFinance.summary', () => {
  it('separates collected cash from pending collection, and remitted from pending remittance', async () => {
    const { prisma } = fakePrisma([
      { id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'PENDING', codCollectedAmount: null },
      { id: 'p2', orderId: 'o2', provider: 'COD', amount: 300, codCollectionStatus: 'COLLECTED', codCollectedAmount: 300 },
      { id: 'p3', orderId: 'o3', provider: 'COD', amount: 200, codCollectionStatus: 'COLLECTED', codCollectedAmount: 200 },
    ]);
    const s = await new CodFinance(prisma).summary();
    expect(s.totalCodOrders).toBe(3);
    expect(s.totalCodAmount).toBe(1000);
    expect(s.collectedOrders).toBe(2);
    expect(s.collectedAmount).toBe(500);
    expect(s.pendingCollectionOrders).toBe(1);
    expect(s.pendingCollectionAmount).toBe(500);
    expect(s.remittedAmount).toBe(0);
    expect(s.remittancePendingAmount).toBe(500);
  });
});

describe('CodFinance.markCollected', () => {
  it('requires a COD payment that is not already collected', async () => {
    const { prisma } = fakePrisma([{ id: 'p1', orderId: 'o1', provider: 'RAZORPAY', amount: 500, codCollectionStatus: 'PENDING' }]);
    await expect(new CodFinance(prisma).markCollected('p1', {}, 'admin1')).rejects.toMatchObject({ status: 409 });
  });

  it('records the collected amount, collector, and timestamp - never auto-filled from delivery status', async () => {
    const { prisma, state } = fakePrisma([{ id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'PENDING' }]);
    await new CodFinance(prisma).markCollected('p1', { collectedAmount: 480, note: 'Short by 20, customer disputed a surcharge' }, 'admin1');
    const p = state.payments[0];
    expect(p.codCollectionStatus).toBe('COLLECTED');
    expect(p.codCollectedAmount).toBe(480);
    expect(p.codCollectedBy).toBe('admin1');
    expect(p.codCollectedAt).toBeInstanceOf(Date);
    expect(state.audits[0]).toMatchObject({ action: 'COD_PAYMENT_COLLECTED', entityId: 'p1' });
  });

  it('defaults the collected amount to the order amount when not specified', async () => {
    const { prisma, state } = fakePrisma([{ id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'PENDING' }]);
    await new CodFinance(prisma).markCollected('p1', {}, 'admin1');
    expect(state.payments[0].codCollectedAmount).toBe(500);
  });

  it('refuses to mark the same payment collected twice', async () => {
    const { prisma } = fakePrisma([{ id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'COLLECTED' }]);
    await expect(new CodFinance(prisma).markCollected('p1', {}, 'admin1')).rejects.toMatchObject({ status: 409 });
  });

  it('rejects a collected amount more than double the order total (likely a typo), but allows a small overage', async () => {
    const { prisma: p1 } = fakePrisma([{ id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'PENDING' }]);
    await expect(new CodFinance(p1).markCollected('p1', { collectedAmount: 5000 }, 'admin1')).rejects.toMatchObject({ status: 400 });
    const { prisma: p2, state: s2 } = fakePrisma([{ id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'PENDING' }]);
    await new CodFinance(p2).markCollected('p1', { collectedAmount: 520 }, 'admin1'); // e.g. courier collected a small cash-rounding/extra fee
    expect(s2.payments[0].codCollectedAmount).toBe(520);
  });
});

describe('CodFinance.undoCollected', () => {
  it('reverses a mistaken collection mark', async () => {
    const { prisma, state } = fakePrisma([{ id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'COLLECTED', codCollectedAmount: 500 }]);
    await new CodFinance(prisma).undoCollected('p1', 'admin1');
    expect(state.payments[0].codCollectionStatus).toBe('PENDING');
    expect(state.payments[0].codCollectedAmount).toBeNull();
  });

  it('refuses to undo a payment that is already part of a remittance', async () => {
    const { prisma, state } = fakePrisma([{ id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'COLLECTED', codCollectedAmount: 500 }]);
    state.remittances.push({ id: 'rem1', status: 'PENDING', amount: 500, items: [{ id: 'item1', paymentId: 'p1', amount: 500 }] });
    await expect(new CodFinance(prisma).undoCollected('p1', 'admin1')).rejects.toMatchObject({ status: 409 });
  });
});

describe('CodFinance.createRemittance', () => {
  it('rejects a remittance covering a payment that was never marked collected', async () => {
    const { prisma } = fakePrisma([{ id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'PENDING' }]);
    await expect(new CodFinance(prisma).createRemittance({ amount: 500, remittanceDate: '2026-11-20', paymentIds: ['p1'] }, 'admin1')).rejects.toMatchObject({ status: 409 });
  });

  it('rejects a remittance that reuses a payment already in another remittance', async () => {
    const { prisma, state } = fakePrisma([{ id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'COLLECTED', codCollectedAmount: 500 }]);
    state.remittances.push({ id: 'rem1', status: 'PENDING', amount: 500, items: [{ id: 'item1', paymentId: 'p1', amount: 500 }] });
    await expect(new CodFinance(prisma).createRemittance({ amount: 500, remittanceDate: '2026-11-20', paymentIds: ['p1'] }, 'admin1')).rejects.toMatchObject({ status: 409 });
  });

  it('creates a remittance batch with bank reference, linking the covered COD payments', async () => {
    const { prisma, state } = fakePrisma([
      { id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'COLLECTED', codCollectedAmount: 500 },
      { id: 'p2', orderId: 'o2', provider: 'COD', amount: 300, codCollectionStatus: 'COLLECTED', codCollectedAmount: 300 },
    ]);
    const result = await new CodFinance(prisma).createRemittance(
      { amount: 800, remittanceDate: '2026-11-20', bankReference: 'UTR123456789', status: 'CREDITED', paymentIds: ['p1', 'p2'] },
      'admin1',
    );
    expect(result.items).toHaveLength(2);
    expect(result.bankReference).toBe('UTR123456789');
    expect(result.bankCreditedAt).toBeInstanceOf(Date);
    expect(state.audits[0]).toMatchObject({ action: 'COD_REMITTANCE_CREATED' });
  });

  it('requires at least one payment and a valid amount/date', async () => {
    const { prisma } = fakePrisma([]);
    await expect(new CodFinance(prisma).createRemittance({ amount: 0, remittanceDate: '2026-11-20', paymentIds: ['p1'] }, 'a')).rejects.toMatchObject({ status: 400 });
    await expect(new CodFinance(prisma).createRemittance({ amount: 100, remittanceDate: 'not-a-date', paymentIds: ['p1'] }, 'a')).rejects.toMatchObject({ status: 400 });
    await expect(new CodFinance(prisma).createRemittance({ amount: 100, remittanceDate: '2026-11-20', paymentIds: [] }, 'a')).rejects.toMatchObject({ status: 400 });
  });

  it('rejects a remittance date in the future (a statement is always for a past event)', async () => {
    const { prisma } = fakePrisma([{ id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'COLLECTED', codCollectedAmount: 500 }]);
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    await expect(new CodFinance(prisma).createRemittance({ amount: 500, remittanceDate: future, paymentIds: ['p1'] }, 'a')).rejects.toMatchObject({ status: 400 });
  });

  it('rejects a remittance whose entered amount does not match the selected payments total', async () => {
    const { prisma } = fakePrisma([{ id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'COLLECTED', codCollectedAmount: 500 }]);
    // Typed 5000 instead of 500 - an order of magnitude off, should be caught.
    await expect(new CodFinance(prisma).createRemittance({ amount: 5000, remittanceDate: '2026-11-15', paymentIds: ['p1'] }, 'a')).rejects.toMatchObject({ status: 400 });
  });

  it('allows a small real-world gap between remittance amount and items total (e.g. a netted bank fee)', async () => {
    const { prisma, state } = fakePrisma([{ id: 'p1', orderId: 'o1', provider: 'COD', amount: 500, codCollectionStatus: 'COLLECTED', codCollectedAmount: 500 }]);
    // Delhivery deducted a ₹5 handling fee from the transfer - within the small tolerance.
    const result = await new CodFinance(prisma).createRemittance({ amount: 495, remittanceDate: '2026-11-15', paymentIds: ['p1'] }, 'a');
    expect(result.amount).toBe(495);
    expect(state.remittances).toHaveLength(1);
  });
});

describe('CodFinance.updateRemittance', () => {
  it('moves a remittance from pending to credited and stamps bankCreditedAt once', async () => {
    const { prisma, state } = fakePrisma();
    state.remittances.push({ id: 'rem1', status: 'PENDING', amount: 500, remittanceDate: new Date(), bankReference: null, bankCreditedAt: null, items: [] });
    const cod = new CodFinance(prisma);
    await cod.updateRemittance('rem1', { status: 'CREDITED', bankReference: 'UTR999' }, 'admin1');
    expect(state.remittances[0].status).toBe('CREDITED');
    expect(state.remittances[0].bankCreditedAt).toBeInstanceOf(Date);
    expect(state.remittances[0].bankReference).toBe('UTR999');
  });
});

describe('CodFinance full lifecycle (order creation -> delivery -> collection -> remittance -> bank credit)', () => {
  it('walks a single COD order through every stage, checking the summary at each step', async () => {
    // Stage 0: order placed as COD, shipment eventually delivered. This test
    // starts from where WorkerShipping.applyTracking leaves off - a COD
    // Payment row, still PENDING, exactly as the fixed delivery handler
    // produces (see delivery.spec.ts: "never touches COD payment status").
    const { prisma, state } = fakePrisma([
      { id: 'pay-1', orderId: 'order-1', provider: 'COD', amount: 999, codCollectionStatus: 'PENDING', codCollectedAmount: null },
    ]);
    const cod = new CodFinance(prisma);

    // Stage 1: delivered, but not yet collected - summary shows it as fully pending.
    let summary = await cod.summary();
    expect(summary).toMatchObject({ totalCodOrders: 1, totalCodAmount: 999, collectedOrders: 0, collectedAmount: 0, pendingCollectionOrders: 1, pendingCollectionAmount: 999 });
    let pending = await cod.pendingCollection();
    expect(pending.map((p: any) => p.id)).toEqual(['pay-1']);

    // Stage 2: admin confirms cash was actually collected (full amount this time).
    await cod.markCollected('pay-1', { collectedAmount: 999 }, 'admin-1');
    summary = await cod.summary();
    expect(summary).toMatchObject({ collectedOrders: 1, collectedAmount: 999, pendingCollectionOrders: 0, pendingCollectionAmount: 0, remittedAmount: 0, remittancePendingAmount: 999 });
    expect((await cod.pendingCollection())).toHaveLength(0);
    const unremitted = await cod.collectedUnremitted();
    expect(unremitted.map((p: any) => p.id)).toEqual(['pay-1']);

    // Stage 3: admin records the remittance batch from Delhivery's statement, covering this payment, with a UTR.
    const remittance = await cod.createRemittance(
      { amount: 999, remittanceDate: '2026-11-15', bankReference: 'UTR20261115XYZ', status: 'PENDING', paymentIds: ['pay-1'] },
      'admin-1',
    );
    expect(remittance.items).toHaveLength(1);
    expect(remittance.items[0].paymentId).toBe('pay-1');
    summary = await cod.summary();
    expect(summary.remittedAmount).toBe(999);
    expect(summary.remittancePendingAmount).toBe(0); // now accounted for in a (still-pending-status) remittance batch
    expect((await cod.collectedUnremitted())).toHaveLength(0); // no longer "unremitted" - it's in a batch now, even if that batch hasn't been credited yet

    // Stage 4: the bank actually credits the money - admin marks the remittance CREDITED.
    const credited = await cod.updateRemittance(remittance.id, { status: 'CREDITED' }, 'admin-1');
    expect(credited.status).toBe('CREDITED');
    expect(credited.bankCreditedAt).toBeInstanceOf(Date);
    summary = await cod.summary();
    expect(summary.bankCreditedAmount).toBe(999);

    // Full audit trail exists for every stage.
    expect(state.audits.map((a: any) => a.action)).toEqual(['COD_PAYMENT_COLLECTED', 'COD_REMITTANCE_CREATED', 'COD_REMITTANCE_UPDATED']);
    // And the order timeline recorded the collection event (visible on the order detail page).
    expect(state.orderEvents.map((e: any) => e.type)).toContain('order.cod_collected');
  });
});
