import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { CATEGORIES } from '../data/storeData';

interface CategoryGridProps {
  onSelectCategory: (slug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section id="shop-categories" className="py-10 sm:py-14 bg-stone-50 border-b border-stone-200">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E85D04] uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Explore Materials &amp; Products</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Shop by Category
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md">
            Browse our wide range of custom printed products tailored for home decor, gifting and commercial needs.
          </p>
        </div>

        {/* Categories Grid - 9 major cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 xl:gap-7">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Product Image Area */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-stone-800 text-[11px] font-bold px-2.5 py-1 rounded shadow-sm border border-stone-200">
                  from <span className="text-[#E85D04]">₹{cat.startingPrice}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded">
                  {cat.popularItem}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#E85D04] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Card Footer Button */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-600">
                    High-definition print
                  </span>
                  <button className="px-3 py-1.5 bg-stone-100 group-hover:bg-[#E85D04] text-stone-800 group-hover:text-white rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
