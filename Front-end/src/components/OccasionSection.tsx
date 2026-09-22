import React from 'react';
import { OCCASION_CARDS } from '../data/storeData';

interface OccasionSectionProps {
  onSelectOccasion: (slug: string) => void;
}

export const OccasionSection: React.FC<OccasionSectionProps> = ({ onSelectOccasion }) => {
  return (
    <section id="shop-occasions" className="py-8 sm:py-12 bg-white border-b border-stone-100">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Shop by Occasion
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Personalized photo prints and gifting keepsakes specially curated for Indian celebrations
            </p>
          </div>
        </div>

        {/* Unboxed Occasions Grid: compact visual shortcuts without rectangular card containers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {OCCASION_CARDS.map((occ) => (
            <div
              key={occ.id}
              onClick={() => onSelectOccasion(occ.slug)}
              className="group cursor-pointer text-left focus:outline-none"
            >
              {/* Image with subtle emoji overlay, clean rounded-lg */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 mb-2">
                <img
                  src={occ.image}
                  alt={occ.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 text-xs bg-white/90 w-6 h-6 rounded-full flex items-center justify-center shadow-xs">
                  {occ.emoji}
                </div>
                {occ.offerText && (
                  <div className="absolute bottom-2 right-2 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {occ.offerText}
                  </div>
                )}
              </div>

              {/* Title & Tagline */}
              <div className="font-semibold text-xs sm:text-[13px] text-stone-900 group-hover:text-[var(--accent)] transition-colors">
                {occ.name}
              </div>
              <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                {occ.tagline}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
