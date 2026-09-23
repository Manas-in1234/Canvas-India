import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BUDGET_TIERS } from '../data/storeData';

interface BudgetSectionProps {
  onSelectBudget: (slug: string) => void;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({ onSelectBudget }) => {
  return (
    <section className="py-8 sm:py-12 bg-white border-b border-stone-100">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Gifts For Every Budget
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Personalized keepsakes, frames and wall prints categorized by price range
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectBudget('deals')}
            className="text-xs sm:text-sm font-semibold text-[var(--accent)] hover:underline cursor-pointer hidden sm:block"
          >
            All Deals →
          </button>
        </div>

        {/* 4 Clean Unboxed Budget Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BUDGET_TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => onSelectBudget(tier.slug)}
              className="group cursor-pointer text-left"
            >
              {/* Floating Image */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-100 mb-3">
                <img
                  src={tier.image}
                  alt={tier.range}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 bg-white/90 text-stone-900 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                  {tier.badge}
                </div>
                <div className="absolute bottom-2.5 left-3 text-white text-lg sm:text-xl font-black drop-shadow-sm">
                  {tier.range}
                </div>
              </div>

              <h3 className="font-bold text-sm text-stone-900 group-hover:text-[var(--accent)] transition-colors">
                {tier.title}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
                {tier.subtitle}
              </p>
              <div className="text-xs font-bold text-[var(--accent)] mt-2 flex items-center gap-1">
                <span>Shop Now</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
