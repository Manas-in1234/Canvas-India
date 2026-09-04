import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onStartCreating: () => void;
  onExploreProducts: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  onStartCreating,
  onExploreProducts,
}) => {
  return (
    <section className="bg-[#FFFDF9] border-t border-stone-200/80 py-14 sm:py-16 relative overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)] text-center relative z-10 space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#E85D04] border border-orange-200/70">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Made in India • Pan-India Delivery</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F243E] tracking-tight leading-tight">
          Create Something You'll Love
        </h2>

        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
          Turn your photos, ideas and designs into something real.
          Museum-grade cotton canvas, high-gloss acrylic and sustainable cork prints.
        </p>

        {/* Buttons */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onStartCreating}
            className="px-8 py-3.5 bg-[#E85D04] text-white hover:bg-[#D44E00] font-bold text-sm sm:text-base rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
          >
            <span>Start Creating</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreProducts}
            className="px-8 py-3.5 bg-[#0F243E] hover:bg-[#1A385C] text-white font-bold text-sm sm:text-base rounded-lg shadow-sm transition-colors"
          >
            <span>Explore Products</span>
          </button>
        </div>

        <div className="text-xs text-stone-500 pt-2 font-medium">
          Free Delivery on orders above ₹999 • 100% Quality Guarantee
        </div>
      </div>
    </section>
  );
};
