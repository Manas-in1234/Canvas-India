import React from 'react';
import { ArrowRight, Sparkles, Tag, ShieldCheck } from 'lucide-react';

interface PromoBannerProps {
  onShopNow: () => void;
  onExploreCustom?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  onShopNow,
  onExploreCustom,
}) => {
  return (
    <section id="promo-banner" className="bg-white py-10 sm:py-14 border-b border-stone-200">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Wide Banner Container */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-stone-900 via-[#0F243E] to-stone-900 text-white shadow-xl min-h-[360px] flex items-center">
          
          {/* Background Interior Image with Gradient Mask */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85"
              alt="Indian Living Room with Canvas India Wall Art"
              className="w-full h-full object-cover opacity-35 filter saturate-120"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F243E]/95 via-[#0F243E]/80 to-transparent" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-2xl space-y-4">
            
            {/* Promo Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E85D04] text-white text-xs font-black uppercase tracking-wider shadow-sm">
              <Tag className="w-3.5 h-3.5" />
              <span>FESTIVE GALLERY SALE • LIMITED TIME</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight font-sans">
              MAKE YOUR WALL YOUR OWN.
            </h2>

            {/* Sub-headline */}
            <p className="text-stone-200 text-base sm:text-lg font-medium">
              Up to <span className="text-[#E85D04] font-black text-xl sm:text-2xl">40% OFF</span> on Custom Wall Art, Multi-Panel Canvas Sets & Floating Acrylic Frames.
            </p>

            <p className="text-xs text-stone-300 max-w-lg">
              Give your living room, bedroom, or workspace the personality it deserves with fine art prints crafted in India.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onShopNow}
                className="px-7 py-3.5 rounded-lg bg-[#E85D04] hover:bg-[#ff6f0e] active:bg-[#c94e03] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-900/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onExploreCustom && (
                <button
                  type="button"
                  onClick={onExploreCustom}
                  className="px-6 py-3.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-white/25 transition-colors cursor-pointer"
                >
                  Upload Your Art
                </button>
              )}
            </div>

            {/* Small note */}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-stone-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Use Code: <strong className="text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/20 font-mono">CANVAS40</strong> at checkout</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
