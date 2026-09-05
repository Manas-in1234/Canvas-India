import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { FEATURED_COLLECTIONS } from '../data/storeData';

interface FeaturedCollectionsProps {
  onSelectCollection: (slug: string) => void;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({
  onSelectCollection,
}) => {
  return (
    <section className="py-10 sm:py-14 bg-stone-50 border-b border-stone-200">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Sets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Featured Collections
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md">
            Themed assortments created for specific rooms, art tastes and gift occasions.
          </p>
        </div>

        {/* Horizontally Arranged / Scrollable Collections Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 xl:gap-6">
          {FEATURED_COLLECTIONS.slice(0, 4).map((col) => (
            <div
              key={col.id}
              onClick={() => onSelectCollection(col.slug)}
              className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {col.itemCount} Designs
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[var(--accent)] transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    {col.highlight}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-800">
                  <span className="text-stone-500 font-normal text-[11px]">
                    from <strong className="text-[var(--accent)] font-extrabold text-xs">₹{col.startingPrice}</strong>
                  </span>
                  <div className="flex items-center gap-1 text-[var(--accent)] group-hover:underline">
                    <span>View Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Row of Collections */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mt-4">
          {FEATURED_COLLECTIONS.slice(4).map((col) => (
            <div
              key={col.id}
              onClick={() => onSelectCollection(col.slug)}
              className="group bg-white rounded-xl border border-stone-200 p-3.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-3.5"
            >
              <img
                src={col.image}
                alt={col.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-[var(--accent)] truncate">
                  {col.name}
                </h4>
                <p className="text-[11px] text-stone-500 truncate mt-0.5">{col.highlight}</p>
                <div className="text-[11px] font-bold text-[var(--accent)] mt-1">
                  Starting at ₹{col.startingPrice}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[var(--accent)] transform group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
