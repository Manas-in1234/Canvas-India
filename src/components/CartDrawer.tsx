import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 bg-[#0F243E] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E85D04]" />
              <h2 className="font-bold text-base">Your Shopping Cart</h2>
              <span className="text-xs bg-white/15 text-white px-2 py-0.5 rounded-full font-bold">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/10 rounded-md transition-colors"
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
                    className="h-full bg-[#E85D04] transition-all duration-300 rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Truck className="w-4 h-4" />
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
                  className="px-5 py-2 bg-[#E85D04] text-white text-xs font-bold rounded-lg mt-2"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.product.id} className="py-3 flex gap-3 items-start">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-stone-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-stone-900 truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {item.size || 'Standard Size'} {item.finish && `• ${item.finish}`}
                    </div>
                    {item.customText && (
                      <div className="text-[10px] text-orange-600 italic truncate">
                        "{item.customText}"
                      </div>
                    )}
                    <div className="font-black text-xs text-stone-900 mt-1">
                      ₹{item.product.price}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="p-1 text-stone-500 hover:text-stone-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-stone-500 hover:text-stone-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
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
                  <span className="text-[#E85D04]">
                    ₹{(subtotal + (subtotal >= freeDeliveryThreshold ? 0 : 99)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-3 bg-[#E85D04] hover:bg-[#D44E00] text-white font-bold text-sm rounded-lg shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Safe 256-Bit SSL Encrypted Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
