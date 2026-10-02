import { buildApiUrl } from './productsApi';

export interface CreateRazorpayOrderResponse {
  providerRef: string;
  clientSecretOrOrderId: string;
}

export interface VerifyRazorpayPaymentResponse {
  verified: boolean;
  razorpayOrderId: string;
  razorpayPaymentId: string;
}

export async function createRazorpayOrder(
  amount: number,
  currency = 'INR',
  receipt?: string,
): Promise<CreateRazorpayOrderResponse> {
  const url = buildApiUrl('payments/razorpay/order');

  if (!url) {
    throw new Error('VITE_API_BASE_URL is not configured');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(
      `Failed to create Razorpay order: ${response.status} ${message}`,
    );
  }

  return response.json();
}

export async function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
): Promise<VerifyRazorpayPaymentResponse> {
  const url = buildApiUrl('payments/razorpay/verify');

  if (!url) {
    throw new Error('VITE_API_BASE_URL is not configured');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(
      `Failed to verify Razorpay payment: ${response.status} ${message}`,
    );
  }

  return response.json();
}
