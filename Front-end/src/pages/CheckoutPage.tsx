import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { Address } from '../types/auth';
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Plus,
  Tag,
  Package,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { user, profile, isConfigured } = useAuth();
  const { cartItems, clearCart } = useShop();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isGuestModeParam = searchParams.get('guest') === 'true';

  // Checkout step: 1 = Details, 2 = Address, 3 = Shipping & Review, 4 = Payment
  const [step, setStep] = useState<number>(user ? 2 : 1);

  // Guest details if not logged in
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestName, setGuestName] = useState('');

  // Addresses
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // New Address Form Fields
  const [shippingName, setShippingName] = useState(profile?.full_name || '');
  const [shippingPhone, setShippingPhone] = useState(profile?.phone || '');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('home');
  const [saveToAccount, setSaveToAccount] = useState(true);

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Payment & Processing state
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Load addresses when user signs in
  useEffect(() => {
    if (user) {
      setLoadingAddresses(true);
      addressService.getAddresses(user.id).then((addrs) => {
        setSavedAddresses(addrs);
        const defaultAddr = addrs.find((a) => a.is_default) || addrs[0];
        if (defaultAddr && defaultAddr.id) {
          setSelectedAddressId(defaultAddr.id);
        } else {
          setSelectedAddressId('new');
        }
        setLoadingAddresses(false);
      }).catch(() => setLoadingAddresses(false));
    }
  }, [user]);

  // Sync profile defaults
  useEffect(() => {
    if (profile) {
      if (!shippingName) setShippingName(profile.full_name || '');
      if (!shippingPhone) setShippingPhone(profile.phone || '');
    }
  }, [profile]);

  // Pricing calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingFee =
    shippingMethod === 'express'
      ? 199
      : subtotal >= 999
      ? 0
      : 99;

  const totalDiscount = couponDiscount;
  const taxableAmount = Math.max(0, subtotal - totalDiscount);
  const tax = Math.round(taxableAmount * 0.18); // 18% GST calculation (displayed clearly)
  const total = taxableAmount + shippingFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();

    if (code === 'CANVAS10') {
      const disc = Math.round(subtotal * 0.10);
      setCouponDiscount(disc);
      setCouponApplied('CANVAS10 (10% OFF applied)');
    } else if (code === 'FIRSTPRINT') {
      const disc = Math.min(250, Math.round(subtotal * 0.15));
      setCouponDiscount(disc);
      setCouponApplied('FIRSTPRINT (₹' + disc + ' OFF applied)');
    } else {
      setCouponError('Invalid coupon code. Try CANVAS10 for 10% off.');
    }
  };

  const getEffectiveShippingAddress = (): Address => {
    if (user && selectedAddressId !== 'new') {
      const saved = savedAddresses.find((a) => a.id === selectedAddressId);
      if (saved) return saved;
    }

    return {
      name: shippingName || guestName,
      phone: shippingPhone || guestPhone,
      street_address: streetAddress,
      apartment,
      city,
      state,
      postal_code: postalCode,
      country: 'India',
      address_type: addressType,
      is_default: false,
    };
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
        alert('Please enter a valid email address.');
        return;
      }
      const cleanPhone = guestPhone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        alert('Please enter a valid 10-digit Indian phone number.');
        return;
      }
      setShippingName(guestName);
      setShippingPhone(cleanPhone);
    }
    setStep(2);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedAddressId === 'new') {
      if (!shippingName.trim()) {
        alert('Please enter recipient full name.');
        return;
      }
      if (shippingPhone.replace(/\D/g, '').length !== 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!streetAddress.trim() || !city.trim() || !state.trim() || postalCode.length !== 6) {
        alert('Please complete all required address fields including 6-digit PIN code.');
        return;
      }

      // Save to Supabase if user is logged in
      if (user && saveToAccount) {
        try {
          const created = await addressService.addAddress(
            {
              name: shippingName,
              phone: shippingPhone,
              street_address: streetAddress,
              apartment,
              city,
              state,
              postal_code: postalCode,
              country: 'India',
              address_type: addressType,
              is_default: savedAddresses.length === 0,
            },
            user.id
          );
          setSavedAddresses((prev) => [created, ...prev]);
          if (created.id) setSelectedAddressId(created.id);
        } catch (err) {
          console.warn('Could not auto-save address:', err);
        }
      }
    }

    setStep(3);
  };

  const handleStartPayment = async () => {
    setPaymentError(null);
    setProcessing(true);

    const address = getEffectiveShippingAddress();

    try {
      // 1. Create order record
      const order = await orderService.createOrder({
        userId: user?.id || null,
        guestEmail: user?.email || guestEmail || null,
        guestPhone: profile?.phone || guestPhone || null,
        items: cartItems.map((ci) => ({
          productId: ci.product.id,
          title: ci.product.name,
          price: ci.product.price,
          quantity: ci.quantity,
          imageUrl: ci.photoUrl || ci.product.image,
          customizationDetails: ci.customizationDetails,
        })),
        subtotal,
        discount: totalDiscount,
        shippingFee,
        tax,
        total,
        shippingAddress: address,
        shippingMethod,
      });

      // 2. Trigger Razorpay Payment
      await paymentService.initiatePayment({
        order,
        prefillName: address.name,
        prefillEmail: user?.email || guestEmail || 'customer@canvasindia.in',
        prefillPhone: address.phone,
        onSuccess: async (razorpayResponse) => {
          try {
            await orderService.recordPayment(order.id, {
              userId: user?.id || null,
              amount: total,
              currency: 'INR',
              status: 'captured',
              razorpayOrderId: razorpayResponse.razorpay_order_id,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature,
            });

            // Clear shopping cart on confirmed transaction
            clearCart();

            // Redirect to success page
            navigate(`/order-success/${order.id}`);
          } catch (recErr) {
            console.error('Error finalizing payment:', recErr);
            navigate(`/order-success/${order.id}`);
          }
        },
        onFailure: async (failErr: any) => {
          setProcessing(false);
          const errorMsg = failErr.description || failErr.message || 'Payment was cancelled or unsuccessful.';
          setPaymentError(errorMsg);

          try {
            await orderService.recordPayment(order.id, {
              userId: user?.id || null,
              amount: total,
              currency: 'INR',
              status: 'failed',
              errorMessage: errorMsg,
            });
          } catch (e) {
            console.warn('Could not record failed payment:', e);
          }
        },
        onDismiss: () => {
          setProcessing(false);
        },
      });
    } catch (err: any) {
      setProcessing(false);
      setPaymentError(err.message || 'An unexpected error occurred while placing your order.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center max-w-md shadow-sm">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#002B49]">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            You don't have any items in your cart to checkout. Customize your artwork or select from our collections.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/acrylic-prints"
              className="px-5 py-2.5 bg-[#002B49] text-white text-xs font-semibold rounded-lg hover:bg-[#001f35] transition"
            >
              Shop Acrylic Prints
            </Link>
            <Link
              to="/canvas-prints"
              className="px-5 py-2.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              Shop Canvas Prints
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Checkout Header & Trust Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Canvas India Express Checkout
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#002B49]">
              Complete Your Order
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="w-4 h-4 text-green-600" />
              256-Bit SSL Encryption
            </span>
            <span className="hidden sm:flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#002B49]" />
              Razorpay Verified Gateway
            </span>
          </div>
        </div>

        {/* Multi-step indicator */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <div
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition ${
                step >= 1 ? 'bg-white border-[#002B49] text-[#002B49] shadow-sm' : 'bg-gray-100 text-gray-400 border-gray-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>1. Customer Info</span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition ${
                step >= 2 ? 'bg-white border-[#002B49] text-[#002B49] shadow-sm' : 'bg-gray-100 text-gray-400 border-gray-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>2. Delivery Address</span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition ${
                step >= 3 ? 'bg-white border-[#002B49] text-[#002B49] shadow-sm' : 'bg-gray-100 text-gray-400 border-gray-200'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>3. Review & Payment</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {paymentError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Payment could not be completed</p>
              <p className="mt-0.5">{paymentError}</p>
              <p className="mt-1 text-[11px] text-red-700">Your cart has been preserved. You can retry with another method.</p>
            </div>
          </div>
        )}

        {/* Main Grid: Forms vs Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Multi-Step Forms */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: CUSTOMER INFO */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#002B49] mb-1">Customer Details</h2>
                <p className="text-xs text-gray-500 mb-6">
                  Enter your contact details for order confirmation and shipment tracking notifications.
                </p>

                {user ? (
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Logged in as:</p>
                      <p className="text-sm font-bold text-[#002B49]">{user.email}</p>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2 bg-[#002B49] text-white text-xs font-semibold rounded-lg hover:bg-[#001f35]"
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-900">Have a Canvas India account?</p>
                        <p className="text-[11px] text-gray-500">Sign in to use your saved addresses and access loyalty benefits.</p>
                      </div>
                      <Link
                        to="/login?redirect=/checkout"
                        className="px-3 py-1.5 bg-[#002B49] text-white text-xs font-semibold rounded-lg hover:bg-[#001f35]"
                      >
                        Sign In
                      </Link>
                    </div>

                    <form onSubmit={handleDetailsSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. Ramesh Verma"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="ramesh@example.com"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number (SMS Updates) *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-gray-500">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder="9876543210"
                            className="w-full pl-12 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-[#002B49] text-white text-xs font-semibold rounded-lg hover:bg-[#001f35] shadow-sm transition"
                      >
                        <span>Continue to Delivery Address</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: DELIVERY ADDRESS */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#002B49]">Delivery Address</h2>
                    <p className="text-xs text-gray-500">Where should we deliver your handcrafted prints?</p>
                  </div>
                  {!user && (
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-[#002B49] hover:underline font-semibold"
                    >
                      ← Edit Contact
                    </button>
                  )}
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  {/* Saved addresses selector for logged-in user */}
                  {user && savedAddresses.length > 0 && (
                    <div className="space-y-3 mb-6">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Select a Saved Address
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id || '')}
                            className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                              selectedAddressId === addr.id
                                ? 'border-[#002B49] ring-2 ring-[#002B49] bg-blue-50/20'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                                  {addr.address_type}
                                </span>
                                {addr.is_default && (
                                  <span className="text-[10px] font-bold text-[#002B49] bg-blue-100 px-1.5 py-0.5 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-gray-900">{addr.name}</p>
                              <p className="text-[11px] text-gray-600 mt-0.5 leading-tight">
                                {addr.street_address}, {addr.city} - {addr.postal_code}
                              </p>
                              <p className="text-[11px] text-gray-500 mt-1">Phone: +91 {addr.phone}</p>
                            </div>
                          </div>
                        ))}

                        <div
                          onClick={() => setSelectedAddressId('new')}
                          className={`p-4 rounded-xl border-2 border-dashed cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold transition ${
                            selectedAddressId === 'new'
                              ? 'border-[#002B49] text-[#002B49] bg-blue-50/20'
                              : 'border-gray-300 text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Deliver to a New Address</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show new address fields if selected or guest */}
                  {(!user || selectedAddressId === 'new') && (
                    <div className="space-y-4 pt-2 border-t border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={shippingName}
                            onChange={(e) => setShippingName(e.target.value)}
                            placeholder="Recipient Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">10-Digit Mobile *</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-gray-500">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={shippingPhone}
                              onChange={(e) => setShippingPhone(e.target.value.replace(/\D/g, ''))}
                              placeholder="9876543210"
                              className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Flat / House No. / Building / Street *</label>
                        <input
                          type="text"
                          required
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          placeholder="House/Plot/Flat number, Building name, Street"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Apartment / Locality / Landmark (Optional)</label>
                        <input
                          type="text"
                          value={apartment}
                          onChange={(e) => setApartment(e.target.value)}
                          placeholder="Opposite Landmark, Floor, etc."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Mumbai, Hyderabad"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
                          <input
                            type="text"
                            required
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="Maharashtra, Telangana"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">PIN Code *</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="400001"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                          />
                        </div>
                      </div>

                      {user && (
                        <div className="pt-2">
                          <label className="inline-flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={saveToAccount}
                              onChange={(e) => setSaveToAccount(e.target.checked)}
                              className="rounded border-gray-300 text-[#002B49] focus:ring-[#002B49]"
                            />
                            Save this address to my account for faster future checkouts
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-gray-600 hover:text-gray-900"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#002B49] text-white text-xs font-semibold rounded-lg hover:bg-[#001f35] shadow-sm transition"
                    >
                      <span>Continue to Review & Shipping</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: SHIPPING METHOD & ORDER REVIEW */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Shipping Method Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#002B49]">Shipping Method</h2>
                    <button
                      onClick={() => setStep(2)}
                      className="text-xs text-[#002B49] hover:underline font-semibold"
                    >
                      Change Address
                    </button>
                  </div>

                  {/* Destination summary badge */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 mb-4 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#002B49] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-900">{getEffectiveShippingAddress().name}</span>,{' '}
                      {getEffectiveShippingAddress().street_address}, {getEffectiveShippingAddress().city},{' '}
                      {getEffectiveShippingAddress().state} - {getEffectiveShippingAddress().postal_code}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label
                      onClick={() => setShippingMethod('standard')}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                        shippingMethod === 'standard'
                          ? 'border-[#002B49] ring-2 ring-[#002B49] bg-blue-50/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_method"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="text-[#002B49] focus:ring-[#002B49]"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Standard Delivery (4 - 7 Business Days)</p>
                          <p className="text-[11px] text-gray-500">Secure surface transport with bubble & foam corner packaging</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#002B49]">
                        {subtotal >= 999 ? 'FREE' : '₹99'}
                      </span>
                    </label>

                    <label
                      onClick={() => setShippingMethod('express')}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                        shippingMethod === 'express'
                          ? 'border-[#002B49] ring-2 ring-[#002B49] bg-blue-50/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_method"
                          checked={shippingMethod === 'express'}
                          onChange={() => setShippingMethod('express')}
                          className="text-[#002B49] focus:ring-[#002B49]"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Priority Express Air Cargo (2 - 3 Business Days)</p>
                          <p className="text-[11px] text-gray-500">Fastest courier dispatch with priority manufacturing queue</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#002B49]">₹199</span>
                    </label>
                  </div>
                </div>

                {/* Razorpay Gateway Call-To-Action Box */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#002B49]">Payment Gateway</h2>
                    <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                      Razorpay Live Verified
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                    By clicking <strong>Pay Securely with Razorpay</strong>, the official Razorpay payment modal will launch, allowing payment via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Wallets.
                  </p>

                  <button
                    onClick={handleStartPayment}
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#002B49] hover:bg-[#001f35] text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Initializing Payment Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-green-400" />
                        <span>Pay Securely ₹{total.toLocaleString('en-IN')} with Razorpay</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      100% Secure Transaction
                    </span>
                    <span>•</span>
                    <span>Supports UPI, Cards & Net Banking</span>
                    <span>•</span>
                    <span>Safe Cancellation & Refund Support</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Promo Code */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
              <h3 className="text-base font-bold text-[#002B49] mb-4">
                Order Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </h3>

              {/* Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 pr-1 mb-6">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                    <img
                      src={item.photoUrl || item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-gray-500">
                        Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}
                      </p>
                      {item.customizationDetails && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.customizationDetails.shapeName && (
                            <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              {item.customizationDetails.shapeName}
                            </span>
                          )}
                          {item.customizationDetails.dimensions && (
                            <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              {item.customizationDetails.dimensions}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#002B49] flex-shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="mb-6 pt-4 border-t border-gray-100">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Have a Coupon / Discount Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter CANVAS10"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs uppercase font-semibold focus:ring-2 focus:ring-[#002B49] outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-800 hover:bg-black text-white text-xs font-semibold rounded-lg transition"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-[11px] text-green-700 font-semibold mt-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {couponApplied}
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 font-medium mt-1.5">
                    {couponError}
                  </p>
                )}
              </form>

              {/* Charges Summary Table */}
              <div className="space-y-2.5 text-xs text-gray-600 pt-4 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Discount</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-700 font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-black text-[#002B49]">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
