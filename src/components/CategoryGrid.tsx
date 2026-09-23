import React from 'react';
import { CIRCULAR_CATEGORIES } from '../data/storeData';

interface CategoryGridProps {
  onSelectCategory: (slug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section id="shop-categories" className="py-8 sm:py-10 bg-white border-b border-stone-100">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Explore custom printing formats crafted for Indian home walls and desk decor
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectCategory('canvas-prints')}
            className="text-xs sm:text-sm font-semibold text-[var(--accent)] hover:underline cursor-pointer whitespace-nowrap hidden sm:block"
          >
            All Categories →
          </button>
        </div>

        {/* Clean Circular Categories without box cards */}
        <div className="flex items-start justify-between gap-4 sm:gap-6 xl:gap-8 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {CIRCULAR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className="group flex flex-col items-center text-center shrink-0 w-24 sm:w-28 cursor-pointer focus:outline-none"
            >
              {/* Clean Circular Thumbnail */}
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden bg-stone-100 border border-stone-200 group-hover:border-[var(--accent)] transition-all group-hover:scale-105">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>

              {/* Name */}
              <span className="mt-2 text-xs sm:text-[13px] font-semibold text-stone-900 group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                {cat.name}
              </span>

              {/* Starting Price */}
              <span className="text-[11px] font-medium text-stone-500 mt-0.5">
                From ₹{cat.startingPrice}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
