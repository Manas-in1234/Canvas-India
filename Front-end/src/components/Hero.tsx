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
    <section className="bg-[#FFFDF9] py-10 sm:py-14 lg:py-16 border-b border-stone-200/80 font-sans">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Commercial Headline & Actions (~55%) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CUSTOM PRINTING &amp; PERSONALIZED PRODUCTS</span>
            </div>

            {/* Headline: High-contrast editorial Bodoni Moda luxury serif */}
            <h1 
              className="text-4xl sm:text-6xl lg:text-[70px] xl:text-[80px] font-bold italic text-[#0F243E] tracking-tight leading-[0.98] select-none"
              style={{
                fontFamily: '"Playfair Display", "Bodoni Moda", "Bodoni 72", Didot, "Cormorant Garamond", serif',
                fontStyle: 'italic',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              Make It <span className="text-[var(--accent)] italic">Yours.</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
              Create personalized canvas, acrylic and cork products for your home, gifts and business. 
              Vibrant 12-color printing, solid wood craft and easy online previews.
            </p>

            {/* CTA Row: Button + Clean Link + Color Swatches */}
            <div className="flex flex-wrap items-center gap-5 pt-1">
              <button
                type="button"
                onClick={onStartCreating}
                className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                <span>Start Creating</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreProducts}
                className="text-xs sm:text-sm font-semibold text-[#0F243E] hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Explore Products →</span>
              </button>

              {/* Circular Color Swatches */}
              <div className="flex items-center gap-1.5 pl-3 border-l border-stone-200">
                {colorSwatches.map((swatch) => {
                  const isSelected = selectedColor === swatch.hex;
                  return (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => setSelectedColor(swatch.hex)}
                      title={`${swatch.name} Palette`}
                      style={{ backgroundColor: swatch.hex }}
                      className={`w-4 h-4 rounded-full cursor-pointer transition-all border ${
                        isSelected 
                          ? 'scale-115 ring-2 ring-[var(--accent)] ring-offset-1 border-white shadow-xs' 
                          : 'border-black/15 hover:scale-110'
                      }`}
                      aria-label={swatch.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Trust Badges Strip (Clean Line) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-stone-600 pt-2 select-none">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>100% Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>Free Shipping &gt; ₹999</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Safe Delivery Box</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Lifestyle Scene (No Enclosing Card Box) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&auto=format&fit=crop&q=80"
                alt="Warm Home Wall Decor"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-2.5 left-2.5 bg-[var(--accent)] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 select-none">
                <Zap className="w-3 h-3 fill-white" />
                <span>From ₹499</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
