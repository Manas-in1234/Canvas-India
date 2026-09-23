import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { Order } from '../types/auth';
import {
  CheckCircle,
  Package,
  MapPin,
  Calendar,
  ArrowRight,
  Printer,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#002B49] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Finalizing order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Celebration Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="inline-block px-3 py-1 bg-green-50 text-green-800 text-xs font-bold uppercase tracking-wider rounded-full mb-2">
            Payment & Order Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-[#002B49]">
            Thank You for Your Order!
          </h1>

          <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
            We have received your order and custom artwork. Our master craftspeople will begin precision printing and framing right away.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700">
            <div>
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Order Number</span>
              <span className="font-mono font-bold text-[#002B49] text-sm">
                {order?.order_number || orderId}
              </span>
            </div>
            <div className="border-l border-gray-300 pl-6">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Estimated Dispatch</span>
              <span className="font-bold text-gray-900 text-sm">Within 24 - 48 Hours</span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        {order && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#002B49] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#002B49]" />
                Purchased Prints ({order.items?.length || 0})
              </h2>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Confirmation
              </button>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                      <Package className="w-7 h-7" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}
                    </p>
                    {item.customization_details && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.customization_details.shapeName && (
                          <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                            Shape: {item.customization_details.shapeName}
                          </span>
                        )}
                        {item.customization_details.dimensions && (
                          <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                            Size: {item.customization_details.dimensions}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-bold text-[#002B49]">
                    ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Address and Charges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Delivery Address
                </span>
                <div className="text-xs text-gray-700 leading-relaxed">
                  <p className="font-bold text-gray-900">{order.shipping_address?.name}</p>
                  <p>{order.shipping_address?.street_address}</p>
                  {order.shipping_address?.apartment && <p>{order.shipping_address.apartment}</p>}
                  <p>
                    {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.postal_code}
                  </p>
                  <p className="mt-1 font-medium text-gray-900">Phone: +91 {order.shipping_address?.phone}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Payment Summary
                </span>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-₹{Number(order.discount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{Number(order.shipping_fee) === 0 ? 'FREE' : `₹${order.shipping_fee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{Number(order.tax).toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-[#002B49]">
                  <span>Total Paid</span>
                  <span>₹{Number(order.total).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={order ? `/orders/${order.id}` : '/account'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#002B49] text-white text-xs font-semibold rounded-xl hover:bg-[#001f35] transition shadow-sm"
          >
            <span>Track Order Status</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-800 text-xs font-semibold rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#002B49]" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
