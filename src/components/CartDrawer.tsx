import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck, ExternalLink } from 'lucide-react';
import { CartItem } from '../types';
import { ProductImage } from './ProductImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeDeliveryThreshold = 999;
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-manrope">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 bg-[#0E4A93] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E8752A]" />
              <h2 className="font-bold text-base">Your Shopping Cart</h2>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-md transition-colors text-white"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-3 bg-orange-50 border-b border-orange-100 text-xs text-stone-700">
            {remainingForFreeDelivery > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span>Add <strong>₹{remainingForFreeDelivery}</strong> more for Free Delivery!</span>
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
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Congratulations! You qualify for FREE Delivery across India</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-stone-400 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 stroke-1" />
                <div className="font-bold text-base text-stone-600">Your cart is empty</div>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Browse through canvas, acrylic and cork prints to start adding personalized items.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-[#E8752A] text-white text-xs font-bold rounded-lg mt-2 cursor-pointer shadow-sm hover:bg-[#d0641e] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item, idx) => {
                const itemIdentifier = item.id || `${item.product.id}-${idx}`;
                return (
                  <div key={itemIdentifier} className="py-3 flex gap-3 items-start">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-50">
                      <ProductImage
                        src={item.photoUrl || item.uploadedPhotoUrl || item.product.image}
                        alt={item.product.name}
                        categorySlug={item.product.categorySlug}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-stone-900 truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {item.size || 'Standard Size'} {item.finish && `• ${item.finish}`}
                      </div>
                      {(item.thickness || item.style || item.base || item.paper) && (
                        <div className="text-[10px] text-stone-500 flex flex-wrap gap-1 mt-0.5">
                          {item.thickness && <span>{item.thickness}</span>}
                          {item.style && <span>• {item.style}</span>}
                          {item.base && <span>• {item.base}</span>}
                          {item.paper && <span>• {item.paper}</span>}
                        </div>
                      )}
                      {item.customText && (
                        <div className="text-[10px] text-[#E8752A] italic truncate">
                          "{item.customText}"
                        </div>
                      )}
                      <div className="font-black text-xs text-stone-900 mt-1">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                          <button
                            onClick={() => onUpdateQuantity(itemIdentifier, Math.max(1, item.quantity - 1))}
                            className="p-1 text-stone-500 hover:text-stone-800 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(itemIdentifier, item.quantity + 1)}
                            className="p-1 text-stone-500 hover:text-stone-800 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(itemIdentifier)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-emerald-700">
                    {subtotal >= freeDeliveryThreshold ? 'FREE' : '₹99'}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-black text-stone-900">
                  <span>Total Amount</span>
                  <span className="text-[#0E4A93]">
                    ₹{(subtotal + (subtotal >= freeDeliveryThreshold ? 0 : 99)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="py-2.5 px-3 border border-stone-300 hover:border-[#0E4A93] bg-white text-stone-800 text-xs font-bold rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Full Cart</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={onCheckout}
                  className="py-2.5 px-3 bg-[#E8752A] hover:bg-[#d0641e] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0E4A93]" />
                <span>Safe 256-Bit SSL Encrypted Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
