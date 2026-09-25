import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import crypto from 'node:crypto';

import type {
  CreatePaymentIntentResult,
  PaymentProviderAdapter,
  VerifyWebhookResult,
} from './payment-provider.interface.js';

@Injectable()
export class RazorpayAdapter implements PaymentProviderAdapter {
  private readonly razorpay: Razorpay;

  constructor(private readonly configService: ConfigService) {
    const keyId =
      this.configService.get<string>('razorpay.keyId') ?? '';

    const keySecret =
      this.configService.get<string>('razorpay.keySecret') ?? '';

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials are not configured');
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    orderId: string,
  ): Promise<CreatePaymentIntentResult> {
    const razorpayOrder = await this.razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: orderId,
    });

    return {
      providerRef: razorpayOrder.id,
      clientSecretOrOrderId: razorpayOrder.id,
    };
  }

  /**
   * Verify the signature returned by Razorpay Checkout.
   *
   * Razorpay signs:
   *   razorpay_order_id|razorpay_payment_id
   *
   * using the Razorpay key secret.
   */
  verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): boolean {
    const keySecret =
      this.configService.get<string>('razorpay.keySecret') ?? '';

    if (
      !keySecret ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return false;
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const expected = Buffer.from(generatedSignature, 'utf8');
    const received = Buffer.from(razorpaySignature, 'utf8');

    if (expected.length !== received.length) {
      return false;
    }

    return crypto.timingSafeEqual(expected, received);
  }

  verifyWebhookSignature(
    rawBody: Buffer,
    signatureHeader: string,
  ): boolean {
    const webhookSecret =
      this.configService.get<string>('razorpay.webhookSecret') ?? '';

    if (!webhookSecret || !signatureHeader) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const expected = Buffer.from(expectedSignature, 'utf8');
    const received = Buffer.from(signatureHeader, 'utf8');

    if (expected.length !== received.length) {
      return false;
    }

    return crypto.timingSafeEqual(expected, received);
  }

  parseWebhookEvent(rawBody: Buffer): VerifyWebhookResult {
    const payload = JSON.parse(
      rawBody.toString('utf8'),
    );

    return {
      isValid: true,
      eventId: payload?.id ?? '',
      eventType: payload?.event ?? '',
      providerRef:
        payload?.payload?.payment?.entity?.order_id ??
        payload?.payload?.order?.entity?.id ??
        '',
    };
  }
}