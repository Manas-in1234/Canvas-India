import { Injectable, NotImplementedException } from '@nestjs/common';
import type {
  CreatePaymentIntentResult,
  PaymentProviderAdapter,
  VerifyWebhookResult,
} from './payment-provider.interface.js';

/**
 * Stub adapter (scope §46-47, §92): the real Razorpay SDK wiring is deferred
 * until gateway credentials are provisioned. Kept as a distinct class so
 * swapping in a live implementation never touches PaymentsService callers.
 */
@Injectable()
export class RazorpayAdapter implements PaymentProviderAdapter {
  createPaymentIntent(_amount: number, _currency: string, _orderId: string): Promise<CreatePaymentIntentResult> {
    throw new NotImplementedException('Razorpay integration is not yet configured');
  }

  verifyWebhookSignature(_rawBody: Buffer, _signatureHeader: string): boolean {
    throw new NotImplementedException('Razorpay integration is not yet configured');
  }

  parseWebhookEvent(_rawBody: Buffer): VerifyWebhookResult {
    throw new NotImplementedException('Razorpay integration is not yet configured');
  }
}
