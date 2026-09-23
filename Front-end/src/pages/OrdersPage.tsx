import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { Order } from '../types/auth';
import { Package, ArrowRight, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const list = await orderService.getUserOrders(user?.id);
        setOrders(list);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:underline">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/account" className="hover:underline">Account</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-semibold">Orders</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#002B49]">My Orders</h1>
            <p className="text-xs text-gray-500 mt-1">
              Track active shipments, view past purchases, and review custom prints.
            </p>
          </div>
          <Link
            to="/account"
            className="text-xs font-semibold text-[#002B49] bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm w-fit"
          >
            ← Back to Account Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-8 h-8 border-4 border-[#002B49] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-3 text-sm text-gray-500">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900">No Orders Found</h2>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              You haven't placed any orders with Canvas India yet. Start creating your custom Acrylic or Canvas prints today!
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/acrylic-prints"
                className="px-5 py-2.5 bg-[#002B49] text-white text-xs font-semibold rounded-lg hover:bg-[#001f35] transition shadow"
              >
                Browse Acrylic Prints
              </Link>
              <Link
                to="/canvas-prints"
                className="px-5 py-2.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Browse Canvas Prints
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition hover:shadow-md"
              >
                {/* Order Top Bar */}
                <div className="bg-gray-50/70 p-5 sm:px-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Order Placed
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Total Amount
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-[#002B49]">
                        ₹{Number(order.total).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Ship To
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">
                        {order.shipping_address?.name || 'Customer'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs font-mono font-medium text-gray-500">
                      #{order.order_number}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="p-6 divide-y divide-gray-100">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
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
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Quantity: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}
                          </p>
                          {item.customization_details && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {item.customization_details.shapeName && (
                                <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-medium border border-blue-100">
                                  Shape: {item.customization_details.shapeName}
                                </span>
                              )}
                              {item.customization_details.dimensions && (
                                <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                                  Size: {item.customization_details.dimensions}
                                </span>
                              )}
                              {item.customization_details.layoutName && (
                                <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                                  Layout: {item.customization_details.layoutName}
                                </span>
                              )}
                              {item.customization_details.hardwareName && (
                                <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                                  Hardware: {item.customization_details.hardwareName}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer link to detail */}
                <div className="bg-gray-50/50 p-4 px-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    Canvas India Authenticity & Safe Delivery Guaranteed
                  </span>
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002B49] hover:underline"
                  >
                    <span>View Tracking & Full Invoice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
