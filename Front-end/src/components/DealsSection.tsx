import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { DEALS_PRODUCTS } from '../data/storeData';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface DealsSectionProps {
  onAddToCart: (product: Product) => void;
  onCustomize: (product: Product) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({
  onAddToCart,
  onCustomize,
  wishlistIds = [],
  onToggleWishlist = () => {},
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 34, seconds: 22 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (val: number) => val.toString().padStart(2, '0');

  return (
    <section id="deals-section" className="py-8 sm:py-10 bg-[#FAF8F5] border-b border-stone-200/60">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Clean Header with Countdown Timer (No enclosing card) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div className="text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-0.5">
              ⚡ Limited-Time Discounts
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Today's Best Deals
            </h2>
          </div>

          {/* Clean Flat Countdown Timer */}
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
            <Clock className="w-4 h-4 text-stone-500" />
            <span>Offer Ends In:</span>
            <span className="font-mono font-bold text-stone-950 bg-stone-200/70 px-2 py-0.5 rounded text-xs">
              {formatDigits(timeLeft.hours)}h : {formatDigits(timeLeft.minutes)}m : {formatDigits(timeLeft.seconds)}s
            </span>
          </div>
        </div>

        {/* 4 Clean Unboxed Deals Product Items */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {DEALS_PRODUCTS.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              isWishlisted={wishlistIds.includes(prod.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onCustomize={onCustomize}
              variant="marketplace"
            />
          ))}
        </div>

      </div>
    </section>
  );
};
