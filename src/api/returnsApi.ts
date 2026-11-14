import { buildApiUrl } from './productsApi';
import type { Order } from '../types/auth';

export interface ReturnInfo {
  found: boolean;
  orderId?: string;
  /** Returns can only be requested once the store has marked the order delivered. */
  delivered?: boolean;
  items?: { id: string; productNameSnapshot: string; quantity: number }[];
  returns?: { id: string; orderItemId: string; reason: string; status: string; createdAt: string }[];
}

/**
 * Copies a paid storefront order into the store backend so the admin can see it and
 * customers can file returns against it. Best effort: never blocks checkout.
 */
export async function mirrorOrderToBackend(
  order: Order,
  email: string | null,
  payment: { razorpayPaymentId?: string },
  couponCode?: string | null,
): Promise<boolean> {
  if (!email) return false;
  if (!payment.razorpayPaymentId && !(couponCode && Number(order.total) === 0)) return false;
  try {
    const response = await fetch(buildApiUrl('storefront/orders'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: order.order_number,
        customerEmail: email,
        customerPhone: order.shipping_address?.phone ?? order.guest_phone ?? undefined,
        customerName: order.shipping_address?.name,
        items: (order.items ?? []).map((item) => ({
          productId: item.product_id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.image_url,
          customizationDetails: item.customization_details,
        })),
        subtotal: order.subtotal,
        discount: order.discount,
        shippingFee: order.shipping_fee,
        tax: order.tax,
        total: order.total,
        shippingAddress: order.shipping_address,
        couponCode: couponCode || undefined,
        payment: payment.razorpayPaymentId ? { razorpayPaymentId: payment.razorpayPaymentId } : undefined,
      }),
    });
    return response.ok;
  } catch (err) {
    console.warn('Could not sync order to the store backend:', err);
    return false;
  }
}

export async function getReturnInfo(orderNumber: string, email: string, kind: 'returns' | 'replacements' = 'returns'): Promise<ReturnInfo> {
  const url = `${buildApiUrl(`storefront/${kind}`)}?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`;
  const res = await fetch(url);
  if (!res.ok) return { found: false };
  return res.json();
}

export async function requestReturn(
  orderNumber: string,
  email: string,
  orderItemId: string,
  reason: string,
  kind: 'returns' | 'replacements' = 'returns',
): Promise<void> {
  const res = await fetch(buildApiUrl(`storefront/${kind}`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderNumber, email, orderItemId, reason }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Could not submit your return request.');
  }
}

export interface LiveOrderStatus {
  found: boolean;
  orderStatus?: string;
  shippingStatus?: string;
  /** True only until the store starts production. */
  cancellable?: boolean;
}

export async function getLiveOrderStatus(orderNumber: string, email: string): Promise<LiveOrderStatus> {
  const url = `${buildApiUrl('storefront/orders/status')}?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`;
  const res = await fetch(url);
  if (!res.ok) return { found: false };
  return res.json();
}

export async function cancelOrder(orderNumber: string, email: string): Promise<void> {
  const res = await fetch(buildApiUrl('storefront/orders/status'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderNumber, email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Could not cancel this order.');
  }
}
