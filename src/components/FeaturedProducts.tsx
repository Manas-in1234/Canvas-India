import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { FEATURED_PRODUCTS, ProductItem } from '../data/brandData';

interface FeaturedProductsProps {
  onAddToCart: (product: ProductItem) => void;
  onViewProduct: (product: ProductItem) => void;
  filterCategory?: string | null;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onAddToCart,
  onViewProduct,
  filterCategory = null,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(filterCategory || 'All');
  const [addedId, setAddedId] = useState<string | null>(null);

  const filterTabs = ['All', 'Canvas', 'Acrylic', 'Cork', 'Frames', 'Custom'];

  const filteredProducts = activeFilter === 'All'
    ? FEATURED_PRODUCTS
    : FEATURED_PRODUCTS.filter(
        (p) =>
          p.category.toLowerCase() === activeFilter.toLowerCase() ||
          (activeFilter === 'Frames' && (p.category === 'Frames' || p.name.includes('Frame')))
      );

  const handleAdd = (prod: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(prod);
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section id="featured-products" className="py-16 lg:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2 border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Curated Catalogue</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              FEATURED PRODUCTS
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl">
              Precision manufactured Canvas, Acrylic and Cork pieces crafted to archival standards.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-stone-200/80 p-1.5 rounded-2xl">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === tab
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onViewProduct(prod)}
              className="bg-white rounded-2xl border border-stone-200 hover:border-orange-400 shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Product Image & Badges */}
              <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Category / Highlight Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-xs text-stone-800 border border-stone-200 shadow-xs">
                    {prod.category}
                  </span>
                  {prod.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white shadow-xs">
                      {prod.badge}
                    </span>
                  )}
                </div>

                {/* Quick View Button overlay on hover */}
                <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProduct(prod);
                    }}
                    className="px-4 py-2 rounded-full bg-white text-stone-900 text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>

              {/* Product Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  {/* Rating placeholder: 4.9 ★ / 248 reviews */}
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <span className="font-bold text-stone-900">{prod.rating || 4.9}</span>
                    <span className="text-stone-400">★</span>
                    <span className="text-stone-500 text-[11px]">({prod.reviewCount || 248} reviews)</span>
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-base text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {prod.name}
                  </h3>

                  {/* Short description / Tagline */}
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {prod.tagline || prod.description}
                  </p>
                </div>

                {/* Price & Add to Cart row */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider block">
                      Starting at
                    </span>
                    <span className="text-base font-extrabold text-stone-900">
                      {prod.startingPrice}
                    </span>
                  </div>

                  {/* Add to Cart Button: Prominent Orange */}
                  <button
                    onClick={(e) => handleAdd(prod, e)}
                    className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {addedId === prod.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner for Custom Orders */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">Need specific custom dimensions or bulk trade pricing?</h4>
              <p className="text-xs text-stone-500">We manufacture bespoke solutions for architects, galleries, and hospitality brands.</p>
            </div>
          </div>
          <button
            onClick={() => onViewProduct(FEATURED_PRODUCTS[0])}
            className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs tracking-wide transition-colors shrink-0"
          >
            Explore Specifications & Proofs →
          </button>
        </div>

      </div>
    </section>
  );
};
