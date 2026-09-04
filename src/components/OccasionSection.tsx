import React from 'react';
import { Gift, ArrowRight } from 'lucide-react';
import { OCCASIONS } from '../data/storeData';

interface OccasionSectionProps {
  onSelectOccasion: (slug: string) => void;
}

export const OccasionSection: React.FC<OccasionSectionProps> = ({ onSelectOccasion }) => {
  return (
    <section id="shop-occasions" className="py-10 sm:py-14 bg-white border-b border-stone-200">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-1">
              <Gift className="w-3.5 h-3.5" />
              <span>Memorable Moments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Shop by Occasion
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md">
            Find the right personalized print for celebrations, milestones and special Indian festivals.
          </p>
        </div>

        {/* 8 Occasion Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 xl:gap-6">
          {OCCASIONS.map((occ) => (
            <div
              key={occ.id}
              onClick={() => onSelectOccasion(occ.slug)}
              className="group bg-stone-50 hover:bg-white rounded-xl border border-stone-200 hover:border-[var(--accent-border)] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              {/* Image with offer tag */}
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                <img
                  src={occ.image}
                  alt={occ.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-[var(--accent)] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                  {occ.offerText}
                </div>
              </div>

              {/* Body */}
              <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[var(--accent)] transition-colors">
                    {occ.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-snug">
                    {occ.tagline}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-[var(--accent)]">
                  <span>Explore Gifts</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
