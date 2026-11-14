import type { MailMessage } from './mailer.js';

export interface EmailBrand {
  storeName: string;
  storeUrl: string;
  adminUrl: string;
}

export const DEFAULT_BRAND: EmailBrand = {
  storeName: 'Canvas India',
  storeUrl: 'https://canvassindia.com',
  adminUrl: 'https://canvas-india-admin.pages.dev',
};

export interface EmailOrder {
  id: string;
  orderNumber: string;
  subtotal: unknown;
  discount: unknown;
  tax: unknown;
  shipping: unknown;
  total: unknown;
  customer: { name: string; email: string | null } | null;
  items: Array<{ productNameSnapshot: string; quantity: number; priceSnapshot: unknown; configurationSnapshot?: unknown }>;
  addresses: Array<{ type: string; name: string; line1: string; line2: string | null; city: string; state: string; postalCode: string; phone: string | null }>;
  payments: Array<{ provider: string; status: string }>;
}

/** Customer-supplied text goes into HTML, so every value is escaped. */
export const esc = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

const rupees = (value: unknown) => `Rs. ${Number(value ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function sizeOf(config: unknown): string {
  const c = (config ?? {}) as Record<string, unknown>;
  const size = c.size ?? c.dimensions;
  return typeof size === 'string' ? size : '';
}

function shell(brand: EmailBrand, heading: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f1ea;font-family:Arial,Helvetica,sans-serif;color:#1f2937">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden">
<tr><td style="background:#0E4A93;color:#ffffff;padding:18px 24px;font-size:20px;font-weight:bold">${esc(brand.storeName)}</td></tr>
<tr><td style="padding:24px"><h2 style="margin:0 0 12px;font-size:20px;color:#0E4A93">${esc(heading)}</h2>${bodyHtml}</td></tr>
<tr><td style="padding:16px 24px;background:#faf8f3;font-size:12px;color:#6b7280">Need help? Just reply to this email.<br><a href="${esc(brand.storeUrl)}" style="color:#0E4A93">${esc(brand.storeUrl.replace(/^https?:\/\//, ''))}</a></td></tr>
</table></td></tr></table></body></html>`;
}

function itemsTable(order: EmailOrder): string {
  const rows = order.items
    .map((i) => {
      const size = sizeOf(i.configurationSnapshot);
      return `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">${esc(i.productNameSnapshot)}${size ? `<br><span style="color:#6b7280;font-size:12px">${esc(size)}</span>` : ''}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${esc(i.quantity)}</td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">${rupees(Number(i.priceSnapshot) * i.quantity)}</td></tr>`;
    })
    .join('');
  const line = (label: string, value: string, bold = false) => `<tr><td colspan="2" style="padding:4px 0;text-align:right;${bold ? 'font-weight:bold;' : 'color:#6b7280;'}">${label}</td><td style="padding:4px 0;text-align:right;${bold ? 'font-weight:bold;' : ''}">${value}</td></tr>`;
  const discount = Number(order.discount ?? 0);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:12px 0"><tr><th align="left" style="padding-bottom:6px;color:#6b7280;font-size:12px">ITEM</th><th style="padding-bottom:6px;color:#6b7280;font-size:12px">QTY</th><th align="right" style="padding-bottom:6px;color:#6b7280;font-size:12px">AMOUNT</th></tr>${rows}
${line('Subtotal', rupees(order.subtotal))}${discount > 0 ? line('Discount', `- ${rupees(discount)}`) : ''}${Number(order.shipping ?? 0) > 0 ? line('Delivery', rupees(order.shipping)) : line('Delivery', 'Free')}${Number(order.tax ?? 0) > 0 ? line('Tax', rupees(order.tax)) : ''}${line('Total', rupees(order.total), true)}</table>`;
}

function addressBlock(order: EmailOrder): string {
  const a = order.addresses.find((x) => x.type === 'SHIPPING');
  if (!a) return '';
  return `<p style="margin:12px 0 4px;color:#6b7280;font-size:12px">DELIVERING TO</p><p style="margin:0;font-size:14px;line-height:1.5">${esc(a.name)}<br>${esc(a.line1)}${a.line2 ? `<br>${esc(a.line2)}` : ''}<br>${esc(a.city)}, ${esc(a.state)} ${esc(a.postalCode)}${a.phone ? `<br>Phone: ${esc(a.phone)}` : ''}</p>`;
}

const isCod = (order: EmailOrder) => order.payments.some((p) => p.provider === 'COD');
const firstName = (order: EmailOrder) => (order.customer?.name || 'there').trim().split(/\s+/)[0];
const itemsText = (order: EmailOrder) => order.items.map((i) => `- ${i.productNameSnapshot} x ${i.quantity}`).join('\n');

export function orderConfirmed(order: EmailOrder, brand: EmailBrand = DEFAULT_BRAND): MailMessage & { to: string } {
  const cod = isCod(order);
  const body = `<p style="margin:0 0 8px;font-size:14px">Hi ${esc(firstName(order))}, thank you for your order. We have received it and will start making it right away.</p>
<p style="margin:0;font-size:14px"><strong>Order number:</strong> ${esc(order.orderNumber)}</p>${itemsTable(order)}${cod ? `<p style="background:#fff7e6;border:1px solid #f5d28a;padding:10px;border-radius:6px;font-size:14px">Payment: <strong>Cash on Delivery</strong>. Please keep ${rupees(order.total)} ready when the parcel arrives.</p>` : '<p style="font-size:14px;color:#047857"><strong>Payment received.</strong></p>'}${addressBlock(order)}<p style="margin-top:16px;font-size:14px">We will email you again when your order ships.</p>`;
  return {
    to: order.customer?.email ?? '',
    subject: `Order confirmed: ${order.orderNumber}`,
    html: shell(brand, 'Your order is confirmed', body),
    text: `Hi ${firstName(order)},\n\nThank you for your order ${order.orderNumber}.\n\n${itemsText(order)}\n\nTotal: ${rupees(order.total)}${cod ? ` (Cash on Delivery, please keep this amount ready)` : ' (paid)'}\n\nWe will email you when it ships.\n\n${brand.storeName}`,
  };
}

export function orderShipped(order: EmailOrder, awb: string | null, brand: EmailBrand = DEFAULT_BRAND): MailMessage & { to: string } {
  const track = awb ? `https://www.delhivery.com/track-v2/package/${encodeURIComponent(awb)}` : null;
  const body = `<p style="margin:0 0 8px;font-size:14px">Hi ${esc(firstName(order))}, good news: your order <strong>${esc(order.orderNumber)}</strong> is on its way.</p>${awb ? `<p style="font-size:14px;margin:8px 0">Tracking number (AWB): <strong>${esc(awb)}</strong></p>` : ''}${track ? `<p style="margin:16px 0"><a href="${esc(track)}" style="background:#E8752A;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">Track your parcel</a></p>` : ''}${addressBlock(order)}${isCod(order) ? `<p style="font-size:14px">Please keep ${rupees(order.total)} ready for the delivery person.</p>` : ''}`;
  return {
    to: order.customer?.email ?? '',
    subject: `Your order ${order.orderNumber} has shipped`,
    html: shell(brand, 'Your order has shipped', body),
    text: `Hi ${firstName(order)},\n\nYour order ${order.orderNumber} is on its way.${awb ? `\nTracking number: ${awb}` : ''}${track ? `\nTrack it: ${track}` : ''}\n\n${brand.storeName}`,
  };
}

export function orderDelivered(order: EmailOrder, brand: EmailBrand = DEFAULT_BRAND): MailMessage & { to: string } {
  const body = `<p style="margin:0 0 8px;font-size:14px">Hi ${esc(firstName(order))}, your order <strong>${esc(order.orderNumber)}</strong> has been delivered. We hope you love it.</p><p style="font-size:14px">If anything is not right, reply to this email and we will help.</p>`;
  return {
    to: order.customer?.email ?? '',
    subject: `Delivered: order ${order.orderNumber}`,
    html: shell(brand, 'Your order was delivered', body),
    text: `Hi ${firstName(order)},\n\nYour order ${order.orderNumber} has been delivered. If anything is not right, reply to this email.\n\n${brand.storeName}`,
  };
}

export function orderCancelled(order: EmailOrder, brand: EmailBrand = DEFAULT_BRAND): MailMessage & { to: string } {
  const paidOnline = order.payments.some((p) => p.provider !== 'COD' && ['PAID', 'REFUNDED', 'PARTIALLY_REFUNDED'].includes(p.status));
  const body = `<p style="margin:0 0 8px;font-size:14px">Hi ${esc(firstName(order))}, your order <strong>${esc(order.orderNumber)}</strong> has been cancelled.</p>${paidOnline ? '<p style="font-size:14px">Any amount you paid online will be refunded to your original payment method.</p>' : ''}<p style="font-size:14px">If you did not ask for this, reply to this email and we will look into it.</p>`;
  return {
    to: order.customer?.email ?? '',
    subject: `Order ${order.orderNumber} cancelled`,
    html: shell(brand, 'Your order was cancelled', body),
    text: `Hi ${firstName(order)},\n\nYour order ${order.orderNumber} has been cancelled.${paidOnline ? '\nAny amount paid online will be refunded to your original payment method.' : ''}\n\n${brand.storeName}`,
  };
}

/** Sent to the shop: a new order needs attention. */
export function adminNewOrder(order: EmailOrder, brand: EmailBrand = DEFAULT_BRAND): Omit<MailMessage, 'to'> {
  const link = `${brand.adminUrl}/orders/placeholder?id=${encodeURIComponent(order.id)}`;
  const body = `<p style="margin:0 0 8px;font-size:14px">New order <strong>${esc(order.orderNumber)}</strong> from ${esc(order.customer?.name ?? 'a customer')}.</p><p style="font-size:14px;margin:4px 0">${isCod(order) ? '<strong>Cash on Delivery</strong>' : 'Paid online'} · ${rupees(order.total)}</p>${itemsTable(order)}${addressBlock(order)}<p style="margin:16px 0"><a href="${esc(link)}" style="background:#0E4A93;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">Open in admin</a></p>`;
  return {
    subject: `New order ${order.orderNumber}: ${rupees(order.total)}${isCod(order) ? ' (COD)' : ''}`,
    html: shell(brand, 'New order received', body),
    text: `New order ${order.orderNumber} from ${order.customer?.name ?? 'a customer'}.\n${isCod(order) ? 'Cash on Delivery' : 'Paid online'}: ${rupees(order.total)}\n\n${itemsText(order)}\n\nOpen: ${link}`,
  };
}
