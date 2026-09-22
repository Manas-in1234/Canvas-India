import React from 'react';
import { Star } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data/storeData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-10 sm:py-14 bg-white border-b border-stone-100">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Header */}
        <div className="text-left mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-0.5">
            Verified Customer Feedback
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Loved by 1,50,000+ Indian Homes
          </h2>
        </div>

        {/* Clean Editorial Review Layout (No Boxed Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {CUSTOMER_REVIEWS.slice(0, 3).map((rev) => (
            <div key={rev.id} className="space-y-2">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-stone-800 ml-1">5.0 / 5.0</span>
              </div>

              {/* Review Quote */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                "{rev.review}"
              </p>

              {/* Customer and Product Details */}
              <div className="pt-1">
                <div className="text-xs font-bold text-stone-900">
                  — {rev.name}
                </div>
                <div className="text-[11px] text-stone-500">
                  {rev.city} • <span className="text-[var(--accent)] font-medium">{rev.product}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
