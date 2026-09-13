import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onCustomize: (product: Product) => void;
  variant?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onCustomize,
  variant,
}) => {
  return (
    <div className={`group flex flex-col justify-between text-left select-none ${variant === 'listing' ? 'p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border border-stone-200/70 hover:border-[#0E4A93]/40 hover:shadow-md transition-all duration-300' : ''}`}>
      <div>
        {/* Product Image linked to /products/:id */}
        <div className={`relative aspect-square ${variant === 'listing' ? 'w-full rounded-lg sm:rounded-xl' : 'max-h-[160px] w-full rounded-lg'} overflow-hidden bg-stone-100`}>
          <Link 
            to={`/products/${product.id}`}
            className="block w-full h-full cursor-pointer"
            title={`View ${product.name}`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </Link>

          {/* Subtle Discount Pill */}
          {product.discountPercent > 0 && (
            <div className="pointer-events-none absolute top-2 left-2 bg-[#E8752A] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-2xs tracking-wide">
              {product.discountPercent}% OFF
            </div>
          )}

          {/* Subtle Wishlist Heart on Top Right */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggleWishlist(product.id);
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-rose-600 flex items-center justify-center transition-all shadow-xs cursor-pointer z-10"
            aria-label="Wishlist"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        </div>

        {/* Title linked to /products/:id */}
        <Link 
          to={`/products/${product.id}`}
          className="block font-semibold text-xs sm:text-[13px] text-stone-900 line-clamp-1 group-hover:text-[#0E4A93] transition-colors mt-2 cursor-pointer"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing Row */}
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm sm:text-base font-extrabold text-stone-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-stone-400 line-through">
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
          {product.discountPercent > 0 && (
            <span className="text-[10px] font-bold text-emerald-700 hidden sm:inline">
              {product.discountPercent}% off
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-stone-500">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="font-bold text-stone-800">{product.rating}</span>
          <span className="text-stone-400">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Small Clean Action CTA */}
      <div className="mt-2 pt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCustomize(product);
          }}
          className="text-[11px] font-bold text-[#0E4A93] hover:text-[#E8752A] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Customize</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <span className="text-stone-300">•</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="text-[11px] font-medium text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
        >
          + Add
        </button>
      </div>
    </div>
  );
};
