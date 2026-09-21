import { Order, RazorpaySuccessResponse, RazorpayErrorResponse } from '../types/auth';

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
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    return key;
  },

  isRazorpayConfigured(): boolean {
    const key = this.getRazorpayKey();
    return Boolean(key && key.startsWith('rzp_') && !key.includes('placeholder'));
  },

  async initiatePayment(options: InitiatePaymentOptions): Promise<void> {
    const {
      order,
      prefillName,
      prefillEmail,
      prefillPhone,
      onSuccess,
      onFailure,
      onDismiss,
    } = options;

    const razorpayKey = this.getRazorpayKey();

    if (!this.isRazorpayConfigured()) {
      // If Razorpay Key is not set, notify user and provide test mode option
      const proceedSimulation = window.confirm(
        'VITE_RAZORPAY_KEY_ID is not configured in .env.local.\n\n' +
        'Would you like to simulate a successful test payment to complete this order verification?\n\n' +
        'Click OK to simulate success, or Cancel to keep your cart.'
      );

      if (proceedSimulation) {
        // Simulate real Razorpay success response
        setTimeout(() => {
          onSuccess({
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_order_id: `order_sim_${Date.now()}`,
            razorpay_signature: `sig_sim_${Date.now()}`,
          });
        }, 800);
        return;
      } else {
        onFailure(new Error('Payment cancelled: Razorpay credentials not configured.'));
        return;
      }
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      onFailure(new Error('Failed to load Razorpay SDK. Please check your internet connection.'));
      return;
    }

    const amountInPaise = Math.round(order.total * 100);

    const rzpOptions = {
      key: razorpayKey,
      amount: amountInPaise,
      currency: 'INR',
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
      handler: function (response: RazorpaySuccessResponse) {
        onSuccess(response);
      },
      modal: {
        ondismiss: function () {
          if (onDismiss) onDismiss();
        },
        escape: true,
        backdropclose: false,
      },
    };

    try {
      const rzpInstance = new window.Razorpay(rzpOptions);
      rzpInstance.on('payment.failed', function (resp: any) {
        console.error('Razorpay payment failed:', resp.error);
        onFailure(resp.error as RazorpayErrorResponse);
      });
      rzpInstance.open();
    } catch (err: any) {
      onFailure(err);
    }
  },
};
