import React, { useState } from 'react';
import { Sparkles, Flame } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface TrendingProductsProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

export const TrendingProducts: React.FC<TrendingProductsProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onCustomize,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { name: 'All Products', slug: 'all' },
    { name: 'Canvas', slug: 'canvas' },
    { name: 'Acrylic', slug: 'acrylic' },
    { name: 'Cork', slug: 'cork' },
    { name: 'Wall Art', slug: 'wall-art' },
    { name: 'Photo Frames', slug: 'photo-frames' },
    { name: 'Corporate', slug: 'corporate' },
  ];

  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter((p) => p.categorySlug === activeTab);

  return (
    <section id="trending-products" className="py-10 sm:py-14 bg-white border-b border-stone-200">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E85D04] uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5 fill-[#E85D04]" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Trending Now
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => setActiveTab(tab.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.slug
                    ? 'bg-[#E85D04] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid: Responsive 4 columns on desktop with natural width expansion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 xl:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onCustomize={onCustomize}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
