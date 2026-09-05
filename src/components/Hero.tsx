import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Truck, Zap } from 'lucide-react';

interface HeroProps {
  onStartCreating: () => void;
  onExploreProducts: () => void;
  onSelectCategory: (slug: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartCreating,
  onExploreProducts,
  onSelectCategory,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('#0F243E');

  const colorSwatches = [
    { name: 'Navy Blue', hex: '#0F243E' },
    { name: 'Saffron Orange', hex: '#E85D04' },
    { name: 'Forest Emerald', hex: '#166534' },
    { name: 'Ruby Crimson', hex: '#B91C1C' },
    { name: 'Royal Purple', hex: '#6D28D9' },
  ];

  return (
    <section className="bg-[#FFFDF9] pt-2 sm:pt-2.5 lg:pt-3 pb-5 sm:pb-6 lg:pb-7 border-b border-stone-200/80 font-sans">
      <div className="w-full max-w-[1620px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 xl:gap-10">
          {/* Left Column: Commercial E-commerce Headline, CTAs and Trust Badges (~50%) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between pt-0">
            {/* Top Content Group */}
            <div className="space-y-3.5 sm:space-y-4 lg:space-y-4.5">
              {/* Promotional Taglines & Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)] shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                  CUSTOM PRINTING &amp; PERSONALIZED PRODUCTS
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-stone-700 bg-white border border-stone-200/90 shadow-2xs">
                  🚚 Delivered Across India in 4-6 Days
                </span>
              </div>

              {/* Headline: High-contrast editorial Bodoni Moda luxury serif */}
              <h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[86px] 2xl:text-[92px] font-bold italic text-[#0F243E] tracking-tight leading-[0.98] select-none mt-1"
                style={{
                  fontFamily: '"Playfair Display", "Bodoni Moda", "Bodoni 72", Didot, "Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  fontWeight: 700,
                  fontOpticalSizing: 'auto',
                  letterSpacing: '-0.02em',
                }}
              >
                Make It <span className="text-[var(--accent)] italic">Yours.</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base lg:text-[16px] text-stone-600 leading-relaxed max-w-[540px]">
                Create personalized canvas, acrylic and cork products for your home, gifts and business. 
                Vibrant 12-color printing, solid wood craft and easy online previews.
              </p>

              {/* CTA Row: Orange Button + White Explore Products Card with Integrated Color Swatches */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={onStartCreating}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm sm:text-base font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-98 select-none"
                >
                  <span>Start Creating</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Integrated Explore Products + Color Swatches Card */}
                <div className="bg-white border border-stone-200/90 rounded-lg shadow-2xs flex items-center px-3.5 sm:px-4 py-2 sm:py-2.5 gap-3 select-none">
                  <button
                    onClick={onExploreProducts}
                    className="text-[#0F243E] hover:text-[var(--accent)] text-sm sm:text-base font-bold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Explore Products
                  </button>

                  {/* Circular Color Swatches */}
                  <div className="flex items-center gap-1.5 pl-2.5 border-l border-stone-200">
                    {colorSwatches.map((swatch) => {
                      const isSelected = selectedColor === swatch.hex;
                      return (
                        <button
                          key={swatch.name}
                          onClick={() => setSelectedColor(swatch.hex)}
                          title={`${swatch.name} Palette`}
                          style={{ backgroundColor: swatch.hex }}
                          className={`w-5 h-5 rounded-full cursor-pointer transition-all border ${
                            isSelected 
                              ? 'scale-115 ring-2 ring-[var(--accent)] ring-offset-1 border-white shadow-xs' 
                              : 'border-black/15 hover:scale-110'
                          }`}
                          aria-label={swatch.name}
                        />
                      );
                    })}
                    <button
                      onClick={onExploreProducts}
                      title="View All Colors"
                      className="w-5 h-5 rounded-full border border-stone-300 text-stone-600 hover:text-stone-900 hover:border-stone-400 flex items-center justify-center text-xs font-bold bg-stone-50 cursor-pointer shadow-2xs hover:scale-110 transition-transform"
                      aria-label="More Colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust Badges Strip */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-7 text-xs sm:text-[13px] font-semibold text-stone-700 pt-1 select-none">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                  <span>100% Quality Check</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                  <span>Free Shipping &gt; ₹999</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Safe Delivery Box</span>
                </div>
              </div>
            </div>

            {/* Quick Material Category Shortcuts */}
            <div className="pt-4 lg:pt-5 mt-5 lg:mt-auto border-t border-stone-200/70">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
                <span className="font-bold text-stone-900 mr-1">Quick Jump:</span>
                {[
                  { name: 'Canvas', slug: 'canvas' },
                  { name: 'Acrylic', slug: 'acrylic' },
                  { name: 'Cork', slug: 'cork' },
                  { name: 'Custom Prints', slug: 'custom-prints' },
                  { name: 'Gifts & Occasions', slug: 'gifts' },
                  { name: 'Bulk Order', slug: 'bulk-order' },
                  { name: 'Corporate Orders', slug: 'corporate-orders' },
                ].map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => onSelectCategory(item.slug)}
                    className="px-3 py-1.5 bg-white hover:bg-[var(--accent-bg)] text-stone-700 hover:text-[var(--accent)] border border-stone-200 hover:border-[var(--accent-border)] rounded-full text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Clean Lifestyle Product Composition (~50%) - Tabs removed per reference */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-md border border-stone-200/90 relative">
              {/* Large Product Lifestyle Image without tabs */}
              <div className="relative aspect-[16/10.5] rounded-xl overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&auto=format&fit=crop&q=80"
                  alt="Warm Home Wall Decor"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Overlaid Promotional Tag */}
                <div className="absolute top-2.5 left-2.5 bg-[var(--accent)] text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 select-none">
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Custom Canvas from ₹599</span>
                </div>

                {/* Overlaid Context Pill */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xs p-2.5 sm:p-3 rounded-xl border border-stone-100 shadow-md flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#0F243E]">Warm Home Wall Decor</div>
                    <div className="text-[11px] text-stone-500">Living Rooms &amp; Bed Spaces</div>
                  </div>
                  <button
                    onClick={onStartCreating}
                    className="px-3.5 py-1.5 bg-[#0F243E] hover:bg-[#1A385C] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Customize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mini Feature Highlights */}
              <div className="mt-2.5 flex items-center justify-between text-xs text-stone-500 font-medium px-1">
                <span>Featured items:</span>
                <div className="flex gap-1.5 sm:gap-2">
                  <span className="bg-white border border-stone-200 px-2 sm:px-2.5 py-0.5 rounded-md text-stone-700 text-[11px] sm:text-xs font-medium shadow-2xs">
                    Stretched Canvas Art
                  </span>
                  <span className="bg-white border border-stone-200 px-2 sm:px-2.5 py-0.5 rounded-md text-stone-700 text-[11px] sm:text-xs font-medium shadow-2xs">
                    Framed Family Wall
                  </span>
                  <span className="bg-white border border-stone-200 px-2 sm:px-2.5 py-0.5 rounded-md text-stone-700 text-[11px] sm:text-xs font-medium shadow-2xs">
                    Cork Board
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
