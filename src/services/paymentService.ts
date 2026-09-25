import { Order, RazorpaySuccessResponse, RazorpayErrorResponse } from '../types/auth';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../api/razorpayApi';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export interface InitiatePaymentOptions {
  order: Order;
  prefillName: string;
  prefillEmail: string;
  prefillPhone: string;
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onFailure: (error: RazorpayErrorResponse | Error) => void;
  onDismiss?: () => void;
}

export const paymentService = {
  getRazorpayKey(): string {
    return import.meta.env.VITE_RAZORPAY_KEY_ID || '';
  },

  isRazorpayConfigured(): boolean {
    const key = this.getRazorpayKey();

    return Boolean(
      key &&
      key.startsWith('rzp_') &&
      !key.includes('placeholder'),
    );
  },

  async initiatePayment(
    options: InitiatePaymentOptions,
  ): Promise<void> {
    const {
      order,
      prefillName,
      prefillEmail,
      prefillPhone,
      onSuccess,
      onFailure,
      onDismiss,
    } = options;

    if (!this.isRazorpayConfigured()) {
      onFailure(
        new Error('Razorpay credentials are not configured.'),
      );
      return;
    }

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      onFailure(
        new Error(
          'Failed to load Razorpay SDK. Please check your internet connection.',
        ),
      );
      return;
    }

    try {
      const amountInRupees = Number(order.total);

      if (
        !Number.isFinite(amountInRupees) ||
        amountInRupees <= 0
      ) {
        throw new Error('Invalid order amount.');
      }

      const razorpayOrder = await createRazorpayOrder(
        amountInRupees,
        'INR',
        order.order_number,
      );

      const razorpayOrderId =
        razorpayOrder.clientSecretOrOrderId;

      if (!razorpayOrderId) {
        throw new Error(
          'Backend did not return a valid Razorpay order ID.',
        );
      }

      const razorpayKey = this.getRazorpayKey();

      const rzpOptions = {
        key: razorpayKey,
        order_id: razorpayOrderId,

        name: 'Canvas India',
        description: `Payment for Order #${order.order_number}`,
        image: 'https://canvasindia.in/favicon.ico',

        prefill: {
          name: prefillName,
          email: prefillEmail,
          contact: prefillPhone,
        },

        notes: {
          order_id: order.id,
          order_number: order.order_number,
        },

        theme: {
          color: '#002B49',
        },

        handler: async function (
          response: RazorpaySuccessResponse,
        ) {
          try {
            const verification =
              await verifyRazorpayPayment(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature,
              );

            if (!verification.verified) {
              throw new Error(
                'Razorpay payment verification failed.',
              );
            }

            onSuccess(response);
          } catch (error) {
            console.error(
              'Razorpay payment verification failed:',
              error,
            );

            onFailure(
              error instanceof Error
                ? error
                : new Error(
                    'Razorpay payment verification failed.',
                  ),
            );
          }
        },

        modal: {
          ondismiss: function () {
            if (onDismiss) {
              onDismiss();
            }
          },

          escape: true,
          backdropclose: false,
        },
      };

      const rzpInstance =
        new window.Razorpay(rzpOptions);

      rzpInstance.on(
        'payment.failed',
        function (resp: any) {
          console.error(
            'Razorpay payment failed:',
            resp.error,
          );

          onFailure(
            resp.error as RazorpayErrorResponse,
          );
        },
      );

      rzpInstance.open();
    } catch (err: any) {
      console.error(
        'Razorpay initialization failed:',
        err,
      );

      onFailure(
        err instanceof Error
          ? err
          : new Error(
              'Failed to initialize Razorpay payment.',
            ),
      );
    }
  },
};
