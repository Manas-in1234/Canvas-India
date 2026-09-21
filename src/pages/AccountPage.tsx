import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { Address, Order } from '../types/auth';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  ShieldCheck,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const { wishlistIds, allProducts } = useShop();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'orders';

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Address form fields
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrApartment, setAddrApartment] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrType, setAddrType] = useState<'home' | 'work' | 'other'>('home');
  const [addrDefault, setAddrDefault] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile edit state
  const [editName, setEditName] = useState(profile?.full_name || '');
  const [editPhone, setEditPhone] = useState(profile?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name || '');
      setEditPhone(profile.phone || '');
    }
  }, [profile]);

  // Load addresses
  const loadAddresses = async () => {
    if (!user) return;
    setLoadingAddresses(true);
    try {
      const list = await addressService.getAddresses(user.id);
      setAddresses(list);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Load orders
  const loadOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const list = await orderService.getUserOrders(user.id);
      setOrders(list);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAddresses();
      loadOrders();
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSavedMsg(null);

    const { error } = await updateProfile({
      full_name: editName,
      phone: editPhone,
    });

    setSavingProfile(false);
    if (!error) {
      setProfileSavedMsg('Profile updated successfully!');
      setTimeout(() => setProfileSavedMsg(null), 3000);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddrName(profile?.full_name || '');
    setAddrPhone(profile?.phone || '');
    setAddrStreet('');
    setAddrApartment('');
    setAddrCity('');
    setAddrState('');
    setAddrPincode('');
    setAddrType('home');
    setAddrDefault(addresses.length === 0);
    setIsAddingAddress(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddrName(addr.name);
    setAddrPhone(addr.phone);
    setAddrStreet(addr.street_address);
    setAddrApartment(addr.apartment || '');
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPincode(addr.postal_code);
    setAddrType(addr.address_type);
    setAddrDefault(addr.is_default);
    setIsAddingAddress(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingAddress?.id) {
        await addressService.updateAddress(
          editingAddress.id,
          {
            name: addrName,
            phone: addrPhone,
            street_address: addrStreet,
            apartment: addrApartment,
            city: addrCity,
            state: addrState,
            postal_code: addrPincode,
            address_type: addrType,
            is_default: addrDefault,
          },
          user.id
        );
      } else {
        await addressService.addAddress(
          {
            name: addrName,
            phone: addrPhone,
            street_address: addrStreet,
            apartment: addrApartment,
            city: addrCity,
            state: addrState,
            postal_code: addrPincode,
            country: 'India',
            address_type: addrType,
            is_default: addrDefault,
          },
          user.id
        );
      }
      setIsAddingAddress(false);
      setEditingAddress(null);
      loadAddresses();
    } catch (err) {
      console.error('Failed to save address:', err);
      alert('Could not save address. Please try again.');
    }
  };

  const handleDeleteAddress = async (id?: string) => {
    if (!id || !user) return;
    if (confirm('Are you sure you want to delete this address?')) {
      await addressService.deleteAddress(id, user.id);
      loadAddresses();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* User Greeting Hero Header */}
        <div className="bg-[#002B49] rounded-2xl text-white p-6 sm:p-8 shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white text-[#002B49] flex items-center justify-center text-2xl font-bold shadow-md">
                {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {profile?.full_name || 'Valued Customer'}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {user?.email}
                  </span>
                  {profile?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      +91 {profile.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-sm border border-white/20 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Account Dashboard Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              <nav className="divide-y divide-gray-100">
                <button
                  onClick={() => setSearchParams({ tab: 'orders' })}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold transition ${
                    activeTab === 'orders'
                      ? 'bg-blue-50 text-[#002B49] border-l-4 border-[#002B49]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Package className="w-4 h-4" />
                    My Orders
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-bold text-gray-700">
                    {orders.length}
                  </span>
                </button>

                <button
                  onClick={() => setSearchParams({ tab: 'addresses' })}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold transition ${
                    activeTab === 'addresses'
                      ? 'bg-blue-50 text-[#002B49] border-l-4 border-[#002B49]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" />
                    Saved Addresses
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-bold text-gray-700">
                    {addresses.length}
                  </span>
                </button>

                <button
                  onClick={() => setSearchParams({ tab: 'profile' })}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold transition ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-[#002B49] border-l-4 border-[#002B49]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <User className="w-4 h-4" />
                    Profile Details
                  </span>
                </button>

                <button
                  onClick={() => setSearchParams({ tab: 'wishlist' })}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold transition ${
                    activeTab === 'wishlist'
                      ? 'bg-blue-50 text-[#002B49] border-l-4 border-[#002B49]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Heart className="w-4 h-4" />
                    My Wishlist
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-bold text-gray-700">
                    {wishlistIds.length}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {/* TAB: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-[#002B49]">Order History</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Review previous orders, check tracking statuses, and see custom product specifications.
                    </p>
                  </div>
                </div>

                {loadingOrders ? (
                  <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                    <div className="w-8 h-8 border-4 border-[#002B49] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-3 text-sm text-gray-500">Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-900">No orders found yet</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      Explore our Acrylic Prints or Canvas collections and personalize your walls today.
                    </p>
                    <Link
                      to="/acrylic-prints"
                      className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#002B49] text-white text-xs font-semibold rounded-lg hover:bg-[#001f35] transition"
                    >
                      Browse Acrylic Prints
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        {/* Order Header */}
                        <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-[11px] text-gray-500 uppercase font-semibold">Order</span>
                              <p className="text-sm font-bold text-gray-900">{order.order_number}</p>
                            </div>
                            <div className="border-l border-gray-300 pl-4">
                              <span className="text-[11px] text-gray-500 uppercase font-semibold">Placed On</span>
                              <p className="text-sm text-gray-700">
                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="text-base font-bold text-[#002B49]">
                              ₹{Number(order.total).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="p-6 divide-y divide-gray-100">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                                  />
                                ) : (
                                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                    <Package className="w-6 h-6" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                  <p className="text-xs text-gray-500">
                                    Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}
                                  </p>
                                  {item.customization_details && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {item.customization_details.shapeName && (
                                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                          Shape: {item.customization_details.shapeName}
                                        </span>
                                      )}
                                      {item.customization_details.dimensions && (
                                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                          Size: {item.customization_details.dimensions}
                                        </span>
                                      )}
                                      {item.customization_details.layoutName && (
                                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                          Layout: {item.customization_details.layoutName}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions */}
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-end">
                          <Link
                            to={`/orders/${order.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#002B49] hover:underline"
                          >
                            <span>View Order Details & Tracking</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-[#002B49]">Delivery Addresses</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Manage your saved shipping addresses for fast and seamless 1-click checkout.
                    </p>
                  </div>
                  {!isAddingAddress && (
                    <button
                      onClick={handleOpenAddAddress}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#002B49] text-white text-xs font-semibold rounded-lg hover:bg-[#001f35] transition shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Address
                    </button>
                  )}
                </div>

                {/* Add / Edit Address Form */}
                {isAddingAddress && (
                  <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-md">
                    <h3 className="text-base font-bold text-[#002B49] mb-4">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <form onSubmit={handleSaveAddress} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Contact Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={addrName}
                            onChange={(e) => setAddrName(e.target.value)}
                            placeholder="Recipient Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            10-Digit Mobile *
                          </label>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={addrPhone}
                            onChange={(e) => setAddrPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder="9876543210"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Street Address / Flat / Building *
                        </label>
                        <input
                          type="text"
                          required
                          value={addrStreet}
                          onChange={(e) => setAddrStreet(e.target.value)}
                          placeholder="House/Flat No., Building, Street Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Locality / Landmark / Area (Optional)
                        </label>
                        <input
                          type="text"
                          value={addrApartment}
                          onChange={(e) => setAddrApartment(e.target.value)}
                          placeholder="Near City Center / Landmark"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={addrCity}
                            onChange={(e) => setAddrCity(e.target.value)}
                            placeholder="Mumbai, Bangalore, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            required
                            value={addrState}
                            onChange={(e) => setAddrState(e.target.value)}
                            placeholder="State"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            PIN Code *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={addrPincode}
                            onChange={(e) => setAddrPincode(e.target.value.replace(/\D/g, ''))}
                            placeholder="560001"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-4">
                          <label className="text-xs font-semibold text-gray-700">Type:</label>
                          {(['home', 'work', 'other'] as const).map((type) => (
                            <label key={type} className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer capitalize">
                              <input
                                type="radio"
                                name="address_type"
                                value={type}
                                checked={addrType === type}
                                onChange={() => setAddrType(type)}
                                className="text-[#002B49] focus:ring-[#002B49]"
                              />
                              {type}
                            </label>
                          ))}
                        </div>

                        <label className="inline-flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={addrDefault}
                            onChange={(e) => setAddrDefault(e.target.checked)}
                            className="rounded border-gray-300 text-[#002B49] focus:ring-[#002B49]"
                          />
                          Make default delivery address
                        </label>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingAddress(false);
                            setEditingAddress(null);
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#002B49] text-white text-xs font-semibold rounded-lg hover:bg-[#001f35] transition shadow-sm"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Addresses Grid */}
                {loadingAddresses ? (
                  <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                    <div className="w-8 h-8 border-4 border-[#002B49] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-3 text-sm text-gray-500">Loading addresses...</p>
                  </div>
                ) : addresses.length === 0 && !isAddingAddress ? (
                  <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-900">No saved addresses</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Add your home or office address to accelerate future orders.
                    </p>
                    <button
                      onClick={handleOpenAddAddress}
                      className="mt-4 px-4 py-2 bg-[#002B49] text-white text-xs font-semibold rounded-lg hover:bg-[#001f35] transition inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`bg-white p-5 rounded-xl border relative shadow-sm flex flex-col justify-between ${
                          addr.is_default ? 'border-[#002B49] ring-1 ring-[#002B49]' : 'border-gray-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                              {addr.address_type}
                            </span>
                            {addr.is_default && (
                              <span className="text-[11px] font-semibold text-[#002B49] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                Default
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-gray-900">{addr.name}</h4>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {addr.street_address}
                            {addr.apartment && <>, {addr.apartment}</>}
                            <br />
                            {addr.city}, {addr.state} - {addr.postal_code}
                            <br />
                            India
                          </p>
                          <p className="text-xs text-gray-700 font-medium mt-2">
                            Phone: +91 {addr.phone}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <button
                            onClick={() => handleOpenEditAddress(addr)}
                            className="inline-flex items-center gap-1 text-xs text-[#002B49] font-semibold hover:underline"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="inline-flex items-center gap-1 text-xs text-red-600 font-semibold hover:underline"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h2 className="text-xl font-bold text-[#002B49]">Personal Profile</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Update your account details and contact information.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  {profileSavedMsg && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      {profileSavedMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-5 max-w-lg">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-[11px] text-gray-500 mt-1">Email is associated with your authentication login.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                        Primary Mobile Number
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 font-semibold text-xs">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full pl-12 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="px-6 py-2.5 bg-[#002B49] text-white text-xs font-semibold rounded-lg hover:bg-[#001f35] transition shadow-sm disabled:opacity-50"
                      >
                        {savingProfile ? 'Saving Changes...' : 'Save Profile Details'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-[#002B49]">My Wishlist</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Designs and art prints you have saved for later.
                    </p>
                  </div>
                  <Link
                    to="/wishlist"
                    className="text-xs font-semibold text-[#002B49] hover:underline inline-flex items-center gap-1"
                  >
                    Open Full Wishlist <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-900">Your wishlist is empty</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Heart items from our product collections to save them here.
                    </p>
                    <Link
                      to="/acrylic-prints"
                      className="mt-4 px-4 py-2 bg-[#002B49] text-white text-xs font-semibold rounded-lg hover:bg-[#001f35] transition inline-flex items-center gap-1.5"
                    >
                      Explore Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{prod.name}</h4>
                          <p className="text-xs font-bold text-[#002B49] mt-1">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <Link
                            to={`/product/${prod.id}`}
                            className="text-xs font-semibold text-[#002B49] hover:underline"
                          >
                            View Product
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
