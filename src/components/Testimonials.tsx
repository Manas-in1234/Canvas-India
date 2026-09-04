import React from 'react';
import { Star, MessageSquare, CheckCircle, Quote } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data/storeData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E85D04] uppercase tracking-wider mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Verified Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Over 25,000 prints delivered to homes, studios and businesses across India.
          </p>
        </div>

        {/* 6 Review Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 xl:gap-7">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Rating and Verification */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  {rev.verified && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{rev.review}"
                </p>
              </div>

              {/* Customer and Product Details */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs sm:text-sm text-stone-900">
                    {rev.name}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {rev.city}
                  </div>
                </div>

                <div className="text-right max-w-[150px]">
                  <div className="text-[10px] font-semibold text-[#E85D04] truncate">
                    {rev.product}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {rev.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
