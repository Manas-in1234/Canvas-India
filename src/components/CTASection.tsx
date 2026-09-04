import React from 'react';
import { ArrowRight, Sparkles, Phone, Mail, ShieldCheck } from 'lucide-react';

interface CTASectionProps {
  onExploreProducts: () => void;
  onOpenQuote: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onExploreProducts,
  onOpenQuote,
}) => {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-stone-900 text-white p-8 sm:p-14 lg:p-20 text-center overflow-hidden shadow-2xl border border-stone-800">
          {/* Subtle Background Rings & Orange Warmth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider border border-orange-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bring Your Vision To Reality</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              WHAT WILL YOU CREATE?
            </h2>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Explore premium Canvas, Acrylic and Cork solutions designed for your space.
              From residential focal points to pan-India commercial rollouts, our atelier delivers immaculate craft.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={onExploreProducts}
                className="px-8 py-4 rounded-full bg-white hover:bg-stone-100 text-stone-900 font-bold text-sm sm:text-base transition-colors shadow-md cursor-pointer"
              >
                Explore Products
              </button>

              <button
                onClick={onOpenQuote}
                className="px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Get a Quote</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Direct Connect Footnote */}
            <div className="pt-8 border-t border-stone-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
              <span className="flex items-center gap-1.5 text-stone-300">
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>Trade Concierge: <strong>+91 (080) 4122-8900</strong></span>
              </span>
              <span className="hidden sm:inline text-stone-600">•</span>
              <span className="flex items-center gap-1.5 text-stone-300">
                <Mail className="w-3.5 h-3.5 text-orange-400" />
                <span>Direct Drawings / RFQ: <strong>studio@canvasindia.in</strong></span>
              </span>
              <span className="hidden sm:inline text-stone-600">•</span>
              <span className="flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pan-India Safe Crate Freight Guarantee</span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
