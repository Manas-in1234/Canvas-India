import { describe, expect, it, vi } from 'vitest';
import { isEmail, mailConfigured, maskEmail, sendMail } from './mailer.js';
import { adminNewOrder, esc, orderCancelled, orderConfirmed, orderDelivered, orderShipped, type EmailOrder } from './email-templates.js';
import { sendOrderEmail } from './order-emails.js';
import { WorkerShipping } from '../shipping/worker-shipping.js';

const env = { RESEND_API_KEY: 're_test', MAIL_FROM: 'Canvas India <orders@canvassindia.com>', ADMIN_NOTIFY_EMAIL: 'owner@canvassindia.com, ops@canvassindia.com' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

const order = (over: Partial<EmailOrder> = {}): EmailOrder => ({
  id: 'o1', orderNumber: 'CI-20261114-1234', subtotal: '1000', discount: '100', tax: '0', shipping: '0', total: '900',
  customer: { name: 'Asha Rao', email: 'asha@example.com' },
  items: [{ productNameSnapshot: 'Canvas Heart', quantity: 2, priceSnapshot: '500', configurationSnapshot: { size: '12" x 18"' } }],
  addresses: [{ type: 'SHIPPING', name: 'Asha Rao', line1: '12-3 Road', line2: null, city: 'Warangal', state: 'Telangana', postalCode: '506001', phone: '9876543210' }],
  payments: [{ provider: 'RAZORPAY', status: 'PAID' }],
  ...over,
});

describe('mailer', () => {
  it('does nothing, and says so, when Resend is not configured', async () => {
    const fetchFn = vi.fn();
    expect(mailConfigured({})).toBe(false);
    expect(await sendMail({}, { to: 'a@b.co', subject: 's', html: 'h', text: 't' }, fetchFn)).toEqual({ sent: false, reason: 'not-configured' });
    expect(await sendMail({ RESEND_API_KEY: 'k' }, { to: 'a@b.co', subject: 's', html: 'h', text: 't' }, fetchFn)).toMatchObject({ reason: 'not-configured' });
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('sends one request with the key, sender and only valid recipients', async () => {
    const fetchFn = vi.fn(async () => json({ id: 'em_1' }));
    const result = await sendMail({ ...env, MAIL_REPLY_TO: 'help@canvassindia.com' }, { to: ['a@b.co', 'not-an-email'], subject: 'Hi', html: '<p>x</p>', text: 'x' }, fetchFn as never);
    expect(result).toEqual({ sent: true, id: 'em_1' });
    const [url, init] = fetchFn.mock.calls[0] as any;
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer re_test');
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({ from: env.MAIL_FROM, to: ['a@b.co'], subject: 'Hi', reply_to: 'help@canvassindia.com' });
  });

  it('never throws: a rejection or a network failure comes back as a result', async () => {
    const rejected = vi.fn(async () => json({ message: 'domain not verified' }, 403));
    expect(await sendMail(env, { to: 'a@b.co', subject: 's', html: 'h', text: 't' }, rejected as never)).toMatchObject({ sent: false, reason: 'rejected' });
    const down = vi.fn(async () => { throw new Error('offline'); });
    expect(await sendMail(env, { to: 'a@b.co', subject: 's', html: 'h', text: 't' }, down as never)).toMatchObject({ sent: false, reason: 'network' });
    expect(await sendMail(env, { to: ['bad'], subject: 's', html: 'h', text: 't' }, rejected as never)).toMatchObject({ reason: 'no-recipient' });
  });

  it('validates and masks addresses', () => {
    expect(isEmail('asha@example.com')).toBe(true);
    expect(isEmail('asha@')).toBe(false);
    expect(isEmail(null)).toBe(false);
    expect(maskEmail('asha@example.com')).toBe('a***@example.com');
  });
});

describe('email templates', () => {
  it('escapes anything a customer typed', () => {
    expect(esc('<script>alert("x")</script> & \'q\'')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;q&#39;');
    const evil = order({ customer: { name: '<img src=x onerror=alert(1)>', email: 'a@b.co' } });
    const mail = orderConfirmed(evil);
    expect(mail.html).not.toContain('<img src=x');
    expect(mail.html).toContain('&lt;img');
  });

  it('confirmation shows items, totals and what to expect', () => {
    const mail = orderConfirmed(order());
    expect(mail.to).toBe('asha@example.com');
    expect(mail.subject).toContain('CI-20261114-1234');
    expect(mail.html).toContain('Canvas Heart');
    expect(mail.html).toContain('Payment received');
    expect(mail.html).toContain('900.00');
    expect(mail.text).toContain('Canvas Heart x 2');
  });

  it('tells a Cash on Delivery customer how much to have ready', () => {
    const cod = order({ payments: [{ provider: 'COD', status: 'PENDING' }] });
    expect(orderConfirmed(cod).html).toContain('Cash on Delivery');
    expect(orderConfirmed(cod).html).toContain('900.00');
    expect(orderShipped(cod, '123').html).toContain('keep');
  });

  it('shipped email links to tracking; delivered and cancelled read correctly', () => {
    const shipped = orderShipped(order(), '4789120011');
    expect(shipped.html).toContain('https://www.delhivery.com/track-v2/package/4789120011');
    expect(orderShipped(order(), null).html).not.toContain('delhivery.com');
    expect(orderDelivered(order()).subject).toContain('Delivered');
    expect(orderCancelled(order()).html).toContain('refunded');
    expect(orderCancelled(order({ payments: [{ provider: 'COD', status: 'PENDING' }] })).html).not.toContain('refunded');
  });

  it('admin alert links to the order and flags Cash on Delivery', () => {
    const mail = adminNewOrder(order({ payments: [{ provider: 'COD', status: 'PENDING' }] }));
    expect(mail.subject).toContain('(COD)');
    expect(mail.html).toContain('/orders/placeholder?id=o1');
  });
});

function fakePrisma(options: { order?: any; sentBefore?: boolean } = {}) {
  const events: any[] = [];
  const prisma: any = {
    orderEvent: {
      findFirst: vi.fn(async () => (options.sentBefore ? { id: 'e0' } : null)),
      create: vi.fn(async ({ data }: any) => { events.push(data); }),
    },
    order: { findUnique: vi.fn(async () => options.order === undefined ? { ...order(), shipments: [{ awbNumber: '777', status: 'READY' }] } : options.order) },
  };
  return { prisma, events };
}

describe('sending an order email', () => {
  it('sends once, and records it on the order timeline without the full address', async () => {
    const { prisma, events } = fakePrisma();
    const fetchFn = vi.fn(async () => json({ id: 'em_1' }));
    const result = await sendOrderEmail(prisma, env, 'o1', 'confirmed', fetchFn as never);
    expect(result).toMatchObject({ sent: true });
    expect(events[0]).toMatchObject({ orderId: 'o1', type: 'email.confirmed' });
    expect(events[0].message).toContain('a***@example.com');
    expect(events[0].message).not.toContain('asha@');
  });

  it('does not send the same email twice', async () => {
    const { prisma } = fakePrisma({ sentBefore: true });
    const fetchFn = vi.fn();
    expect(await sendOrderEmail(prisma, env, 'o1', 'confirmed', fetchFn as never)).toEqual({ sent: false, reason: 'already-sent' });
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('does not even look at the database when email is not configured', async () => {
    const { prisma } = fakePrisma();
    expect(await sendOrderEmail(prisma, {}, 'o1', 'confirmed')).toEqual({ sent: false, reason: 'not-configured' });
    expect(prisma.orderEvent.findFirst).not.toHaveBeenCalled();
  });

  it('records nothing when the send fails, so it can be retried later', async () => {
    const { prisma, events } = fakePrisma();
    const rejected = vi.fn(async () => json({ message: 'bad key' }, 401));
    expect(await sendOrderEmail(prisma, env, 'o1', 'confirmed', rejected as never)).toMatchObject({ sent: false });
    expect(events).toHaveLength(0);
  });

  it('skips a customer with no email, and an order that does not exist', async () => {
    const noEmail = fakePrisma({ order: { ...order({ customer: { name: 'x', email: null } }), shipments: [] } });
    expect(await sendOrderEmail(noEmail.prisma, env, 'o1', 'shipped')).toMatchObject({ reason: 'no-recipient' });
    const missing = fakePrisma({ order: null });
    expect(await sendOrderEmail(missing.prisma, env, 'nope', 'confirmed')).toEqual({ sent: false, reason: 'missing-order' });
  });

  it('puts the tracking number in the shipped email, and sends the alert to every shop address', async () => {
    const { prisma } = fakePrisma();
    const fetchFn = vi.fn(async () => json({ id: 'x' }));
    await sendOrderEmail(prisma, env, 'o1', 'shipped', fetchFn as never);
    expect(JSON.parse((fetchFn.mock.calls[0] as any)[1].body).html).toContain('777');
    const alert = vi.fn(async () => json({ id: 'y' }));
    await sendOrderEmail(fakePrisma().prisma, env, 'o1', 'admin_new', alert as never);
    expect(JSON.parse((alert.mock.calls[0] as any)[1].body).to).toEqual(['owner@canvassindia.com', 'ops@canvassindia.com']);
  });

  it('a thrown database error does not escape', async () => {
    const prisma: any = { orderEvent: { findFirst: vi.fn(async () => { throw new Error('db down'); }) } };
    await expect(sendOrderEmail(prisma, env, 'o1', 'confirmed')).resolves.toMatchObject({ sent: false });
  });
});

describe('shipment updates notify the customer once the parcel moves', () => {
  const trackedShip = (status: string) => {
    const state = { shipment: { id: 'sh1', orderId: 'o1', warehouseId: 'w', awbNumber: '111', status, trackingEvents: [], ndrCases: [], rtoCases: [], order: { payments: [] } } };
    const prisma: any = {
      shipment: { findUnique: vi.fn(async () => state.shipment), update: vi.fn() },
      trackingEvent: { createMany: vi.fn(), create: vi.fn() },
      order: { update: vi.fn() }, payment: { update: vi.fn() }, ndrCase: { create: vi.fn(), updateMany: vi.fn() }, rtoCase: { create: vi.fn() },
      $transaction: async (fn: any) => fn(prisma),
    };
    return prisma;
  };
  const t = (over: any) => ({ awb: '111', status: '', statusType: '', instructions: '', location: '', at: '2026-11-15T10:00:00', code: '', expectedDate: null, scans: [], ...over });

  it('calls the notifier with shipped, then delivered', async () => {
    const notify = vi.fn();
    const ship = new WorkerShipping(trackedShip('READY'), { DELHIVERY_API_TOKEN: 't' }, undefined, notify);
    await ship.applyTracking('sh1', t({ status: 'In Transit', statusType: 'UD', instructions: 'Shipment picked up' }));
    expect(notify).toHaveBeenCalledWith('shipped', 'o1');
    const delivered = new WorkerShipping(trackedShip('OUT_FOR_DELIVERY'), { DELHIVERY_API_TOKEN: 't' }, undefined, notify);
    await delivered.applyTracking('sh1', t({ status: 'Delivered', statusType: 'DL' }));
    expect(notify).toHaveBeenCalledWith('delivered', 'o1');
  });

  it('does not notify when nothing changed or the parcel is only booked', async () => {
    const notify = vi.fn();
    const ship = new WorkerShipping(trackedShip('READY'), { DELHIVERY_API_TOKEN: 't' }, undefined, notify);
    await ship.applyTracking('sh1', t({ status: 'Manifested', statusType: 'UD' }));
    expect(notify).not.toHaveBeenCalled();
  });
});
