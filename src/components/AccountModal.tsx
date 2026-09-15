import React, { useState } from 'react';
import { X, Package, User, Truck, CheckCircle2, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'track' | 'login';
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'track',
}) => {
  const [activeTab, setActiveTab] = useState<'track' | 'login'>(defaultTab);
  const [orderId, setOrderId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<null | {
    id: string;
    status: string;
    partner: string;
    origin: string;
    destination: string;
    eta: string;
  }>(null);
  const [trackingError, setTrackingError] = useState('');

  // Login simulation state
  const [loginPhone, setLoginPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError('');
    if (!orderId.trim() || !mobileNumber.trim()) {
      setTrackingError('Please enter both your Order ID and Registered Mobile Number.');
      return;
    }

    // Simulate verified tracking result
    setTrackingResult({
      id: orderId.toUpperCase().trim(),
      status: 'In Transit — Dispatched via Air Express',
      partner: 'BlueDart / Delhivery Pan-India Express',
      origin: 'Canvas India Production Facility, Hyderabad (500076)',
      destination: `Customer Delivery Address (${mobileNumber.slice(-4)}XXXX)`,
      eta: 'Expected Delivery in 2 - 3 Business Days',
    });
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPhone.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length >= 4) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto font-manrope">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Header */}
        <div className="bg-[#0E4A93] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#E8752A]" />
            <h3 className="font-bold text-base">Canvas India Customer Portal</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-white hover:bg-white/10 rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'track'
                ? 'bg-white text-[#0E4A93] border-b-2 border-[#0E4A93]'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Track Your Order</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-[#0E4A93] border-b-2 border-[#0E4A93]'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Sign In / My Account</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {activeTab === 'track' ? (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Track your shipment across 19,000+ Indian PIN codes. Enter your Order ID received via WhatsApp / SMS.
              </p>

              <form onSubmit={handleTrackSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Order ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. CI-84920"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg outline-none focus:border-[#0E4A93]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Registered Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g. 98765 43210"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg outline-none focus:border-[#0E4A93]"
                  />
                </div>

                {trackingError && (
                  <div className="text-xs text-rose-600 font-semibold">{trackingError}</div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  <span>Track Shipment Status</span>
                </button>
              </form>

              {/* Tracking Result Display */}
              {trackingResult && (
                <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2.5 text-xs text-stone-800">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Order {trackingResult.id} Verified</span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div><strong>Status:</strong> <span className="text-[#0E4A93] font-semibold">{trackingResult.status}</span></div>
                    <div><strong>Courier:</strong> {trackingResult.partner}</div>
                    <div><strong>Origin:</strong> {trackingResult.origin}</div>
                    <div><strong>ETA:</strong> <span className="font-bold text-emerald-800">{trackingResult.eta}</span></div>
                  </div>

                  <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">Need immediate update?</span>
                    <a
                      href={`https://wa.me/917893051555?text=Hi%20Canvas%20India%2C%20please%20update%20me%20on%20Order%20${trackingResult.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0E4A93] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>WhatsApp Support →</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {isLoggedIn ? (
                <div className="space-y-3 py-4 text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">Welcome Back!</h4>
                  <p className="text-xs text-stone-500">
                    Logged in as <strong>+91 {loginPhone}</strong>
                  </p>
                  <div className="p-3 bg-stone-50 rounded-lg text-xs text-left text-stone-600 space-y-1">
                    <div>• 1 Saved Delivery Address in Hyderabad</div>
                    <div>• Quick Reorder Enabled for Custom Canvas</div>
                    <div>• GST Invoice Download Available</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsLoggedIn(false); setOtpSent(false); }}
                    className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : !otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <p className="text-xs text-stone-600">
                    Login or create an account with your 10-digit mobile number for fast checkout, saved designs, and invoices.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-xs bg-stone-100 border border-r-0 border-stone-300 rounded-l-lg text-stone-600 font-semibold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="78930 51555"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-r-lg outline-none focus:border-[#0E4A93]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#E8752A] hover:bg-[#d0641e] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Send OTP Verification</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <p className="text-xs text-stone-600">
                    Enter the 4-digit code sent to <strong>+91 {loginPhone}</strong>
                  </p>

                  <div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      placeholder="Enter 4-digit OTP (e.g. 1234)"
                      className="w-full text-center tracking-widest text-base font-bold py-2 border border-stone-300 rounded-lg outline-none focus:border-[#0E4A93]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Verify &amp; Continue</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    Change Number
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Support Footer */}
          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Canvas India Verified Portal</span>
            </div>
            <a
              href="https://wa.me/917893051555"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AccountModal;
