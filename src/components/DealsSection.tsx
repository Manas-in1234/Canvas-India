import React from 'react';
import { Tag, ShoppingCart, ArrowRight } from 'lucide-react';
import { DEALS_PRODUCTS } from '../data/storeData';
import { Product } from '../types';

interface DealsSectionProps {
  onAddToCart: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({
  onAddToCart,
  onCustomize,
}) => {
  return (
    <section id="deals-section" className="py-10 sm:py-14 bg-[#FFFDF9] border-b border-stone-200/80">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)]/70 mb-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Great Value Prints</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F243E] tracking-tight">
              Deals &amp; Budget Picks
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md">
            Personalized quality gifts, desktop blocks and photo prints under ₹999.
          </p>
        </div>

        {/* 4 Budget Product Cards - expanding across 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 xl:gap-6">
          {DEALS_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 text-stone-900 flex flex-col justify-between group"
            >
              {/* Product Thumbnail */}
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {prod.badge && (
                  <div className="absolute top-2.5 left-2.5 bg-[#0F243E] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                    {prod.badge}
                  </div>
                )}
                <div className="absolute bottom-2.5 left-2.5 bg-[var(--accent)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {prod.discountPercent}% OFF
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                    {prod.category}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 mt-0.5 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                    {prod.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base sm:text-lg font-black text-stone-900">
                      ₹{prod.price}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      ₹{prod.originalPrice}
                    </span>
                  </div>
                </div>

                {/* Add to Cart button */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => onAddToCart(prod)}
                    className="flex-1 py-2 px-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => onCustomize(prod)}
                    className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg transition-colors"
                    title="Quick Customize"
                  >
                    Custom
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
