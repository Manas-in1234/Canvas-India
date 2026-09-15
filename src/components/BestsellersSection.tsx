import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface BestsellersSectionProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onCustomize: (product: Product) => void;
  onViewAll: () => void;
  variant?: 'marketplace' | 'print-store' | 'modern';
}

export const BestsellersSection: React.FC<BestsellersSectionProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onCustomize,
  onViewAll,
  variant = 'marketplace',
}) => {
  // Take top 6 bestselling products
  const bestsellers = products.slice(0, 6);

  return (
    <section id="bestsellers-section" className="py-8 sm:py-12 bg-white border-b border-stone-100">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Section Header */}
        <div className="flex items-end justify-between gap-3 mb-6">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Bestselling Products
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Top rated custom prints handcrafted for Indian living rooms and workspaces
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAll}
            className="text-xs sm:text-sm font-semibold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Clean Unboxed Products in 6-column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onCustomize={onCustomize}
              variant={variant}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
