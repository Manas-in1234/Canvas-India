import React from 'react';
import { Star, Heart, ShoppingCart, SlidersHorizontal, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onCustomize,
}) => {
  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'Best Seller':
        return 'bg-amber-500 text-white';
      case 'Sale':
        return 'bg-[var(--accent)] text-white';
      case 'Trending':
        return 'bg-[#0F243E] text-white';
      case 'Hot':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-stone-800 text-white';
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
      
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-2.5 left-2.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm tracking-wide ${getBadgeStyle(product.badge)}`}>
            {product.badge}
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-sm ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-600' 
              : 'bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Discount Tag on bottom edge */}
        <div className="absolute bottom-2 left-2 bg-[var(--accent-hover)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {product.discountPercent}% OFF
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1 group-hover:text-[var(--accent)] transition-colors mt-0.5">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-stone-500">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-500" />
              ))}
            </div>
            <span className="font-semibold text-stone-700">{product.rating}</span>
            <span className="text-stone-400">({product.reviewsCount})</span>
          </div>

          {/* Price Row */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base sm:text-lg font-extrabold text-stone-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-stone-400 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Customize */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-stone-100">
          <button
            onClick={() => onAddToCart(product)}
            className="w-full py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-md flex items-center justify-center gap-1 transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="truncate">Add to Cart</span>
          </button>

          <button
            onClick={() => onCustomize(product)}
            className="w-full py-1.5 px-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold rounded-md flex items-center justify-center gap-1 transition-colors shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="truncate">Customize</span>
          </button>
        </div>

      </div>

    </div>
  );
};
