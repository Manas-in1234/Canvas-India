import { describe, expect, it, vi } from 'vitest';
import {
  DelhiveryClient,
  DelhiveryError,
  cleanPhone,
  cleanPin,
  cleanText,
  estimatePackage,
  loadDelhiveryConfig,
  mapDelhiveryStatus,
  parsePrintSize,
  shouldAdvance,
} from './delhivery-client.js';
import { WorkerShipping } from './worker-shipping.js';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const env = { DELHIVERY_API_TOKEN: 'tok', DELHIVERY_MODE: 'staging' };

describe('input cleaning', () => {
  it('strips characters Delhivery rejects and keeps text short', () => {
    expect(cleanText('Flat #4 & 5; 10% off \\ road')).toBe('Flat 4 5 10 off road');
    expect(cleanText('x'.repeat(400), 100)).toHaveLength(100);
  });
  it('accepts only real Indian mobile numbers and pincodes', () => {
    expect(cleanPhone('+91 98765 43210')).toBe('9876543210');
    expect(cleanPhone('12345')).toBeNull();
    expect(cleanPhone('5123456789')).toBeNull();
    expect(cleanPin('500076')).toBe('500076');
    expect(cleanPin('50007')).toBeNull();
    expect(cleanPin('012345')).toBeNull();
  });
});

describe('package estimate', () => {
  it('reads the print size from the saved configuration', () => {
    expect(parsePrintSize({ size: '12" × 18"' })).toEqual({ w: 12, h: 18 });
    expect(parsePrintSize({ dimensions: '24x36 inches' })).toEqual({ w: 24, h: 36 });
    expect(parsePrintSize({ size: 'Standard' })).toBeNull();
  });
  it('weighs bigger prints heavier, acrylic heavier than canvas, and never below 300 g', () => {
    const small = estimatePackage([{ quantity: 1, config: { size: '8x8' } }]);
    const large = estimatePackage([{ quantity: 1, config: { size: '24x36' } }]);
    const acrylic = estimatePackage([{ quantity: 1, config: { size: '24x36', material: 'Acrylic' } }]);
    expect(large.weightGrams).toBeGreaterThan(small.weightGrams);
    expect(acrylic.weightGrams).toBeGreaterThan(large.weightGrams);
    expect(small.weightGrams).toBeGreaterThanOrEqual(300);
    expect(large.basis).toBe('size');
    expect(estimatePackage([{ quantity: 2, config: {} }]).basis).toBe('default');
  });
  it('adds weight and depth for extra pieces', () => {
    const one = estimatePackage([{ quantity: 1, config: { size: '12x12' } }]);
    const three = estimatePackage([{ quantity: 3, config: { size: '12x12' } }]);
    expect(three.weightGrams).toBeGreaterThan(one.weightGrams * 2.5);
    expect(three.heightCm).toBeGreaterThan(one.heightCm);
  });
});

describe('status mapping', () => {
  it('maps Delhivery statuses to ours', () => {
    expect(mapDelhiveryStatus('UD', 'Manifested').status).toBe('READY');
    expect(mapDelhiveryStatus('UD', 'Not Picked').status).toBe('READY');
    expect(mapDelhiveryStatus('UD', 'In Transit', 'Shipment picked up').status).toBe('PICKED_UP');
    expect(mapDelhiveryStatus('UD', 'In Transit', 'Arrived at hub').status).toBe('IN_TRANSIT');
    expect(mapDelhiveryStatus('UD', 'Dispatched').status).toBe('OUT_FOR_DELIVERY');
    expect(mapDelhiveryStatus('DL', 'Delivered').status).toBe('DELIVERED');
    expect(mapDelhiveryStatus('RT', 'In Transit').status).toBe('RTO');
    expect(mapDelhiveryStatus('DL', 'RTO').status).toBe('RTO');
    expect(mapDelhiveryStatus('CN', 'Canceled').cancelled).toBe(true);
    expect(mapDelhiveryStatus('XX', 'Something new').status).toBeNull();
  });
  it('recognises a failed delivery attempt', () => {
    const byCode = mapDelhiveryStatus('UD', 'Pending', 'Consignee unavailable', 'EOD-74');
    expect(byCode).toMatchObject({ status: 'NDR', isNdr: true });
    expect(mapDelhiveryStatus('UD', 'Pending', 'Customer not available, attempt failed').isNdr).toBe(true);
    expect(mapDelhiveryStatus('UD', 'Pending', 'Reached destination city').status).toBe('IN_TRANSIT');
  });
  it('never moves a parcel backwards or out of a final state', () => {
    expect(shouldAdvance('IN_TRANSIT', 'READY')).toBe(false);
    expect(shouldAdvance('DELIVERED', 'IN_TRANSIT')).toBe(false);
    expect(shouldAdvance('DELIVERED', 'RTO')).toBe(false);
    expect(shouldAdvance('OUT_FOR_DELIVERY', 'NDR')).toBe(true);
    expect(shouldAdvance('NDR', 'OUT_FOR_DELIVERY')).toBe(true);
    expect(shouldAdvance('RTO', 'DELIVERED')).toBe(false);
    expect(shouldAdvance('RTO', 'IN_TRANSIT')).toBe(false);
    expect(shouldAdvance('NOT_SHIPPED', 'IN_TRANSIT')).toBe(false);
  });
});

describe('Delhivery client', () => {
  const booking = {
    orderRef: 'CC10001', name: 'A B', address: '1 Road', pin: '500001', city: 'Hyderabad', state: 'Telangana', phone: '9876543210',
    paymentMode: 'COD' as const, codAmount: 999, totalAmount: 999, description: 'Canvas', quantity: 1,
    weightGrams: 800, lengthCm: 40, widthCm: 30, heightCm: 6, shippingMode: 'Surface' as const,
  };
  const clientWith = (fetchFn: any) => new DelhiveryClient(loadDelhiveryConfig(env), fetchFn);

  it('uses the staging host and token header, and sends COD amount and pickup location', async () => {
    const fetchFn = vi.fn(async () => json({ success: true, packages: [{ status: 'Success', waybill: '1234567890' }], upload_wbn: 'UPL1' }));
    const out = await clientWith(fetchFn).createShipment(booking);
    expect(out.waybill).toBe('1234567890');
    const [url, init] = fetchFn.mock.calls[0] as any;
    expect(url).toBe('https://staging-express.delhivery.com/api/cmu/create.json');
    expect(init.headers.Authorization).toBe('Token tok');
    const sent = JSON.parse(new URLSearchParams(init.body).get('data')!);
    expect(sent.pickup_location.name).toBe('SREE MAHALAKSHMI ENTERPRISES');
    expect(sent.shipments[0]).toMatchObject({ payment_mode: 'COD', cod_amount: '999.00', order: 'CC10001', pin: '500001', weight: 800 });
  });

  it('defaults to production when no mode is set', () => {
    expect(loadDelhiveryConfig({ DELHIVERY_API_TOKEN: 't' }).baseUrl).toBe('https://track.delhivery.com');
  });

  it('throws, and invents no tracking number, when Delhivery rejects the booking', async () => {
    const rejected = vi.fn(async () => json({ success: false, rmk: 'ClientWarehouse matching query does not exist', packages: [{ status: 'Fail', waybill: '', remarks: ['pickup location invalid'] }] }));
    await expect(clientWith(rejected).createShipment(booking)).rejects.toMatchObject({ status: 422 });
    const noWaybill = vi.fn(async () => json({ success: true, packages: [{ status: 'Success' }] }));
    await expect(clientWith(noWaybill).createShipment(booking)).rejects.toBeInstanceOf(DelhiveryError);
    const down = vi.fn(async () => { throw new Error('boom'); });
    await expect(clientWith(down).createShipment(booking)).rejects.toMatchObject({ status: 502 });
  });

  it('explains a bad token and a missing token', async () => {
    const denied = vi.fn(async () => new Response('{}', { status: 401 }));
    await expect(clientWith(denied).checkPincode('500001')).rejects.toThrow(/token/i);
    await expect(new DelhiveryClient(loadDelhiveryConfig({}), vi.fn()).checkPincode('500001')).rejects.toMatchObject({ status: 503 });
  });

  it('parses tracking with scan history', async () => {
    const fetchFn = vi.fn(async () => json({ ShipmentData: [{ Shipment: { AWB: '111', ExpectedDeliveryDate: '2026-11-20T00:00:00', Status: { Status: 'In Transit', StatusType: 'UD', StatusDateTime: '2026-11-15T10:00:00', StatusLocation: 'Hyderabad', Instructions: 'Arrived' }, Scans: [{ ScanDetail: { Scan: 'Manifested', ScanType: 'UD', ScanDateTime: '2026-11-14T09:00:00', ScannedLocation: 'Hyderabad', Instructions: 'Manifest uploaded' } }] } }] }));
    const [t] = await clientWith(fetchFn).track(['111']);
    expect(t).toMatchObject({ awb: '111', status: 'In Transit', expectedDate: '2026-11-20T00:00:00' });
    expect(t.scans).toHaveLength(1);
    expect(String((fetchFn.mock.calls[0] as any)[0])).toContain('waybill=111');
  });

  it('only treats a cancel as done when Delhivery confirms it', async () => {
    await expect(clientWith(vi.fn(async () => json({ status: true, remark: 'ok' }))).cancel('1')).resolves.toBeUndefined();
    await expect(clientWith(vi.fn(async () => json({ status: false, remark: 'Shipment already dispatched' }))).cancel('1')).rejects.toThrow(/already dispatched/);
  });
});

// ------------------------------------------------------------------------------------------------
// WorkerShipping against a tiny in-memory fake of the Prisma calls it makes
// ------------------------------------------------------------------------------------------------
function fakePrisma(order: any) {
  const state = { shipments: [] as any[], events: [] as any[], audits: [] as any[], payments: order.payments };
  const prisma: any = {
    order: {
      findUnique: vi.fn(async () => ({ ...order, shipments: state.shipments })),
      update: vi.fn(async ({ data }: any) => { Object.assign(order, { ...data, events: undefined }); if (data.events) state.events.push(data.events.create); return order; }),
    },
    warehouse: { findUnique: vi.fn(async () => ({ id: 'wh1', name: 'SREE MAHALAKSHMI ENTERPRISES' })), create: vi.fn() },
    shipment: {
      create: vi.fn(async ({ data }: any) => { const s = { id: 'sh1', status: 'READY', ...data, trackingEvents: [], ndrCases: [], rtoCases: [] }; state.shipments.push(s); return s; }),
      findUnique: vi.fn(async () => ({ ...state.shipments[0], order: { ...order, payments: state.payments }, warehouse: { id: 'wh1', name: 'x', code: 'c' } })),
      update: vi.fn(async ({ data }: any) => { Object.assign(state.shipments[0], { status: data.status ?? state.shipments[0].status }); return state.shipments[0]; }),
      findMany: vi.fn(async () => state.shipments),
    },
    trackingEvent: { createMany: vi.fn(), create: vi.fn() },
    ndrCase: { create: vi.fn(), updateMany: vi.fn() },
    rtoCase: { create: vi.fn() },
    payment: { update: vi.fn() },
    auditLog: { create: vi.fn(async ({ data }: any) => { state.audits.push(data); }) },
    $transaction: async (fn: any) => fn(prisma),
  };
  return { prisma, state };
}

const baseOrder = () => ({
  id: 'o1', orderNumber: 'CC10001', orderStatus: 'CONFIRMED', paymentStatus: 'PAID', shippingStatus: 'NOT_SHIPPED', total: '999',
  customer: { name: 'Asha', phone: '9876543210', email: 'a@b.c' },
  items: [{ id: 'i1', quantity: 1, productNameSnapshot: 'Canvas', configurationSnapshot: { size: '12x18' } }],
  addresses: [{ type: 'SHIPPING', name: 'Asha', line1: '1 Road', line2: null, city: 'Hyderabad', state: 'Telangana', postalCode: '500001', phone: '9876543210' }],
  payments: [{ id: 'p1', provider: 'RAZORPAY', status: 'PAID' }],
});

const okFetch = () =>
  vi.fn(async (url: string) =>
    String(url).includes('pin-codes') ? json({ delivery_codes: [{ postal_code: { cod: 'Y', pre_paid: 'Y', district: 'Hyderabad' } }] })
    : json({ success: true, packages: [{ status: 'Success', waybill: '9999000011' }] }),
  );

describe('WorkerShipping booking', () => {
  it('books a paid order, saves the real AWB, and moves the order to processing', async () => {
    const order = baseOrder();
    const { prisma, state } = fakePrisma(order);
    await new WorkerShipping(prisma, env, okFetch()).createForOrder('o1', {}, 'admin1');
    expect(state.shipments[0]).toMatchObject({ awbNumber: '9999000011', courierProvider: 'Delhivery', status: 'READY' });
    expect(order.orderStatus).toBe('PROCESSING');
    expect(state.events[0].type).toBe('shipment.booked');
    expect(state.audits[0].action).toBe('SHIPMENT_BOOKED');
  });

  it('refuses an order whose payment is not confirmed, and never calls Delhivery', async () => {
    const order = { ...baseOrder(), paymentStatus: 'PENDING', payments: [{ id: 'p1', provider: 'RAZORPAY', status: 'PENDING' }] };
    const { prisma, state } = fakePrisma(order);
    const fetchFn = okFetch();
    await expect(new WorkerShipping(prisma, env, fetchFn).createForOrder('o1', {}, 'a')).rejects.toMatchObject({ status: 409 });
    expect(fetchFn).not.toHaveBeenCalled();
    expect(state.shipments).toHaveLength(0);
  });

  it('ships a Cash on Delivery order that is not yet paid, as COD with the order total', async () => {
    const order = { ...baseOrder(), paymentStatus: 'PENDING', payments: [{ id: 'p1', provider: 'COD', status: 'PENDING' }] };
    const { prisma } = fakePrisma(order);
    const fetchFn = okFetch();
    await new WorkerShipping(prisma, env, fetchFn).createForOrder('o1', {}, 'a');
    const create = fetchFn.mock.calls.find((c: any) => String(c[0]).includes('cmu/create')) as any;
    expect(JSON.parse(new URLSearchParams(create[1].body).get('data')!).shipments[0]).toMatchObject({ payment_mode: 'COD', cod_amount: '999.00' });
  });

  it('records nothing when Delhivery rejects the booking', async () => {
    const order = baseOrder();
    const { prisma, state } = fakePrisma(order);
    const fetchFn = vi.fn(async (url: string) => (String(url).includes('pin-codes') ? json({ delivery_codes: [{ postal_code: { cod: 'Y', pre_paid: 'Y' } }] }) : json({ success: false, rmk: 'bad warehouse', packages: [{ status: 'Fail', remarks: ['bad warehouse'] }] })));
    await expect(new WorkerShipping(prisma, env, fetchFn).createForOrder('o1', {}, 'a')).rejects.toMatchObject({ status: 422 });
    expect(state.shipments).toHaveLength(0);
    expect(order.orderStatus).toBe('CONFIRMED');
    expect(order.shippingStatus).toBe('NOT_SHIPPED');
  });

  it('stops on a pincode Delhivery does not serve, and on a bad phone number', async () => {
    const order = baseOrder();
    const { prisma } = fakePrisma(order);
    const none = vi.fn(async () => json({ delivery_codes: [] }));
    await expect(new WorkerShipping(prisma, env, none).createForOrder('o1', {}, 'a')).rejects.toMatchObject({ status: 422 });
    const badPhone = { ...baseOrder(), addresses: [{ ...baseOrder().addresses[0], phone: '123' }], customer: { name: 'x', phone: null } };
    const p2 = fakePrisma(badPhone);
    await expect(new WorkerShipping(p2.prisma, env, okFetch()).createForOrder('o1', {}, 'a')).rejects.toThrow(/phone/i);
  });

  it('will not book a second shipment for an order that already has one', async () => {
    const order = baseOrder();
    const { prisma } = fakePrisma(order);
    const svc = new WorkerShipping(prisma, env, okFetch());
    await svc.createForOrder('o1', {}, 'a');
    await expect(svc.createForOrder('o1', {}, 'a')).rejects.toThrow(/already has a shipment/);
  });

  it('rejects out-of-range package overrides', async () => {
    const { prisma } = fakePrisma(baseOrder());
    await expect(new WorkerShipping(prisma, env, okFetch()).createForOrder('o1', { weightGrams: 5 }, 'a')).rejects.toMatchObject({ status: 400 });
  });
});

describe('WorkerShipping tracking', () => {
  const setup = (status: string, payments: any[] = [{ id: 'p1', provider: 'RAZORPAY', status: 'PAID' }]) => {
    const order = baseOrder();
    const { prisma, state } = fakePrisma({ ...order, payments });
    state.shipments.push({ id: 'sh1', orderId: 'o1', warehouseId: 'wh1', awbNumber: '111', status, trackingEvents: [], ndrCases: [], rtoCases: [] });
    return { prisma, state, svc: new WorkerShipping(prisma, env, okFetch()) };
  };
  const t = (over: any) => ({ awb: '111', status: '', statusType: '', instructions: '', location: '', at: '2026-11-15T10:00:00', code: '', expectedDate: null, scans: [], ...over });

  it('marks delivery, completes the order, and settles Cash on Delivery', async () => {
    const { prisma, svc } = setup('OUT_FOR_DELIVERY', [{ id: 'cod1', provider: 'COD', status: 'PENDING' }]);
    const r = await svc.applyTracking('sh1', t({ status: 'Delivered', statusType: 'DL' }));
    expect(r).toMatchObject({ changed: true, status: 'DELIVERED' });
    expect(prisma.payment.update).toHaveBeenCalledWith({ where: { id: 'cod1' }, data: { status: 'PAID' } });
    const orderUpdate = prisma.order.update.mock.calls.at(-1)[0].data;
    expect(orderUpdate).toMatchObject({ orderStatus: 'COMPLETED', shippingStatus: 'DELIVERED', paymentStatus: 'PAID' });
  });

  it('opens a failed-delivery case once, not again on a repeat poll', async () => {
    const { prisma, svc } = setup('OUT_FOR_DELIVERY');
    await svc.applyTracking('sh1', t({ status: 'Pending', statusType: 'UD', instructions: 'Customer not available', code: 'EOD-74' }));
    expect(prisma.ndrCase.create).toHaveBeenCalledTimes(1);
    expect(prisma.ndrCase.create.mock.calls[0][0].data).toMatchObject({ attemptNumber: 1, status: 'NDR' });
  });

  it('opens a return case when the parcel starts coming back', async () => {
    const { prisma, svc } = setup('NDR');
    await svc.applyTracking('sh1', t({ status: 'In Transit', statusType: 'RT' }));
    expect(prisma.rtoCase.create).toHaveBeenCalledTimes(1);
  });

  it('ignores a late older scan and a repeated one', async () => {
    const { svc } = setup('OUT_FOR_DELIVERY');
    const r = await svc.applyTracking('sh1', t({ status: 'In Transit', statusType: 'UD', instructions: 'Arrived at hub' }));
    expect(r.status).toBe('OUT_FOR_DELIVERY');
  });

  it('refreshing a finished shipment does not call Delhivery', async () => {
    const { svc, state } = setup('DELIVERED');
    const fetchFn = vi.fn();
    const quiet = new WorkerShipping({ ...(svc as any).prisma }, env, fetchFn);
    await quiet.refresh('sh1');
    expect(fetchFn).not.toHaveBeenCalled();
    expect(state.shipments[0].status).toBe('DELIVERED');
  });
});

describe('WorkerShipping cancel and webhook', () => {
  const withShipment = (status: string) => {
    const { prisma, state } = fakePrisma(baseOrder());
    state.shipments.push({ id: 'sh1', orderId: 'o1', warehouseId: 'wh1', awbNumber: '111', status, trackingEvents: [], ndrCases: [], rtoCases: [] });
    return { prisma, state };
  };

  it('leaves everything unchanged when Delhivery refuses the cancellation', async () => {
    const { prisma, state } = withShipment('IN_TRANSIT');
    const refuse = vi.fn(async () => json({ status: false, remark: 'Shipment already picked up' }));
    await expect(new WorkerShipping(prisma, env, refuse).cancel('sh1', 'a')).rejects.toMatchObject({ status: 422 });
    expect(state.shipments[0].status).toBe('IN_TRANSIT');
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it('blocks cancelling a parcel that is out for delivery or already delivered', async () => {
    for (const s of ['OUT_FOR_DELIVERY', 'NDR', 'DELIVERED', 'RTO', 'NOT_SHIPPED']) {
      const { prisma } = withShipment(s);
      await expect(new WorkerShipping(prisma, env, vi.fn()).cancel('sh1', 'a')).rejects.toMatchObject({ status: 409 });
    }
  });

  it('cancels a booked shipment once Delhivery confirms', async () => {
    const { prisma, state } = withShipment('READY');
    await new WorkerShipping(prisma, env, vi.fn(async () => json({ status: true }))).cancel('sh1', 'a');
    expect(state.shipments[0].status).toBe('NOT_SHIPPED');
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });

  it('applies a pushed scan and ignores an unknown waybill', async () => {
    const { prisma, state } = withShipment('READY');
    prisma.shipment.findFirst = vi.fn(async ({ where }: any) => (where.awbNumber === '111' ? { id: 'sh1' } : null));
    const svc = new WorkerShipping(prisma, env, vi.fn());
    const out = await svc.applyWebhook({ Shipment: { AWB: '111', Status: { Status: 'Dispatched', StatusType: 'UD', StatusDateTime: '2026-11-15T10:00:00', StatusLocation: 'Hyd', Instructions: 'Out for delivery' } } });
    expect(out).toEqual({ received: 1, applied: 1 });
    expect(state.shipments[0].status).toBe('OUT_FOR_DELIVERY');
    expect(await svc.applyWebhook({ Shipment: { AWB: 'nope', Status: {} } })).toEqual({ received: 1, applied: 0 });
  });
});
