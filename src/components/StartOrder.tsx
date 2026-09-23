import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { QUICK_ORDER_CHOICES } from '../data/storeData';

interface StartOrderProps {
  onSelectCategory: (slug: string) => void;
  onOpenCustomizer: (initialCategory?: string) => void;
}

export const StartOrder: React.FC<StartOrderProps> = ({
  onSelectCategory,
  onOpenCustomizer,
}) => {
  return (
    <section className="py-8 sm:py-10 bg-white border-b border-stone-200">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Shopping</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Start Your Order
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md">
            Select a material to begin instant configuration or explore ready designs.
          </p>
        </div>

        {/* Quick Choice Grid - fluid 6 columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 xl:gap-5">
          {QUICK_ORDER_CHOICES.map((choice) => (
            <div
              key={choice.slug}
              onClick={() => {
                onSelectCategory(choice.slug);
                onOpenCustomizer(choice.slug);
              }}
              className="group bg-stone-50 hover:bg-white border border-stone-200 hover:border-[var(--accent-light)] rounded-xl p-2.5 sm:p-3 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              {/* Product Thumbnail */}
              <div className="aspect-square rounded-lg overflow-hidden bg-stone-200 mb-2.5 relative">
                <img
                  src={choice.image}
                  alt={choice.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-1.5 right-1.5 bg-black/75 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  from ₹{choice.startingAt}
                </div>
              </div>

              {/* Text Info */}
              <div>
                <h3 className="font-bold text-sm text-stone-900 group-hover:text-[var(--accent)] transition-colors">
                  {choice.name}
                </h3>
                <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5 leading-snug">
                  {choice.description}
                </p>
              </div>

              {/* Arrow CTA */}
              <div className="mt-3 pt-2 border-t border-stone-200/70 flex items-center justify-between text-xs font-bold text-[var(--accent)]">
                <span>Order Now</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
