/**
 * COD cash collection and remittance tracking.
 *
 * Delhivery's B2C Express API (the same one WorkerShipping/DelhiveryClient
 * integrate with) has no endpoint or webhook that confirms COD cash was
 * actually collected from a customer, or that reports remittance
 * (settlement) batches - verified against their public API docs, which only
 * cover shipment booking, tracking, pickup, NDR and cancellation. Delhivery
 * communicates actual COD payouts through a separate finance portal/
 * statement (with a UTR/bank reference), outside any API this account has
 * access to.
 *
 * So this module is deliberately a manual reconciliation ledger, not an
 * auto-synced integration: an admin marks a COD payment "collected" once
 * they've verified it (e.g. against Delhivery's dashboard or the money
 * showing up), and records each remittance batch by hand from Delhivery's
 * statement. Nothing here is inferred from shipment tracking status.
 */

function fail(status: number, message: string): never {
  throw Object.assign(new Error(message), { status });
}

export class CodFinance {
  constructor(private readonly prisma: any) {}

  /** Dashboard aggregates: how much COD cash exists, how much is collected/pending, and how much has actually reached the bank. */
  async summary() {
    const codPayments = await this.prisma.payment.findMany({
      where: { provider: 'COD' },
      select: { id: true, amount: true, status: true, codCollectionStatus: true, codCollectedAmount: true },
    });

    let totalCodAmount = 0;
    let collectedAmount = 0;
    let pendingCollectionAmount = 0;
    let totalCodOrders = 0;
    let collectedOrders = 0;
    let pendingCollectionOrders = 0;
    for (const p of codPayments) {
      const amount = Number(p.amount) || 0;
      totalCodAmount += amount;
      totalCodOrders++;
      if (p.codCollectionStatus === 'COLLECTED') {
        collectedAmount += Number(p.codCollectedAmount ?? p.amount) || 0;
        collectedOrders++;
      } else {
        pendingCollectionAmount += amount;
        pendingCollectionOrders++;
      }
    }

    const remittedAgg = await this.prisma.codRemittanceItem.aggregate({ _sum: { amount: true } });
    const remittedAmount = Number(remittedAgg._sum.amount) || 0;
    const remittancePendingAmount = Math.max(0, collectedAmount - remittedAmount);

    const remittanceByStatus = await this.prisma.codRemittance.groupBy({ by: ['status'], _sum: { amount: true }, _count: { _all: true } });
    const remittance: Record<string, { amount: number; count: number }> = { PENDING: { amount: 0, count: 0 }, INITIATED: { amount: 0, count: 0 }, CREDITED: { amount: 0, count: 0 } };
    for (const row of remittanceByStatus) {
      remittance[row.status] = { amount: Number(row._sum.amount) || 0, count: row._count._all };
    }

    return {
      totalCodOrders,
      totalCodAmount,
      collectedOrders,
      collectedAmount,
      pendingCollectionOrders,
      pendingCollectionAmount,
      remittedAmount,
      remittancePendingAmount,
      bankCreditedAmount: remittance.CREDITED.amount,
      remittanceByStatus: remittance,
    };
  }

  /** COD payments awaiting collection confirmation, oldest delivery first. */
  async pendingCollection() {
    return this.prisma.payment.findMany({
      where: { provider: 'COD', codCollectionStatus: 'PENDING' },
      include: {
        order: {
          select: {
            id: true, orderNumber: true, shippingStatus: true, total: true,
            shipments: { select: { awbNumber: true, status: true }, orderBy: { createdAt: 'desc' }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /** COD payments that have been marked collected but not yet included in any remittance batch. */
  async collectedUnremitted() {
    return this.prisma.payment.findMany({
      where: { provider: 'COD', codCollectionStatus: 'COLLECTED', remittanceItems: { none: {} } },
      include: { order: { select: { id: true, orderNumber: true } } },
      orderBy: { codCollectedAt: 'asc' },
    });
  }

  /** Admin confirms cash was actually collected for this COD order. Never automatic. */
  async markCollected(paymentId: string, body: any, userId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId }, include: { order: { select: { id: true, orderNumber: true, total: true } } } });
    if (!payment) fail(404, 'Payment not found');
    if (payment.provider !== 'COD') fail(409, 'This payment is not Cash on Delivery.');
    if (payment.codCollectionStatus === 'COLLECTED') fail(409, 'This COD payment is already marked collected.');

    const rawAmount = body?.collectedAmount;
    const collectedAmount = rawAmount === undefined || rawAmount === null || rawAmount === ''
      ? Number(payment.amount)
      : Number(rawAmount);
    if (!Number.isFinite(collectedAmount) || collectedAmount < 0) fail(400, 'Enter a valid collected amount.');
    // A genuine short-payment or a small discrepancy from the order total is
    // realistic (customer disputes a surcharge, refuses one item, etc.), but
    // an amount wildly larger than what was ever charged is almost always a
    // data-entry mistake (an extra zero), not a real collection - catch it
    // here rather than silently recording a wrong figure in the ledger.
    const orderTotal = Number(payment.amount) || 0;
    if (orderTotal > 0 && collectedAmount > orderTotal * 2) {
      fail(400, `₹${collectedAmount.toFixed(2)} is more than double the order amount (₹${orderTotal.toFixed(2)}) - check for a typo before confirming.`);
    }
    const note = typeof body?.note === 'string' ? body.note.trim().slice(0, 500) : null;

    const now = new Date();
    await this.prisma.$transaction(async (tx: any) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: { codCollectionStatus: 'COLLECTED', codCollectedAmount: collectedAmount, codCollectedAt: now, codCollectedBy: userId, codCollectionNote: note },
      });
      await tx.order.update({
        where: { id: payment.orderId },
        data: { events: { create: { type: 'order.cod_collected', message: `COD cash of ₹${collectedAmount.toFixed(2)} confirmed collected`, metadata: { paymentId, collectedAmount, note } } } },
      });
      await tx.auditLog.create({ data: { adminUserId: userId, action: 'COD_PAYMENT_COLLECTED', entityType: 'Payment', entityId: paymentId, changes: { collectedAmount, note } } });
    });
    return this.prisma.payment.findUnique({ where: { id: paymentId } });
  }

  /** Reverses a mistaken "collected" mark. Does not touch remittance records (a payment already remitted cannot be un-collected without fixing the remittance first). */
  async undoCollected(paymentId: string, userId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId }, include: { remittanceItems: true } });
    if (!payment) fail(404, 'Payment not found');
    if (payment.codCollectionStatus !== 'COLLECTED') fail(409, 'This payment is not marked collected.');
    if (payment.remittanceItems.length > 0) fail(409, 'This payment is already part of a remittance batch. Remove it from that remittance first.');
    await this.prisma.$transaction(async (tx: any) => {
      await tx.payment.update({ where: { id: paymentId }, data: { codCollectionStatus: 'PENDING', codCollectedAmount: null, codCollectedAt: null, codCollectedBy: null, codCollectionNote: null } });
      await tx.auditLog.create({ data: { adminUserId: userId, action: 'COD_PAYMENT_COLLECTION_UNDONE', entityType: 'Payment', entityId: paymentId } });
    });
    return this.prisma.payment.findUnique({ where: { id: paymentId } });
  }

  // ------------------------------------------------------------------ remittances

  async listRemittances() {
    return this.prisma.codRemittance.findMany({
      include: { items: { include: { payment: { select: { id: true, orderId: true, order: { select: { orderNumber: true } } } } } } },
      orderBy: { remittanceDate: 'desc' },
    });
  }

  async getRemittance(id: string) {
    const remittance = await this.prisma.codRemittance.findUnique({
      where: { id },
      include: { items: { include: { payment: { select: { id: true, orderId: true, amount: true, order: { select: { orderNumber: true } } } } } } },
    });
    if (!remittance) fail(404, 'Remittance not found');
    return remittance;
  }

  /** Records one remittance batch from Delhivery's statement, linking the COD payments (AWBs/orders) it covers. */
  async createRemittance(body: any, userId: string) {
    const amount = Number(body?.amount);
    if (!Number.isFinite(amount) || amount <= 0) fail(400, 'Enter a valid remittance amount.');
    const remittanceDateRaw = String(body?.remittanceDate || '');
    const remittanceDate = new Date(remittanceDateRaw);
    if (Number.isNaN(remittanceDate.getTime())) fail(400, 'Enter a valid remittance date.');
    // A remittance statement is always for a past event; a future date is
    // almost certainly a typo (wrong year is the common one), and catching
    // it here is cheap compared to a wrong settlement date in the ledger.
    if (remittanceDate.getTime() > Date.now() + 24 * 60 * 60 * 1000) fail(400, 'Remittance date cannot be in the future.');
    const bankReference = typeof body?.bankReference === 'string' ? body.bankReference.trim().slice(0, 100) || null : null;
    const status = ['PENDING', 'INITIATED', 'CREDITED'].includes(body?.status) ? body.status : 'PENDING';
    const notes = typeof body?.notes === 'string' ? body.notes.trim().slice(0, 1000) || null : null;
    const rawPaymentIds: string[] = Array.isArray(body?.paymentIds) ? body.paymentIds.filter((x: unknown): x is string => typeof x === 'string') : [];
    const paymentIds: string[] = [...new Set<string>(rawPaymentIds)];
    if (paymentIds.length === 0) fail(400, 'Select at least one COD payment this remittance covers.');

    const payments = await this.prisma.payment.findMany({ where: { id: { in: paymentIds } }, include: { remittanceItems: true } });
    if (payments.length !== paymentIds.length) fail(400, 'One or more selected payments could not be found.');
    const notCollected = payments.find((p: any) => p.provider !== 'COD' || p.codCollectionStatus !== 'COLLECTED');
    if (notCollected) fail(409, `Payment for order is not a collected COD payment (mark it collected first): ${notCollected.id}`);
    const alreadyRemitted = payments.find((p: any) => p.remittanceItems.length > 0);
    if (alreadyRemitted) fail(409, `A selected payment is already part of another remittance: ${alreadyRemitted.id}`);

    const itemsTotal = payments.reduce((sum: number, p: any) => sum + (Number(p.codCollectedAmount ?? p.amount) || 0), 0);
    // The remittance amount is typed in from Delhivery's bank statement; the
    // items total is the sum of what we recorded as collected for the
    // payments selected to make up that batch. These should match (that's
    // the whole point of a reconciliation ledger) - a mismatch almost always
    // means the wrong payments were selected or the amount was mistyped.
    // Small gaps (a few rupees) can be real: Delhivery sometimes nets a fee
    // or adjustment into the transfer, so this isn't a hard equality check.
    if (Math.abs(amount - itemsTotal) > Math.max(1, itemsTotal * 0.02)) {
      fail(400, `Remittance amount (₹${amount.toFixed(2)}) doesn't match the selected payments' total (₹${itemsTotal.toFixed(2)}). Check the amount and the selected orders, or deselect/add payments so they add up.`);
    }

    const remittance = await this.prisma.$transaction(async (tx: any) => {
      const created = await tx.codRemittance.create({
        data: {
          amount, remittanceDate, status, bankReference,
          bankCreditedAt: status === 'CREDITED' ? new Date() : null,
          notes, createdBy: userId,
          items: { create: payments.map((p: any) => ({ paymentId: p.id, amount: Number(p.codCollectedAmount ?? p.amount) || 0 })) },
        },
        include: { items: true },
      });
      await tx.auditLog.create({
        data: { adminUserId: userId, action: 'COD_REMITTANCE_CREATED', entityType: 'CodRemittance', entityId: created.id, changes: { amount, remittanceDate: remittanceDateRaw, bankReference, status, paymentCount: payments.length, itemsTotal } },
      });
      return created;
    });
    return remittance;
  }

  /** Updates status/bank reference as a remittance moves from pending to credited. */
  async updateRemittance(id: string, body: any, userId: string) {
    const remittance = await this.prisma.codRemittance.findUnique({ where: { id } });
    if (!remittance) fail(404, 'Remittance not found');
    const data: any = {};
    if (body?.status !== undefined) {
      if (!['PENDING', 'INITIATED', 'CREDITED'].includes(body.status)) fail(400, 'Invalid remittance status.');
      data.status = body.status;
      if (body.status === 'CREDITED' && !remittance.bankCreditedAt) data.bankCreditedAt = new Date();
    }
    if (body?.bankReference !== undefined) data.bankReference = String(body.bankReference || '').trim().slice(0, 100) || null;
    if (body?.notes !== undefined) data.notes = String(body.notes || '').trim().slice(0, 1000) || null;
    if (body?.remittanceDate !== undefined) {
      const d = new Date(body.remittanceDate);
      if (Number.isNaN(d.getTime())) fail(400, 'Enter a valid remittance date.');
      data.remittanceDate = d;
    }
    if (Object.keys(data).length === 0) fail(400, 'Nothing to update.');
    await this.prisma.$transaction(async (tx: any) => {
      await tx.codRemittance.update({ where: { id }, data });
      await tx.auditLog.create({ data: { adminUserId: userId, action: 'COD_REMITTANCE_UPDATED', entityType: 'CodRemittance', entityId: id, changes: data } });
    });
    return this.getRemittance(id);
  }
}
