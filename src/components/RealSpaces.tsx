import React, { useState } from 'react';
import { Building, Home, UtensilsCrossed, Hotel, GraduationCap, Palette, ShoppingBag } from 'lucide-react';
import { REAL_SPACES } from '../data/storeData';

export const RealSpaces: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Homes', 'Offices', 'Restaurants', 'Hotels', 'Studios', 'Retail Spaces'];

  const filteredSpaces = selectedFilter === 'All'
    ? REAL_SPACES
    : REAL_SPACES.filter(s => s.spaceType.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <section id="real-spaces-section" className="py-12 sm:py-16 bg-white border-b border-stone-200">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E85D04] uppercase tracking-wider mb-1">
              <Building className="w-3.5 h-3.5" />
              <span>Real Customer Applications</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Canvas India in Real Spaces
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedFilter === f
                    ? 'bg-[#0F243E] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 xl:gap-7">
          {filteredSpaces.map((space) => (
            <div
              key={space.id}
              className="group bg-stone-50 rounded-xl overflow-hidden border border-stone-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                <img
                  src={space.image}
                  alt={space.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {space.spaceType}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#E85D04] transition-colors">
                    {space.title}
                  </h3>
                  <div className="mt-1 text-xs font-semibold text-[#E85D04]">
                    {space.productUsed}
                  </div>
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    {space.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
