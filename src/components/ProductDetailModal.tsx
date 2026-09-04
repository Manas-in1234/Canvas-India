import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, Shield, Clock, ArrowRight, Ruler, CheckCircle2 } from 'lucide-react';
import { ProductItem } from '../data/brandData';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem) => void;
  onOpenQuote: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenQuote,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState('24" × 18"');
  const [selectedFinish, setSelectedFinish] = useState('Archival Standard');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const availableSizes = ['12" × 8"', '16" × 12"', '24" × 18"', '36" × 24"', '48" × 36"', 'Bespoke Custom'];
  const finishOptions = ['Archival Standard', 'Hand-Stained Floater Frame', 'Optical Gloss Coat', 'Acoustic Core Mount'];

  const handleAdd = () => {
    const configuredProduct: ProductItem = {
      ...product,
      id: `${product.id}-${Date.now()}`,
      name: `${product.name} (${selectedSize})`,
      tagline: `${selectedFinish} • ${selectedSize}`,
      startingPrice: product.startingPrice,
    };
    onAddToCart(configuredProduct);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 z-10 flex flex-col md:flex-row my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 relative bg-stone-100 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full min-h-[300px] max-h-[460px] object-cover object-center"
          />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-stone-900 shadow-xs border border-white">
            {product.category} Edition
          </div>
        </div>

        {/* Right: Specifications & Configuration */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span className="font-bold text-stone-900 text-sm">{product.rating || 4.9}</span>
              <span className="text-stone-400 text-xs">•</span>
              <span className="text-xs text-stone-500">{product.reviewCount || 248} verified reviews</span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                {product.name}
              </h2>
              <p className="text-xs text-orange-600 font-semibold mt-1">
                {product.tagline}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Specs List */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Technical Specifications:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Select Dimension
                </span>
                <span className="text-[10px] text-stone-400">Custom available</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      selectedSize === size
                        ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Finish Selector */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">
                Finish & Mounting
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {finishOptions.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFinish(f)}
                    className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                      selectedFinish === f
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Price & Add */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-stone-500 block">Unit Price:</span>
                <span className="text-2xl font-extrabold text-stone-900">
                  {product.startingPrice}
                </span>
              </div>
              <div className="text-right text-xs text-stone-500">
                <span>Lead time: {product.leadTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Order Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenQuote();
                }}
                className="px-4 py-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold text-xs transition-colors"
              >
                Custom Inquiries
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
