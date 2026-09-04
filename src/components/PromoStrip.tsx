import React from 'react';
import { Tag, Sparkles, ArrowRight, Clock, ShieldAlert } from 'lucide-react';

interface PromoStripProps {
  onShopDeals: () => void;
  onOpenCustomizer: () => void;
}

export const PromoStrip: React.FC<PromoStripProps> = ({
  onShopDeals,
  onOpenCustomizer,
}) => {
  return (
    <section className="bg-[#F7F7F5] border-y border-stone-200/80 text-stone-900 py-6 sm:py-7 relative overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center justify-between">
          
          {/* Main Headline */}
          <div className="md:col-span-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-50 text-[#E85D04] border border-orange-200/70 mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Limited Season Offer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-[#0F243E]">
              Create More. Pay Less.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Special offers on custom canvas, acrylic and cork prints.
            </p>
          </div>

          {/* Value Propositions Strip */}
          <div className="md:col-span-5 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white border border-stone-200/80 rounded-xl p-3 shadow-xs">
              <div className="text-stone-500 text-[11px] font-semibold">Personalized Products</div>
              <div className="text-lg font-black text-[#0F243E]">Starting at <span className="text-[#E85D04]">₹299</span></div>
              <div className="text-[11px] text-stone-500">Matte posters &amp; mini blocks</div>
            </div>

            <div className="bg-white border border-stone-200/80 rounded-xl p-3 shadow-xs">
              <div className="text-stone-500 text-[11px] font-semibold">Volume Discount</div>
              <div className="text-lg font-black text-[#0F243E]">Extra <span className="text-emerald-600">15% OFF</span></div>
              <div className="text-[11px] text-stone-500">On cart value above ₹1,999</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="md:col-span-3 flex flex-row md:flex-col items-center md:items-end justify-start md:justify-center gap-2">
            <button
              onClick={onShopDeals}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#E85D04] hover:bg-[#D44E00] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <span>View Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-stone-500 font-medium">
              Free delivery above ₹999
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
