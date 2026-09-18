import React, { useState } from 'react';
import { ShieldCheck, MessageCircle, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CartItem } from '../types';
import { checkout, StorefrontAddress, CheckoutFailure } from '../api/storefrontApi';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  finalTotal: number;
  totalCartCount: number;
  onOrderPlaced: () => void;
}

type Step = 'form' | 'submitting' | 'success' | 'error';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  open,
  onClose,
  cartItems,
  finalTotal,
  totalCartCount,
  onOrderPlaced,
}) => {
  const [step, setStep] = useState<Step>('form');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [failures, setFailures] = useState<CheckoutFailure[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  if (!open) return null;

  const resetAndClose = () => {
    setStep('form');
    setOrderNumber(null);
    setFailures([]);
    setErrorMessage(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('submitting');
    setErrorMessage(null);

    const shippingAddress: StorefrontAddress = {
      type: 'SHIPPING',
      name,
      line1,
      city,
      state,
      postalCode,
      phone,
    };

    try {
      const result = await checkout(cartItems, { name, email: email || undefined, phone }, shippingAddress);

      if (result.order) {
        setOrderNumber(result.order.orderNumber);
        setFailures(result.failures);
        setStep('success');
        onOrderPlaced();
      } else {
        setFailures(result.failures);
        setErrorMessage('None of the items in your cart could be placed as an order.');
        setStep('error');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong placing your order.');
      setStep('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-100 relative max-h-[90vh] overflow-y-auto">
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-2">
              <div className="w-14 h-14 bg-[#0E4A93]/10 text-[#0E4A93] rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Delivery Details</h3>
              <p className="text-xs text-stone-500 mt-1">
                Total payable: <span className="font-bold text-[#0E4A93]">₹{finalTotal.toLocaleString('en-IN')}</span> for {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-2 px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E4A93]/30"
              />
              <input
                required
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E4A93]/30"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E4A93]/30"
              />
              <input
                required
                type="text"
                placeholder="Address"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className="col-span-2 px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E4A93]/30"
              />
              <input
                required
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E4A93]/30"
              />
              <input
                required
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E4A93]/30"
              />
              <input
                required
                type="text"
                placeholder="PIN Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="col-span-2 px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E4A93]/30"
              />
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              Placing this order reserves your items. Our team will contact you to confirm payment — no charge is made yet.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={resetAndClose}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#E8752A] hover:bg-[#d0641e] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Place Order
              </button>
            </div>
          </form>
        )}

        {step === 'submitting' && (
          <div className="text-center py-8 space-y-3">
            <Loader2 className="w-8 h-8 text-[#0E4A93] animate-spin mx-auto" />
            <p className="text-sm text-stone-600">Placing your order…</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Order Placed!</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Your order <span className="font-bold text-stone-900">#{orderNumber}</span> has been received. Our team will reach out shortly to confirm payment and delivery details.
            </p>

            {failures.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left text-xs text-amber-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Some items couldn't be included
                </div>
                {failures.map((f, i) => (
                  <div key={i}>• {f.item.product.name} — {f.reason}</div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={resetAndClose}
              className="w-full py-2.5 bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Couldn't Place Order</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {errorMessage} You can try again, or reach us directly on WhatsApp and we'll place it for you.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Try Again
              </button>
              <a
                href="https://wa.me/917893051555?text=Hello%20Canvas%20India%2C%20I%20would%20like%20to%20place%20my%20order%20directly."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
