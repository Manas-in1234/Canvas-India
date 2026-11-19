import {
  ACTIVE_STATUSES,
  DelhiveryClient,
  DelhiveryError,
  cleanPhone,
  cleanPin,
  cleanText,
  estimatePackage,
  loadDelhiveryConfig,
  mapDelhiveryStatus,
  shouldAdvance,
  type DelhiveryEnv,
  type FetchLike,
  type ShippingStatusName,
  type TrackedShipment,
} from './delhivery-client.js';

function fail(status: number, message: string): never {
  throw Object.assign(new Error(message), { status });
}

const BOOKABLE_ORDER = ['CONFIRMED', 'PAID', 'PROCESSING'];

/** Parse Delhivery's "2026-11-13T19:30:00" style timestamps (India time, no zone) into a Date. */
function parseDelhiveryDate(value: string | undefined | null): Date {
  if (!value) return new Date();
  const hasZone = /[zZ]|[+-]\d\d:?\d\d$/.test(value);
  const d = new Date(hasZone ? value : `${value.replace(' ', 'T')}+05:30`);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export class WorkerShipping {
  readonly client: DelhiveryClient;

  constructor(
    private readonly prisma: any,
    private readonly env: DelhiveryEnv,
    fetchFn?: FetchLike,
    /** Called when a parcel is first on its way or is delivered, so the customer can be emailed. Must not throw. */
    private readonly notify?: (kind: 'shipped' | 'delivered', orderId: string) => void,
  ) {
    this.client = new DelhiveryClient(loadDelhiveryConfig(env), fetchFn);
  }

  // ------------------------------------------------------------------ config & health
  config() {
    const c = this.client.cfg;
    return {
      configured: this.client.configured,
      mode: c.mode,
      pickupLocation: c.pickup.name,
      pickupPincode: c.pickup.pin,
      pickupPhone: c.pickup.phone,
      pickupAddress: c.pickup.address,
      sellerName: c.seller.name,
      gstConfigured: c.seller.gst.length > 0,
      hsnCode: c.hsn,
      webhookConfigured: Boolean(this.env.DELHIVERY_WEBHOOK_SECRET?.trim()),
    };
  }

  /** Real round-trip to Delhivery: the token works and the pickup pincode is serviceable. */
  async testConnection() {
    const c = this.client.cfg;
    if (!this.client.configured) return { ok: false, message: 'DELHIVERY_API_TOKEN is not set on the backend.' };
    try {
      const info = await this.client.checkPincode(c.pickup.pin);
      return {
        ok: true,
        message: info
          ? `Connected to Delhivery (${c.mode}). Pickup pincode ${c.pickup.pin} is serviceable.`
          : `Connected to Delhivery (${c.mode}), but pickup pincode ${c.pickup.pin} was not found as serviceable.`,
        pickupServiceable: Boolean(info),
      };
    } catch (err: any) {
      return { ok: false, message: err?.message || 'Could not reach Delhivery.' };
    }
  }

  // ------------------------------------------------------------------ reads
  async list(query: { status?: string; q?: string; take?: string } = {}) {
    const where: any = {};
    if (query.status) where.status = query.status;
    const q = (query.q || '').trim();
    if (q) {
      where.OR = [
        { awbNumber: { contains: q, mode: 'insensitive' } },
        { order: { orderNumber: { contains: q, mode: 'insensitive' } } },
      ];
    }
    return this.prisma.shipment.findMany({
      where,
      include: {
        order: { select: { id: true, orderNumber: true, shippingStatus: true, paymentStatus: true, total: true } },
        _count: { select: { ndrCases: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Number(query.take) || 300, 500),
    });
  }

  async get(id: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      include: {
        warehouse: { select: { id: true, name: true, code: true } },
        items: { include: { orderItem: { select: { productNameSnapshot: true, quantity: true, variantSnapshot: true } } } },
        trackingEvents: { orderBy: { occurredAt: 'asc' } },
        ndrCases: { orderBy: { createdAt: 'desc' } },
        rtoCases: true,
        order: {
          select: {
            id: true,
            orderNumber: true,
            orderStatus: true,
            paymentStatus: true,
            shippingStatus: true,
            total: true,
            customer: { select: { name: true, email: true, phone: true } },
            addresses: true,
            payments: { select: { provider: true, status: true, amount: true } },
          },
        },
      },
    });
    if (!shipment) fail(404, 'Shipment not found');
    return shipment;
  }

  /** Everything the admin needs to see before pressing "Ship": readiness checks and a package estimate. */
  async preview(orderId: string) {
    const order = await this.loadOrder(orderId);
    const checks = this.readiness(order);
    const items = order.items.map((i: any) => ({ quantity: i.quantity, config: i.configurationSnapshot, name: i.productNameSnapshot }));
    const pkg = estimatePackage(items, this.env);
    const address = order.addresses.find((a: any) => a.type === 'SHIPPING');
    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentMode: checks.paymentMode,
      codAmount: checks.paymentMode === 'COD' ? Number(order.total) : 0,
      ready: checks.problems.length === 0,
      problems: checks.problems,
      package: pkg,
      shippingMode: 'Surface',
      pickupLocation: this.client.cfg.pickup.name,
      mode: this.client.cfg.mode,
      address: address
        ? { name: address.name, line1: address.line1, line2: address.line2, city: address.city, state: address.state, postalCode: address.postalCode, phone: address.phone ?? order.customer?.phone ?? null }
        : null,
      activeShipment: order.shipments.find((s: any) => ACTIVE_STATUSES.includes(s.status) || s.status === 'DELIVERED' || s.status === 'RTO') ?? null,
    };
  }

  // ------------------------------------------------------------------ booking
  private async loadOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, addresses: true, customer: true, payments: true, shipments: true },
    });
    if (!order) fail(404, 'Order not found');
    return order;
  }

  private readiness(order: any): { problems: string[]; paymentMode: 'Prepaid' | 'COD' } {
    const problems: string[] = [];
    const isCod = order.payments.some((p: any) => p.provider === 'COD' && p.status === 'PENDING');
    if (!BOOKABLE_ORDER.includes(order.orderStatus)) {
      problems.push(`Order status is ${order.orderStatus}. Only confirmed, paid or processing orders can be shipped.`);
    }
    if (!isCod && order.paymentStatus !== 'PAID') {
      problems.push('Payment is not confirmed as paid. Verify the payment before shipping.');
    }
    const address = order.addresses.find((a: any) => a.type === 'SHIPPING');
    if (!address) {
      problems.push('There is no shipping address on this order.');
    } else {
      if (!cleanPin(address.postalCode)) problems.push('The delivery pincode is not a valid 6-digit pincode.');
      if (!cleanPhone(address.phone ?? order.customer?.phone)) problems.push('There is no valid 10-digit phone number for the customer.');
      if (!String(address.line1 || '').trim()) problems.push('The delivery address line is empty.');
      if (!String(address.city || '').trim() || !String(address.state || '').trim()) problems.push('The delivery city or state is missing.');
    }
    if (order.items.length === 0) problems.push('The order has no items.');
    if (order.shipments.some((s: any) => ACTIVE_STATUSES.includes(s.status) || s.status === 'DELIVERED' || s.status === 'RTO')) {
      problems.push('This order already has a shipment.');
    }
    if (!this.client.configured) problems.push('Delhivery is not configured on the backend (DELHIVERY_API_TOKEN).');
    return { problems, paymentMode: isCod ? 'COD' : 'Prepaid' };
  }

  /** The warehouse row a shipment must point at, created from the pickup settings if the admin never made one. */
  private async ensureWarehouse() {
    const c = this.client.cfg.pickup;
    const code = 'DELHIVERY-PICKUP';
    const existing = await this.prisma.warehouse.findUnique({ where: { code } });
    if (existing) return existing;
    return this.prisma.warehouse.create({
      data: { name: c.name, code, addressLine1: c.address, city: c.city, state: c.state, postalCode: c.pin, country: 'IN' },
    });
  }

  async createForOrder(orderId: string, body: any, userId: string) {
    const order = await this.loadOrder(orderId);
    const { problems, paymentMode } = this.readiness(order);
    if (problems.length) fail(409, problems[0]);

    const address = order.addresses.find((a: any) => a.type === 'SHIPPING');
    const pin = cleanPin(address.postalCode)!;
    const phone = cleanPhone(address.phone ?? order.customer?.phone)!;

    // Package: the admin's override, else the estimate from print sizes. Validate every number.
    const est = estimatePackage(order.items.map((i: any) => ({ quantity: i.quantity, config: i.configurationSnapshot, name: i.productNameSnapshot })), this.env);
    const num = (v: unknown, fallback: number, min: number, max: number, label: string) => {
      if (v === undefined || v === null || v === '') return fallback;
      const n = Number(v);
      if (!Number.isFinite(n) || n < min || n > max) fail(400, `${label} must be between ${min} and ${max}`);
      return n;
    };
    const weightGrams = Math.round(num(body?.weightGrams, est.weightGrams, 50, 30000, 'Weight (g)'));
    const lengthCm = Math.round(num(body?.lengthCm, est.lengthCm, 1, 200, 'Length (cm)'));
    const widthCm = Math.round(num(body?.widthCm, est.widthCm, 1, 200, 'Width (cm)'));
    const heightCm = Math.round(num(body?.heightCm, est.heightCm, 1, 200, 'Height (cm)'));
    const shippingMode = body?.shippingMode === 'Express' ? 'Express' : 'Surface';

    // Serviceability (checked live). A network blip does not block booking: Delhivery itself rejects unserviceable pins.
    try {
      const svc = await this.client.checkPincode(pin);
      if (!svc) fail(422, `Delhivery does not deliver to pincode ${pin}.`);
      if (paymentMode === 'COD' && !svc.cod) fail(422, `Cash on Delivery is not available for pincode ${pin}.`);
      if (paymentMode === 'Prepaid' && !svc.prepaid) fail(422, `Prepaid delivery is not available for pincode ${pin}.`);
    } catch (err: any) {
      if (!(err instanceof DelhiveryError)) throw err;
      if (err.httpStatus === 503) throw err;
    }

    // Delhivery requires a unique order id per booking, so a re-booking after a cancel gets a suffix.
    const previous = order.shipments.length;
    const orderRef = previous === 0 ? order.orderNumber : `${order.orderNumber}-R${previous + 1}`;
    const totalItems = order.items.reduce((n: number, i: any) => n + i.quantity, 0);
    const description = cleanText(order.items.map((i: any) => `${i.productNameSnapshot} x${i.quantity}`).join(', '), 200) || 'Custom printed canvas';

    // 1) Book with Delhivery first. If this throws, nothing is recorded: no fake AWB, no half-shipped order.
    const booked = await this.client.createShipment({
      orderRef,
      name: address.name || order.customer?.name || 'Customer',
      address: [address.line1, address.line2].filter(Boolean).join(', '),
      pin,
      city: address.city,
      state: address.state,
      phone,
      paymentMode,
      codAmount: Number(order.total),
      totalAmount: Number(order.total),
      description,
      quantity: totalItems,
      weightGrams,
      lengthCm,
      widthCm,
      heightCm,
      shippingMode,
    });

    // 2) Record it. If our database fails after Delhivery accepted, try to void the booking so nothing is orphaned.
    try {
      const warehouse = await this.ensureWarehouse();
      const shipment = await this.prisma.$transaction(async (tx: any) => {
        const created = await tx.shipment.create({
          data: {
            orderId: order.id,
            warehouseId: warehouse.id,
            courierProvider: 'Delhivery',
            awbNumber: booked.waybill,
            status: 'READY',
            items: { create: order.items.map((i: any) => ({ orderItemId: i.id, quantity: i.quantity })) },
            trackingEvents: { create: { status: 'READY', description: `Booked with Delhivery. AWB ${booked.waybill}`, location: warehouse.name } },
          },
        });
        await tx.order.update({
          where: { id: order.id },
          data: {
            shippingStatus: 'READY',
            ...(order.orderStatus === 'CONFIRMED' || order.orderStatus === 'PAID' ? { orderStatus: 'PROCESSING' } : {}),
            events: {
              create: {
                type: 'shipment.booked',
                message: `Shipment booked with Delhivery. AWB ${booked.waybill}`,
                metadata: { shipmentId: created.id, awbNumber: booked.waybill, orderRef, paymentMode, weightGrams, lengthCm, widthCm, heightCm, shippingMode, uploadId: booked.uploadId ?? null, mode: this.client.cfg.mode },
              },
            },
          },
        });
        await tx.auditLog.create({ data: { adminUserId: userId, action: 'SHIPMENT_BOOKED', entityType: 'Shipment', entityId: created.id, changes: { awbNumber: booked.waybill, orderRef } } });
        return created;
      });
      return this.get(shipment.id);
    } catch (dbErr: any) {
      try {
        await this.client.cancel(booked.waybill);
      } catch {
        /* the booking could not be voided automatically; the error below names the AWB so it can be cancelled by hand */
      }
      throw Object.assign(new Error(`Delhivery booked AWB ${booked.waybill} but saving it failed (${dbErr?.message || 'database error'}). The booking was cancelled automatically where possible; check the Delhivery dashboard for AWB ${booked.waybill}.`), { status: 500 });
    }
  }

  // ------------------------------------------------------------------ tracking
  /** Apply what Delhivery says about one shipment to our records. Safe to run repeatedly (idempotent). */
  async applyTracking(shipmentId: string, tracked: TrackedShipment | null): Promise<{ changed: boolean; status: string }> {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { trackingEvents: true, ndrCases: true, rtoCases: true, order: { include: { payments: true } } },
    });
    if (!shipment) fail(404, 'Shipment not found');
    if (!tracked) return { changed: false, status: shipment.status };

    // Scans oldest first; fall back to the single latest status when the response carries no scan history.
    const scans = tracked.scans.length
      ? [...tracked.scans].sort((a, b) => +new Date(a.at) - +new Date(b.at))
      : [{ status: tracked.status, statusType: tracked.statusType, instructions: tracked.instructions, location: tracked.location, at: tracked.at, code: tracked.code }];

    const seen = new Set(shipment.trackingEvents.map((e: any) => `${e.status}|${e.description ?? ''}|${new Date(e.occurredAt).getTime()}`));
    let current: ShippingStatusName = shipment.status;
    let cancelled = false;
    let ndrReason: string | null = null;
    const newEvents: Array<{ status: ShippingStatusName; description: string; location: string | null; occurredAt: Date }> = [];

    for (const scan of scans) {
      const mapped = mapDelhiveryStatus(scan.statusType, scan.status, scan.instructions, scan.code);
      if (mapped.cancelled) {
        cancelled = true;
        continue;
      }
      if (!mapped.status) continue;
      const description = cleanText([scan.status, scan.instructions].filter(Boolean).join(': '), 300) || mapped.status;
      const occurredAt = parseDelhiveryDate(scan.at);
      const key = `${mapped.status}|${description}|${occurredAt.getTime()}`;
      if (!seen.has(key)) {
        seen.add(key);
        newEvents.push({ status: mapped.status, description, location: scan.location || null, occurredAt });
      }
      if (shouldAdvance(current, mapped.status)) current = mapped.status;
      if (mapped.isNdr) ndrReason = scan.instructions || scan.status || 'Delivery attempt failed';
    }

    if (cancelled && current !== 'DELIVERED' && current !== 'RTO') current = 'NOT_SHIPPED';
    const statusChanged = current !== shipment.status;
    if (!statusChanged && newEvents.length === 0) return { changed: false, status: current };

    await this.prisma.$transaction(async (tx: any) => {
      if (newEvents.length) {
        await tx.trackingEvent.createMany({ data: newEvents.map((e) => ({ shipmentId, status: e.status, description: e.description, location: e.location, occurredAt: e.occurredAt })) });
      }
      if (cancelled && current === 'NOT_SHIPPED') {
        await tx.trackingEvent.create({ data: { shipmentId, status: 'NOT_SHIPPED', description: 'Shipment cancelled by Delhivery' } });
      }
      if (statusChanged) {
        await tx.shipment.update({ where: { id: shipmentId }, data: { status: current } });
        const orderData: any = { shippingStatus: current };
        const label: Record<string, string> = {
          PICKED_UP: 'picked up by Delhivery',
          IN_TRANSIT: 'in transit',
          OUT_FOR_DELIVERY: 'out for delivery',
          DELIVERED: 'delivered',
          NDR: 'delivery attempt failed',
          RTO: 'returning to the seller (RTO)',
          NOT_SHIPPED: 'cancelled by Delhivery',
        };
        const eventType = current === 'DELIVERED' ? 'order.delivered' : current === 'RTO' ? 'shipment.rto' : current === 'NDR' ? 'shipment.ndr' : 'shipment.updated';
        orderData.events = { create: { type: eventType, message: `Shipment ${shipment.awbNumber ?? ''} ${label[current] ?? current}`.trim(), metadata: { shipmentId, awbNumber: shipment.awbNumber, status: current } } };
        if (current === 'DELIVERED') {
          orderData.orderStatus = 'COMPLETED';
          // Cash on Delivery: the courier collected the money at the door.
          const cod = shipment.order.payments.find((p: any) => p.provider === 'COD' && p.status === 'PENDING');
          if (cod) {
            await tx.payment.update({ where: { id: cod.id }, data: { status: 'PAID' } });
            orderData.paymentStatus = 'PAID';
          }
        }
        await tx.order.update({ where: { id: shipment.orderId }, data: orderData });
      }
      if (current === 'NDR' && ndrReason) {
        const dup = shipment.ndrCases.some((n: any) => n.reason === ndrReason && n.status === 'NDR');
        if (!dup) await tx.ndrCase.create({ data: { shipmentId, reason: String(ndrReason).slice(0, 300), attemptNumber: shipment.ndrCases.length + 1, status: 'NDR' } });
      }
      if (current === 'OUT_FOR_DELIVERY' || current === 'DELIVERED') {
        // A new delivery attempt (or success) means any open NDR was acted on.
        await tx.ndrCase.updateMany({ where: { shipmentId, status: 'NDR' }, data: { status: current === 'DELIVERED' ? 'DELIVERED' : 'OUT_FOR_DELIVERY', resolution: current === 'DELIVERED' ? 'Delivered' : 'Re-attempt out for delivery' } });
      }
      if (current === 'RTO' && shipment.rtoCases.length === 0) {
        await tx.rtoCase.create({ data: { shipmentId, warehouseId: shipment.warehouseId } });
      }
    });
    if (statusChanged) {
      if (current === 'PICKED_UP' || current === 'IN_TRANSIT' || current === 'OUT_FOR_DELIVERY') this.notify?.('shipped', shipment.orderId);
      if (current === 'DELIVERED') this.notify?.('delivered', shipment.orderId);
    }
    return { changed: true, status: current };
  }

  async refresh(id: string) {
    const shipment = await this.prisma.shipment.findUnique({ where: { id } });
    if (!shipment) fail(404, 'Shipment not found');
    if (!shipment.awbNumber) fail(409, 'This shipment has no AWB number to track.');
    if (!ACTIVE_STATUSES.includes(shipment.status)) return this.get(id);
    const [tracked] = await this.client.track([shipment.awbNumber]);
    await this.applyTracking(id, tracked ?? null);
    return this.get(id);
  }

  /** Cron / "Refresh all": one batched tracking call for the shipments that have gone longest without an update. */
  async syncActive(limit = 20) {
    if (!this.client.configured) return { checked: 0, updated: 0, skipped: 'Delhivery is not configured' };
    const rows = await this.prisma.shipment.findMany({
      where: { awbNumber: { not: null }, status: { in: ACTIVE_STATUSES } },
      orderBy: { updatedAt: 'asc' },
      take: Math.min(limit, 30),
      select: { id: true, awbNumber: true },
    });
    if (rows.length === 0) return { checked: 0, updated: 0 };
    const tracked = await this.client.track(rows.map((r: any) => r.awbNumber));
    const byAwb = new Map(tracked.map((t) => [t.awb, t]));
    let updated = 0;
    for (const row of rows) {
      try {
        const result = await this.applyTracking(row.id, byAwb.get(row.awbNumber) ?? null);
        if (result.changed) updated++;
      } catch (err) {
        console.error('shipment sync failed', row.id, err);
      }
    }
    return { checked: rows.length, updated };
  }

  /** Delhivery push webhook (set up by Delhivery on request). Idempotent; unknown waybills are ignored. */
  async applyWebhook(payload: any) {
    const list = Array.isArray(payload) ? payload : [payload];
    let applied = 0;
    for (const item of list) {
      const s = item?.Shipment ?? item?.shipment ?? item;
      const awb = String(s?.AWB ?? s?.awb ?? s?.waybill ?? '');
      if (!awb) continue;
      const st = s?.Status ?? {};
      const shipment = await this.prisma.shipment.findFirst({ where: { awbNumber: awb }, select: { id: true } });
      if (!shipment) continue;
      const tracked: TrackedShipment = {
        awb,
        status: String(st.Status ?? s?.status ?? ''),
        statusType: String(st.StatusType ?? s?.status_type ?? ''),
        instructions: String(st.Instructions ?? s?.instructions ?? ''),
        location: String(st.StatusLocation ?? s?.location ?? ''),
        at: String(st.StatusDateTime ?? s?.status_datetime ?? ''),
        code: String(s?.NSLCode ?? st.StatusCode ?? ''),
        expectedDate: null,
        scans: [],
      };
      await this.applyTracking(shipment.id, tracked);
      applied++;
    }
    return { received: list.length, applied };
  }

  // ------------------------------------------------------------------ actions
  async cancel(id: string, userId: string) {
    const shipment = await this.prisma.shipment.findUnique({ where: { id } });
    if (!shipment) fail(404, 'Shipment not found');
    if (shipment.status === 'DELIVERED') fail(409, 'A delivered shipment cannot be cancelled.');
    if (shipment.status === 'RTO') fail(409, 'A shipment that is returning to you cannot be cancelled.');
    if (shipment.status === 'NOT_SHIPPED') fail(409, 'This shipment is already cancelled.');
    if (!shipment.awbNumber) fail(409, 'This shipment has no AWB number.');
    if (['OUT_FOR_DELIVERY', 'NDR'].includes(shipment.status)) fail(409, 'Delhivery cannot cancel a parcel that is already out for delivery. Wait for the outcome, then use RTO if needed.');

    // Delhivery first. If it refuses (e.g. already picked up and moving), we leave everything as it is.
    await this.client.cancel(shipment.awbNumber);
    await this.prisma.$transaction(async (tx: any) => {
      await tx.shipment.update({ where: { id }, data: { status: 'NOT_SHIPPED', trackingEvents: { create: { status: 'NOT_SHIPPED', description: 'Shipment cancelled' } } } });
      await tx.order.update({
        where: { id: shipment.orderId },
        data: { shippingStatus: 'NOT_SHIPPED', events: { create: { type: 'shipment.cancelled', message: `Shipment ${shipment.awbNumber} cancelled`, metadata: { shipmentId: id, awbNumber: shipment.awbNumber } } } },
      });
      await tx.auditLog.create({ data: { adminUserId: userId, action: 'SHIPMENT_CANCELLED', entityType: 'Shipment', entityId: id, changes: { awbNumber: shipment.awbNumber } } });
    });
    return this.get(id);
  }

  async label(id: string) {
    const shipment = await this.get(id);
    if (!shipment.awbNumber) fail(409, 'This shipment has no AWB number.');
    let slip: any = null;
    try {
      slip = await this.client.packingSlip(shipment.awbNumber);
    } catch {
      slip = null; // the admin still gets a printable label built from our own data
    }
    return { awbNumber: shipment.awbNumber, slip, pickup: this.config(), shipment };
  }

  async requestPickup(userId: string, body: any) {
    const date = String(body?.date || '').trim();
    const time = String(body?.time || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(400, 'Pickup date must be YYYY-MM-DD.');
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(time)) fail(400, 'Pickup time must be HH:MM.');
    const when = new Date(`${date}T${time.length === 5 ? `${time}:00` : time}+05:30`);
    if (Number.isNaN(when.getTime()) || when.getTime() < Date.now() - 5 * 60 * 1000) fail(400, 'Pickup time must be in the future.');
    const waiting = await this.prisma.shipment.count({ where: { status: 'READY', awbNumber: { not: null } } });
    const count = Number(body?.count) > 0 ? Math.round(Number(body.count)) : waiting;
    if (count < 1) fail(409, 'There are no booked shipments waiting for pickup.');
    const result = await this.client.requestPickup({ date, time: time.length === 5 ? `${time}:00` : time, count });
    await this.prisma.auditLog.create({ data: { adminUserId: userId, action: 'DELHIVERY_PICKUP_REQUESTED', entityType: 'DelhiveryPickup', entityId: result.pickupId ?? `${date}T${time}`, changes: { date, time, count, pickupId: result.pickupId, location: this.client.cfg.pickup.name } } });
    return { pickupId: result.pickupId, date, time, count, location: this.client.cfg.pickup.name };
  }

  async recentPickups() {
    const rows = await this.prisma.auditLog.findMany({ where: { action: 'DELHIVERY_PICKUP_REQUESTED' }, orderBy: { createdAt: 'desc' }, take: 10 });
    return rows.map((r: any) => ({ id: r.id, createdAt: r.createdAt, ...(r.changes ?? {}) }));
  }

  async ndrAction(id: string, body: any, userId: string) {
    const shipment = await this.prisma.shipment.findUnique({ where: { id } });
    if (!shipment) fail(404, 'Shipment not found');
    if (!shipment.awbNumber) fail(409, 'This shipment has no AWB number.');
    if (shipment.status !== 'NDR') fail(409, 'This shipment is not waiting for a delivery decision.');
    const act = body?.act;
    const extra: Record<string, string> = {};
    if (act === 'DEFER_DLV') {
      const d = String(body?.deferredDate || '');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) fail(400, 'Choose the new delivery date.');
      extra.deferred_date = d;
    } else if (act === 'EDIT_DETAILS') {
      const phone = body?.phone ? cleanPhone(body.phone) : null;
      if (body?.phone && !phone) fail(400, 'Enter a valid 10-digit phone number.');
      if (phone) extra.phone = phone;
      if (body?.name) extra.name = cleanText(body.name, 100);
      if (body?.add) extra.add = cleanText(body.add, 250);
      if (!Object.keys(extra).length) fail(400, 'Enter at least one detail to change.');
    } else if (act !== 'RE-ATTEMPT') {
      fail(400, 'Unknown action.');
    }
    const result = await this.client.ndrAction(shipment.awbNumber, act, extra);
    await this.prisma.$transaction(async (tx: any) => {
      await tx.ndrCase.updateMany({ where: { shipmentId: id, status: 'NDR' }, data: { resolution: `${act} requested${extra.deferred_date ? ` for ${extra.deferred_date}` : ''}` } });
      await tx.trackingEvent.create({ data: { shipmentId: id, status: 'NDR', description: `Action sent to Delhivery: ${act}${extra.deferred_date ? ` (${extra.deferred_date})` : ''}` } });
      await tx.order.update({ where: { id: shipment.orderId }, data: { events: { create: { type: 'shipment.ndr_action', message: `Delivery action sent to Delhivery: ${act}`, metadata: { shipmentId: id, act, ...extra, uplId: result.uplId } } } } });
      await tx.auditLog.create({ data: { adminUserId: userId, action: 'NDR_ACTION_SENT', entityType: 'Shipment', entityId: id, changes: { act, ...extra } } });
    });
    return { ok: true, uplId: result.uplId, message: 'Delhivery has accepted the request. The new status appears after their next scan.' };
  }

  async markRtoReceived(id: string, userId: string) {
    const shipment = await this.prisma.shipment.findUnique({ where: { id }, include: { rtoCases: true } });
    if (!shipment) fail(404, 'Shipment not found');
    if (shipment.status !== 'RTO') fail(409, 'This shipment is not returning to you.');
    const rto = shipment.rtoCases[0];
    await this.prisma.$transaction(async (tx: any) => {
      if (rto) await tx.rtoCase.update({ where: { id: rto.id }, data: { receivedAt: new Date() } });
      else await tx.rtoCase.create({ data: { shipmentId: id, warehouseId: shipment.warehouseId, receivedAt: new Date() } });
      await tx.order.update({ where: { id: shipment.orderId }, data: { events: { create: { type: 'shipment.rto_received', message: `Returned parcel ${shipment.awbNumber ?? ''} received back`.trim() } } } });
      await tx.auditLog.create({ data: { adminUserId: userId, action: 'RTO_RECEIVED', entityType: 'Shipment', entityId: id } });
    });
    return this.get(id);
  }

  /** Shipments that need a person today: failed deliveries, returns, and booked parcels waiting for pickup. */
  async summary() {
    const rows: Array<{ status: string; _count: { _all: number } }> = await this.prisma.shipment.groupBy({ by: ['status'], _count: { _all: true } });
    const counts: Record<string, number> = {};
    for (const r of rows) counts[r.status] = r._count._all;
    const toShip = await this.prisma.order.count({
      where: { orderStatus: { in: ['CONFIRMED', 'PAID', 'PROCESSING'] }, shippingStatus: 'NOT_SHIPPED', OR: [{ paymentStatus: 'PAID' }, { payments: { some: { provider: 'COD', status: 'PENDING' } } }] },
    });
    return { counts, toShip };
  }
}
