import { DEFAULT_BRAND, adminNewOrder, orderCancelled, orderConfirmed, orderDelivered, orderShipped, type EmailBrand, type EmailOrder } from './email-templates.js';
import { isEmail, mailConfigured, maskEmail, sendMail, type MailerEnv, type MailResult } from './mailer.js';

export type OrderEmailKind = 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'admin_new';

export interface OrderEmailEnv extends MailerEnv {
  /** One or more addresses (comma separated) that get a new-order alert. */
  ADMIN_NOTIFY_EMAIL?: string;
  STORE_NAME?: string;
  STORE_URL?: string;
  ADMIN_URL?: string;
}

export function brandFrom(env: OrderEmailEnv): EmailBrand {
  return {
    storeName: env.STORE_NAME?.trim() || DEFAULT_BRAND.storeName,
    storeUrl: (env.STORE_URL?.trim() || DEFAULT_BRAND.storeUrl).replace(/\/+$/, ''),
    adminUrl: (env.ADMIN_URL?.trim() || DEFAULT_BRAND.adminUrl).replace(/\/+$/, ''),
  };
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/**
 * Sends one kind of email for one order, at most once. Never throws.
 * "Once" is enforced by an order-timeline event (email.<kind>) written after a successful send,
 * so retries, repeated tracking updates and duplicate requests cannot send it twice.
 */
export async function sendOrderEmail(
  prisma: any,
  env: OrderEmailEnv,
  orderId: string,
  kind: OrderEmailKind,
  fetchFn?: FetchLike,
): Promise<MailResult | { sent: false; reason: 'already-sent' | 'missing-order' }> {
  try {
    if (!mailConfigured(env)) return { sent: false, reason: 'not-configured' };
    const eventType = `email.${kind}`;
    const already = await prisma.orderEvent.findFirst({ where: { orderId, type: eventType }, select: { id: true } });
    if (already) return { sent: false, reason: 'already-sent' };

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, addresses: true, customer: true, payments: true, shipments: { orderBy: { createdAt: 'desc' } } },
    });
    if (!order) return { sent: false, reason: 'missing-order' };

    const brand = brandFrom(env);
    const view = order as unknown as EmailOrder;
    let message: { to: string | string[]; subject: string; html: string; text: string };
    let note: string;
    if (kind === 'admin_new') {
      const to = (env.ADMIN_NOTIFY_EMAIL || '').split(',').map((s) => s.trim()).filter(isEmail);
      message = { to, ...adminNewOrder(view, brand) };
      note = 'New-order alert emailed to the shop';
    } else {
      const customerEmail = order.customer?.email;
      if (!isEmail(customerEmail)) return { sent: false, reason: 'no-recipient' };
      const awb = order.shipments.find((s: any) => s.awbNumber && s.status !== 'NOT_SHIPPED')?.awbNumber ?? null;
      message =
        kind === 'confirmed' ? orderConfirmed(view, brand)
        : kind === 'shipped' ? orderShipped(view, awb, brand)
        : kind === 'delivered' ? orderDelivered(view, brand)
        : orderCancelled(view, brand);
      note = `${kind[0].toUpperCase()}${kind.slice(1)} email sent to ${maskEmail(customerEmail)}`;
    }

    const result = await sendMail(env, message, fetchFn);
    if (result.sent) {
      await prisma.orderEvent.create({ data: { orderId, type: eventType, message: note } });
    }
    return result;
  } catch (err) {
    console.error('order email failed', kind, orderId, err);
    return { sent: false, reason: 'network', detail: 'unexpected error' };
  }
}
