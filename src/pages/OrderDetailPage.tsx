import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { Order } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import {
  getReturnInfo,
  requestReturn,
  getLiveOrderStatus,
  cancelOrder,
  mirrorOrderToBackend,
  type ReturnInfo,
  type LiveOrderStatus,
} from '../api/returnsApi';
import {
  Package,
  MapPin,
  CreditCard,
  Printer,
  ChevronRight,
  CheckCircle,
  Truck,
  Clock,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [returnInfo, setReturnInfo] = useState<ReturnInfo | null>(null);
  const [returnItemId, setReturnItemId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnBusy, setReturnBusy] = useState(false);
  const [returnError, setReturnError] = useState<string | null>(null);
  const contactEmail = user?.email || order?.guest_email || null;
  const [live, setLive] = useState<LiveOrderStatus | null>(null);
  const [cancelBusy, setCancelBusy] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const loadLive = async () => {
    if (!order || !contactEmail) return;
    let status = await getLiveOrderStatus(order.order_number, contactEmail).catch(() => null);
    // Orders paid before the store tracked them are added now, so they can be managed too.
    if (status && !status.found && order.payment?.status === 'captured') {
      await mirrorOrderToBackend(order, contactEmail, { razorpayPaymentId: order.payment.razorpay_payment_id });
      status = await getLiveOrderStatus(order.order_number, contactEmail).catch(() => null);
    }
    setLive(status);
  };
  useEffect(() => {
    void loadLive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.order_number, contactEmail]);

  const handleCancel = async () => {
    if (!order || !contactEmail) return;
    if (!window.confirm('Cancel this order? This cannot be undone.')) return;
    setCancelBusy(true);
    setCancelError(null);
    try {
      await cancelOrder(order.order_number, contactEmail);
      await loadLive();
    } catch (err: any) {
      setCancelError(err.message);
    } finally {
      setCancelBusy(false);
    }
  };

  // The store's live status wins over the status saved when the order was placed.
  const shownStatus: string = (() => {
    if (!live?.found) return order?.status ?? 'confirmed';
    if (live.orderStatus === 'CANCELLED') return 'cancelled';
    if (live.shippingStatus === 'DELIVERED') return 'delivered';
    if (['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'READY'].includes(live.shippingStatus ?? '')) return 'shipped';
    if (live.orderStatus === 'PROCESSING') return 'processing';
    return order?.status === 'pending' ? 'pending' : 'confirmed';
  })();

  const loadReturns = async () => {
    if (!order || !contactEmail) return;
    setReturnInfo(await getReturnInfo(order.order_number, contactEmail).catch(() => null));
  };
  useEffect(() => {
    void loadReturns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.order_number, contactEmail]);

  const submitReturn = async () => {
    if (!order || !contactEmail || !returnItemId) return;
    setReturnBusy(true);
    setReturnError(null);
    try {
      await requestReturn(order.order_number, contactEmail, returnItemId, returnReason.trim());
      setReturnItemId(null);
      setReturnReason('');
      await loadReturns();
    } catch (err: any) {
      setReturnError(err.message);
    } finally {
      setReturnBusy(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const found = await orderService.getOrderById(orderId);
        setOrder(found);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#002B49] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center max-w-md shadow-sm">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900">Order Not Found</h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            We couldn't find the requested order. It may belong to another session or account.
          </p>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#002B49] text-white text-xs font-semibold rounded-lg hover:bg-[#001f35] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Order Stepper Stages
  const steps = [
    { key: 'confirmed', label: 'Order Confirmed', desc: 'Payment received' },
    { key: 'processing', label: 'In Production', desc: 'Printing & framing' },
    { key: 'shipped', label: 'Dispatched', desc: 'Handed to courier' },
    { key: 'delivered', label: 'Delivered', desc: 'Arrived at your door' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(shownStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb & Navigation (Hidden in print) */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/account" className="hover:underline">Account</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/orders" className="hover:underline">Orders</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-semibold">{order.order_number}</span>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-4 h-4 text-[#002B49]" />
            Print Tax Invoice
          </button>
        </div>

        {/* Order Header Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Invoice & Tracking
              </span>
              <h1 className="text-2xl font-black text-[#002B49] mt-0.5">
                Order #{order.order_number}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  shownStatus === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : shownStatus === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : shownStatus === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {shownStatus}
              </span>
              <p className="text-xl font-black text-[#002B49] mt-2">
                ₹{Number(order.total).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Stepper (Hidden in print) */}
          <div className="pt-6 print:hidden">
            <div className="grid grid-cols-4 gap-2 text-center relative">
              <div className="absolute top-4 left-1/8 right-1/8 h-1 bg-gray-200 -z-0">
                <div
                  className="h-full bg-[#002B49] transition-all duration-500"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {steps.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                        isPassed
                          ? 'bg-[#002B49] text-white ring-4 ring-blue-50'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>
                    <p
                      className={`mt-2 text-xs font-semibold ${
                        isCurrent ? 'text-[#002B49]' : isPassed ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-gray-500 hidden sm:block">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {!live?.found && shownStatus !== 'cancelled' && (
          <div className="print:hidden rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            <strong>Cancellation policy:</strong> an order can be cancelled until production begins. Once printing and
            framing has started, it can no longer be cancelled. To cancel, contact support.
          </div>
        )}
        {live?.found && shownStatus !== 'cancelled' && (
          <div className="print:hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
            {live.cancellable ? (
              <>
                <p className="text-xs text-gray-600 max-w-md">
                  You can cancel this order until production starts. Once printing and framing begins, it can no longer be cancelled.
                </p>
                <button
                  onClick={handleCancel}
                  disabled={cancelBusy}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-50 disabled:opacity-50"
                >
                  {cancelBusy ? 'Cancelling…' : 'Cancel order'}
                </button>
              </>
            ) : (
              <p className="text-xs text-gray-600">
                This order can no longer be cancelled because production (printing and framing) has started.
              </p>
            )}
            {cancelError && <p className="w-full text-xs text-red-600">{cancelError}</p>}
          </div>
        )}
        {shownStatus === 'cancelled' && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
            This order has been cancelled. If you paid online, contact support about your refund.
          </div>
        )}

        {/* Order Items & Customization Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#002B49] mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#002B49]" />
            Ordered Custom Prints ({order.items?.length || 0})
          </h2>

          <div className="divide-y divide-gray-100">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-col sm:flex-row gap-5">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-gray-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                      <Package className="w-10 h-10" />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Quantity: <span className="font-semibold text-gray-700">{item.quantity}</span>
                        </p>
                      </div>
                      <p className="text-base font-bold text-[#002B49]">
                        ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Detailed Customizer Specs */}
                    {item.customization_details && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                          Manufacturing Specifications
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          {item.customization_details.shapeName && (
                            <div>
                              <span className="text-gray-400 text-[10px] block">Shape</span>
                              <span className="font-medium text-gray-800">{item.customization_details.shapeName}</span>
                            </div>
                          )}
                          {item.customization_details.dimensions && (
                            <div>
                              <span className="text-gray-400 text-[10px] block">Dimensions</span>
                              <span className="font-medium text-gray-800">{item.customization_details.dimensions}</span>
                            </div>
                          )}
                          {item.customization_details.layoutName && (
                            <div>
                              <span className="text-gray-400 text-[10px] block">Layout</span>
                              <span className="font-medium text-gray-800">{item.customization_details.layoutName}</span>
                            </div>
                          )}
                          {item.customization_details.hardwareName && (
                            <div>
                              <span className="text-gray-400 text-[10px] block">Mounting Hardware</span>
                              <span className="font-medium text-gray-800">{item.customization_details.hardwareName}</span>
                            </div>
                          )}
                          {item.customization_details.edgeWrapName && (
                            <div>
                              <span className="text-gray-400 text-[10px] block">Edge Wrap</span>
                              <span className="font-medium text-gray-800">{item.customization_details.edgeWrapName}</span>
                            </div>
                          )}
                          {item.customization_details.frameName && (
                            <div>
                              <span className="text-gray-400 text-[10px] block">Frame</span>
                              <span className="font-medium text-gray-800">{item.customization_details.frameName}</span>
                            </div>
                          )}
                        </div>

                        {/* Custom Text or Clipart */}
                        {item.customization_details.textElements && item.customization_details.textElements.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <span className="text-[10px] text-gray-400 block">Personalized Text Overlays</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item.customization_details.textElements.map((txt: any, tIdx: number) => (
                                <span key={tIdx} className="text-xs bg-white px-2 py-0.5 rounded border border-gray-200 font-medium text-gray-800 italic">
                                  "{txt.text}"
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Returns */}
        {returnInfo?.found && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm print:hidden">
            <h2 className="text-base font-bold text-[#002B49] mb-1">Returns</h2>
            {!returnInfo.delivered && (
              <p className="text-xs text-gray-500 mb-3">You can request a return once your order has been delivered.</p>
            )}
            <div className="divide-y divide-gray-100">
              {returnInfo.items?.map((item) => {
                const existing = returnInfo.returns?.find((r) => r.orderItemId === item.id);
                return (
                  <div key={item.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm text-gray-800">{item.productNameSnapshot}</span>
                    {existing ? (
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                        Return {existing.status.toLowerCase()}
                      </span>
                    ) : returnInfo.delivered ? (
                      <button
                        onClick={() => { setReturnItemId(item.id); setReturnError(null); }}
                        className="px-4 py-1.5 border border-[#002B49] text-[#002B49] rounded-lg text-xs font-semibold hover:bg-gray-50"
                      >
                        Request return
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {returnItemId && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                <label className="text-xs font-semibold text-gray-700 block" htmlFor="return-reason">
                  Why are you returning this item?
                </label>
                <textarea
                  id="return-reason"
                  rows={3}
                  maxLength={2000}
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                />
                {returnError && <p className="text-xs text-red-600">{returnError}</p>}
                <div className="flex gap-2">
                  <button
                    disabled={returnBusy || !returnReason.trim()}
                    onClick={submitReturn}
                    className="px-4 py-2 bg-[#002B49] text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                  >
                    {returnBusy ? 'Submitting…' : 'Submit return request'}
                  </button>
                  <button onClick={() => setReturnItemId(null)} className="px-4 py-2 text-xs text-gray-600">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Shipping & Payment Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[#002B49] uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#002B49]" />
              Shipping Address
            </h2>
            <div className="text-xs text-gray-700 leading-relaxed">
              <p className="font-bold text-sm text-gray-900">{order.shipping_address?.name}</p>
              <p className="mt-1">{order.shipping_address?.street_address}</p>
              {order.shipping_address?.apartment && <p>{order.shipping_address?.apartment}</p>}
              <p>
                {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.postal_code}
              </p>
              <p>India</p>
              <p className="mt-2 font-medium text-gray-900">
                Phone: +91 {order.shipping_address?.phone}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Shipping Method: {order.shipping_method === 'express' ? 'Express Air Delivery (2-3 Days)' : 'Standard Ground Delivery (4-7 Days)'}</span>
            </div>
          </div>

          {/* Payment & Charges Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[#002B49] uppercase tracking-wider mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#002B49]" />
              Payment Summary
            </h2>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Promotional Discount</span>
                  <span>-₹{Number(order.discount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping & Handling</span>
                <span>{Number(order.shipping_fee) === 0 ? <span className="text-green-700 font-semibold">FREE</span> : `₹${order.shipping_fee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% Included)</span>
                <span>₹{Number(order.tax).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-[#002B49]">
                <span>Total Amount Paid</span>
                <span>₹{Number(order.total).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Razorpay confirmation details */}
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-500">
              <div className="flex items-center gap-1.5 text-green-700 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Payment Verified via Razorpay</span>
              </div>
              {order.payment?.razorpay_payment_id && (
                <p>Transaction ID: <span className="font-mono text-gray-700">{order.payment.razorpay_payment_id}</span></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
