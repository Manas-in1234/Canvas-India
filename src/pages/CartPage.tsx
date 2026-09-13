import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  ChevronRight,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from '../components/ProductImage';

export const CartPage: React.FC = () => {
  const {
    cartItems,
    onUpdateCartQuantity,
    onRemoveCartItem,
    totalCartCount,
  } = useShop();

  useEffect(() => {
    document.title = 'Shopping Cart | Canvas India';
    window.scrollTo(0, 0);
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeDeliveryThreshold = 999;
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryCharges = subtotal >= freeDeliveryThreshold ? 0 : 99;
  const finalTotal = subtotal + deliveryCharges;

  const [checkoutModalOpen, setCheckoutModalOpen] = React.useState(false);

  const handleCheckout = () => {
    setCheckoutModalOpen(true);
  };

  return (
    <div className="w-full bg-[#FFFDF9] py-8 sm:py-12 text-stone-900 font-manrope min-h-[70vh]">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-stone-900">Shopping Cart</span>
        </nav>

        {/* Header */}
        <div className="pb-6 border-b border-stone-200">
          <h1 
            className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
          >
            Shopping Cart ({totalCartCount} {totalCartCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <ShoppingBag className="w-10 h-10 stroke-1" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Your cart is empty</h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Explore our custom canvas, clear acrylic prints, natural cork boards and yoga mats to create your personalized order.
            </p>
            <div className="pt-2">
              <Link
                to="/canvas"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold text-xs rounded-lg shadow-sm transition-all"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart Items (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Free Delivery Bar */}
              <div className="p-4 bg-orange-50 border border-orange-200/80 rounded-xl text-xs text-stone-700">
                {remainingForFreeDelivery > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-[#E8752A]" />
                        <span>Add <strong>₹{remainingForFreeDelivery}</strong> more to get FREE Pan-India Delivery!</span>
                      </span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#E8752A] transition-all duration-300 rounded-full" 
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>You have unlocked FREE Delivery across 19,000+ Indian PIN Codes!</span>
                  </div>
                )}
              </div>

              {/* Items Table / Cards */}
              <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 shadow-2xs overflow-hidden">
                {cartItems.map((item, idx) => {
                  const itemIdentifier = item.id || `${item.product.id}-${idx}`;
                  const itemTotal = item.product.price * item.quantity;
                  return (
                    <div key={itemIdentifier} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Link 
                          to={`/products/${item.product.id}`}
                          className="w-20 h-20 rounded-lg overflow-hidden border border-stone-200 bg-stone-50 shrink-0 block"
                        >
                          <ProductImage
                            src={item.photoUrl || item.uploadedPhotoUrl || item.product.image}
                            alt={item.product.name}
                            categorySlug={item.product.categorySlug}
                            className="w-full h-full object-cover"
                          />
                        </Link>

                        <div className="space-y-1 min-w-0">
                          <Link 
                            to={`/products/${item.product.id}`}
                            className="font-bold text-sm text-stone-900 hover:text-[#0E4A93] transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-xs text-stone-500">
                            <span>Size: <strong>{item.size || 'Standard'}</strong></span>
                            {item.finish && <span className="ml-2">• Finish: <strong>{item.finish}</strong></span>}
                          </div>
                          {item.customText && (
                            <div className="text-xs text-[#E8752A] italic">
                              Custom Text: "{item.customText}"
                            </div>
                          )}
                          <div className="text-xs font-semibold text-stone-700">
                            Unit Price: ₹{item.product.price.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                        {/* Quantity */}
                        <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                          <button
                            onClick={() => onUpdateCartQuantity(itemIdentifier, Math.max(1, item.quantity - 1))}
                            className="p-1.5 text-stone-500 hover:text-stone-800 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateCartQuantity(itemIdentifier, item.quantity + 1)}
                            className="p-1.5 text-stone-500 hover:text-stone-800 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-[80px]">
                          <div className="font-extrabold text-sm sm:text-base text-stone-900">
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => onRemoveCartItem(itemIdentifier)}
                          className="p-2 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-2 flex justify-between items-center text-xs">
                <Link to="/canvas" className="font-bold text-[#0E4A93] hover:underline flex items-center gap-1">
                  <span>← Continue Shopping</span>
                </Link>
                <div className="flex items-center gap-1.5 text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>GST Invoice with 18% Input Credit</span>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
              <h2 className="font-bold text-base text-stone-900 pb-3 border-b border-stone-200">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Estimated Delivery Charges</span>
                  <span className="font-bold text-emerald-700">
                    {deliveryCharges === 0 ? 'FREE' : '₹99'}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Applicable GST (Included)</span>
                  <span className="font-semibold text-stone-500">18% included</span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-extrabold text-stone-900">
                  <span>Total Amount</span>
                  <span className="text-[#0E4A93]">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3.5 bg-[#E8752A] hover:bg-[#d0641e] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0E4A93] shrink-0" />
                  <span>256-Bit SSL Encrypted Safe Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#0E4A93] shrink-0" />
                  <span>Transit Damage Insurance Guarantee</span>
                </div>
              </div>

              {/* Need help via WhatsApp */}
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900">Need help ordering?</div>
                  <div className="text-[11px] text-stone-500">Chat with production specialist</div>
                </div>
                <a
                  href="https://wa.me/917893051555?text=Hi%20Canvas%20India%2C%20I%20need%20help%20with%20my%20cart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  title="WhatsApp Help"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Seamless Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-100 text-center relative">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Secure Gateway Initiated</h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Redirecting to encrypted 256-bit payment gateway (UPI, Cards, Net Banking) for total amount of <span className="font-bold text-stone-900">₹{finalTotal.toLocaleString('en-IN')}</span>. All prints include 100% damage protection.
            </p>
            <div className="bg-stone-50 rounded-xl p-3 text-left text-xs space-y-1 mb-5 border border-stone-100">
              <div className="flex justify-between text-stone-500">
                <span>Items:</span>
                <span className="font-medium text-stone-800">{totalCartCount}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Total Payable:</span>
                <span className="font-bold text-[#0E4A93]">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Dispatch:</span>
                <span className="font-medium text-emerald-600">24-48 Hours from Hyderabad</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
              <a
                href="https://wa.me/917893051555?text=Hello%20Canvas%20India%2C%20I%20would%20like%20to%20place%20my%20order%20directly."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pay via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
