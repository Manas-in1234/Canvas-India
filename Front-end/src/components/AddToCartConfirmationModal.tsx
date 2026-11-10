import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, X, ShoppingCart, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AddToCartConfirmationModal: React.FC = () => {
  const navigate = useNavigate();
  const { addToCartConfirmation, closeAddToCartConfirmation, setCartDrawerOpen } = useShop();

  const { isOpen, item } = addToCartConfirmation;

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAddToCartConfirmation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAddToCartConfirmation]);

  if (!isOpen || !item) return null;

  const product = item.product;
  const isAcrylic =
    (item.material && item.material.toLowerCase().includes('acrylic')) ||
    (product.categorySlug === 'acrylic') ||
    (product.category && product.category.toLowerCase().includes('acrylic'));
  const materialType = isAcrylic ? 'acrylic' : 'canvas';
  const targetId = product.slug || product.id;

  const unitPrice = product.price || 0;
  const totalPrice = unitPrice * item.quantity;
  const thumbnail = item.photoUrl || product.image;

  const handleViewCart = () => {
    closeAddToCartConfirmation();
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    closeAddToCartConfirmation();
  };

  const handleCustomizeThisItem = () => {
    closeAddToCartConfirmation();
    const params = new URLSearchParams();
    if (item.size) params.set('size', item.size);
    if (item.thickness) params.set('thickness', item.thickness);
    if (item.finish) params.set('finish', item.finish);
    if (item.base) params.set('base', item.base);
    if (item.style) params.set('style', item.style);
    if (item.quantity) params.set('qty', item.quantity.toString());

    // Retain custom thickness mm if present
    if (item.customizationDetails?.customThicknessMm) {
      params.set('customMm', item.customizationDetails.customThicknessMm.toString());
    }

    navigate(`/customize/${materialType}/${targetId}?${params.toString()}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-to-cart-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={handleContinueShopping}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 id="add-to-cart-title" className="text-sm sm:text-base font-extrabold tracking-tight">
                Item Added to Cart!
              </h3>
              <p className="text-[11px] text-emerald-100 font-medium">
                Your print configuration has been saved.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAddToCartConfirmation}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Details Section */}
        <div className="p-5 space-y-4">
          <div className="flex gap-4 items-start p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
            {/* Thumbnail */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0 flex items-center justify-center">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt={product.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs">
                  No preview
                </div>
              )}
              <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-[#0E4A93] text-white px-1.5 py-0.5 rounded uppercase">
                {materialType}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="font-extrabold text-sm sm:text-base text-stone-900 line-clamp-1">
                {product.name}
              </h4>

              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg font-black text-[#0E4A93]">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                {item.quantity > 1 && (
                  <span className="text-xs text-stone-500 font-semibold">
                    (₹{unitPrice.toLocaleString('en-IN')} each × {item.quantity})
                  </span>
                )}
              </div>

              {/* Specs Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                {item.size && (
                  <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700 font-semibold">
                    Size: <strong>{item.size}</strong>
                  </span>
                )}
                {item.thickness && (
                  <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700 font-semibold">
                    Depth: <strong>{item.thickness}</strong>
                  </span>
                )}
                {item.finish && (
                  <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700 font-semibold">
                    Finish: <strong>{item.finish}</strong>
                  </span>
                )}
                {item.base && (
                  <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700 font-semibold">
                    Hardware: <strong>{item.base}</strong>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[#0E4A93] font-bold">
                  Qty: {item.quantity}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. View Cart */}
              <button
                type="button"
                onClick={handleViewCart}
                className="w-full py-3 px-4 rounded-xl bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>View Cart</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {/* 2. Customize This Item */}
              <button
                type="button"
                onClick={handleCustomizeThisItem}
                className="w-full py-3 px-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#E8752A] border-2 border-orange-200 hover:border-orange-300 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E8752A]" />
                <span>Customize This Item</span>
              </button>
            </div>

            {/* 3. Continue Shopping */}
            <button
              type="button"
              onClick={handleContinueShopping}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-semibold text-xs transition-colors cursor-pointer text-center"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartConfirmationModal;
