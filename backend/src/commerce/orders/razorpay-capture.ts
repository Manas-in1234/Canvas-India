import { BadRequestException, ConflictException, ServiceUnavailableException } from '@nestjs/common';

type RazorpayCredentials = { RAZORPAY_KEY_ID?: string; RAZORPAY_KEY_SECRET?: string };

export async function verifyCapturedOrderPayment(
  env: RazorpayCredentials, paymentId: unknown, orderNumber: string, total: number,
) {
  if (typeof paymentId !== 'string' || !/^pay_[a-zA-Z0-9]+$/.test(paymentId)) {
    throw new BadRequestException('A Razorpay payment reference is required.');
  }
  if (!env.RAZORPAY_KEY_ID?.trim() || !env.RAZORPAY_KEY_SECRET?.trim()) {
    throw new ServiceUnavailableException('Payment verification is temporarily unavailable.');
  }
  const authorization = 'Basic ' + btoa(env.RAZORPAY_KEY_ID.trim() + ':' + env.RAZORPAY_KEY_SECRET.trim());
  async function read(path: string) {
    const response = await fetch('https://api.razorpay.com/v1/' + path, {
      headers: { Authorization: authorization }, signal: AbortSignal.timeout(8000),
    }).catch(() => null);
    if (response?.status === 400 || response?.status === 404) {
      throw new BadRequestException('Razorpay could not find the payment record.');
    }
    if (!response?.ok) throw new ServiceUnavailableException('Payment verification is temporarily unavailable.');
    return response.json();
  }

  const payment = await read('payments/' + paymentId) as {
    id?: string; status?: string; captured?: boolean; amount?: number; amount_refunded?: number;
    currency?: string; order_id?: string;
  };
  if (payment?.id !== paymentId || payment.status !== 'captured' || payment.captured !== true ||
      payment.amount !== Math.round(total * 100) || payment.currency !== 'INR' || payment.amount_refunded !== 0 ||
      !payment.order_id || !/^order_[a-zA-Z0-9]+$/.test(payment.order_id)) {
    throw new ConflictException('Razorpay has not confirmed a matching captured payment.');
  }
  const order = await read('orders/' + payment.order_id) as { receipt?: string; amount_paid?: number; currency?: string };
  if (order?.receipt !== orderNumber || order.amount_paid !== payment.amount || order.currency !== payment.currency) {
    throw new ConflictException('The captured payment does not match this order.');
  }
}
