import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductImage } from './ProductImage';

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
        <div className={`relative aspect-square ${variant === 'listing' ? 'w-full rounded-lg sm:rounded-xl' : 'max-h-[170px] w-full rounded-lg'} overflow-hidden bg-stone-100`}>
          <Link
            to={`/products/${product.id}`}
            className="block w-full h-full cursor-pointer"
            title={`View ${product.name}`}
          >
            <ProductImage
              src={product.image}
              alt={product.name}
              categorySlug={product.categorySlug}
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

        {/* Short category / subcategory */}
        <div className="text-[10px] text-stone-500 font-medium uppercase tracking-wider line-clamp-1 mt-2">
          {(product as any).subcategory || product.category}
        </div>

        {/* Title linked to /products/:id */}
        <Link
          to={`/products/${product.id}`}
          className="block font-semibold text-xs sm:text-[13px] text-stone-900 line-clamp-1 group-hover:text-[#0E4A93] transition-colors mt-0.5 cursor-pointer"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing Row */}
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-sm sm:text-base font-extrabold text-stone-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-stone-400 line-through">
            ₹{((product as any).compareAtPrice || product.originalPrice || Math.round(product.price * 1.3)).toLocaleString('en-IN')}
          </span>
          {product.discountPercent > 0 && (
            <span className="text-[10px] font-bold text-emerald-700 hidden sm:inline">
              {product.discountPercent}% off
            </span>
          )}
        </div>

        {/* Rating or New badge */}
        <div className="flex items-center gap-1.5 mt-1">
          {product.rating !== null && product.rating !== undefined && product.rating > 0 ? (
            <div className="flex items-center gap-1 text-[11px] text-stone-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-800">{product.rating}</span>
              {product.reviewsCount ? <span className="text-stone-400">({product.reviewsCount})</span> : null}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
              <span className="bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 leading-none">New</span>
              <span className="text-stone-400 font-normal leading-none">• Handcrafted</span>
            </div>
          )}

          {/* Customizable Indicator */}
          {(product as any).customizationAvailable && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#E8752A] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200/60 leading-none ml-auto">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Customizable</span>
            </span>
          )}
        </div>
      </div>

      {/* Small Clean Action CTA */}
      <div className="mt-2.5 pt-1.5 border-t border-stone-100 flex items-center justify-between">
        <Link
          to={`/products/${product.id}`}
          className="text-[11px] font-bold text-[#0E4A93] hover:text-[#E8752A] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View Product</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="text-[11px] font-bold text-stone-700 hover:text-white hover:bg-[#E8752A] px-2 py-0.5 rounded transition-colors cursor-pointer"
        >
          + Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
