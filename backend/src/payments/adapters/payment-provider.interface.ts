/**
 * Payment abstraction (scope §46): the app depends on this interface, never on
 * a specific gateway SDK, so a new provider can be added as another adapter
 * (scope §92) without touching order/checkout logic.
 */
export interface CreatePaymentIntentResult {
  providerRef: string;
  clientSecretOrOrderId: string;
}

export interface VerifyWebhookResult {
  isValid: boolean;
  eventId: string;
  eventType: string;
  providerRef: string;
}

export interface PaymentProviderAdapter {
  createPaymentIntent(amount: number, currency: string, orderId: string): Promise<CreatePaymentIntentResult>;
  verifyWebhookSignature(rawBody: Buffer, signatureHeader: string): boolean;
  parseWebhookEvent(rawBody: Buffer): VerifyWebhookResult;
}
