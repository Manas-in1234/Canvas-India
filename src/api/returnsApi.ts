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
): Promise<void> {
  if (!email) return;
  try {
    await fetch(buildApiUrl('storefront/orders'), {
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
        payment: { status: 'captured', razorpayPaymentId: payment.razorpayPaymentId },
      }),
    });
  } catch (err) {
    console.warn('Could not sync order to the store backend:', err);
  }
}

export async function getReturnInfo(orderNumber: string, email: string): Promise<ReturnInfo> {
  const url = `${buildApiUrl('storefront/returns')}?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`;
  const res = await fetch(url);
  if (!res.ok) return { found: false };
  return res.json();
}

export async function requestReturn(
  orderNumber: string,
  email: string,
  orderItemId: string,
  reason: string,
): Promise<void> {
  const res = await fetch(buildApiUrl('storefront/returns'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderNumber, email, orderItemId, reason }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Could not submit your return request.');
  }
}
