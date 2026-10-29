import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ArrowRight, Sparkles, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface MaterialOption {
  label: string;
  active: boolean;
  onSelect: () => void;
}

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onCustomize: (product: Product) => void;
  variant?: string;
  // When the same design is available in more than one material (e.g. a
  // catalogue print offered as both Canvas and Acrylic), pass the options
  // here to show a small picker instead of two near-duplicate cards.
  materialOptions?: MaterialOption[];
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onCustomize,
  variant,
  materialOptions,
}) => {
  const navigate = useNavigate();
  return (
    <div className={`group flex flex-col justify-between text-left select-none ${variant === 'listing' ? 'p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border border-stone-200/70 hover:border-[#0E4A93]/40 hover:shadow-md transition-all duration-300' : ''}`}>
      <div>
        {/* Product Image linked to /products/:id */}
        <div className={`relative aspect-[3/4] ${variant === 'listing' ? 'w-full rounded-lg sm:rounded-xl' : 'max-h-[170px] w-full rounded-lg'} overflow-hidden bg-stone-100`}>
          <Link
            to={`/products/${product.id}`}
            className="block w-full h-full cursor-pointer"
            title={`View ${product.name}`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
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

        {/* Material Picker (Canvas / Acrylic etc.) — only when this design is offered in more than one material */}
        {materialOptions && materialOptions.length > 1 && (
          <div className="flex items-center gap-1 mt-2">
            {materialOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  opt.onSelect();
                }}
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-colors cursor-pointer ${
                  opt.active
                    ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Title linked to /products/:id */}
        <Link
          to={`/products/${product.id}`}
          className="block font-semibold text-xs sm:text-[13px] text-stone-900 line-clamp-1 group-hover:text-[#0E4A93] transition-colors mt-2 cursor-pointer"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Short category / subcategory */}
        <div className="text-[10px] text-stone-500 font-medium uppercase tracking-wider line-clamp-1 mt-0.5">
          {(product as any).subcategory || product.category}
        </div>

        {/* Pricing Row */}
        {(() => {
          const rawCompare = (product as any).compareAtPrice || product.originalPrice;
          const displayOriginalPrice = rawCompare && rawCompare > product.price
            ? rawCompare
            : Math.round(product.price * 1.35);
          const displayDiscount = product.discountPercent && product.discountPercent > 0
            ? product.discountPercent
            : Math.max(15, Math.round(((displayOriginalPrice - product.price) / displayOriginalPrice) * 100));

          return (
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-sm sm:text-base font-extrabold text-stone-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-stone-400 line-through">
                ₹{displayOriginalPrice.toLocaleString('en-IN')}
              </span>
              {displayDiscount > 0 && (
                <span className="text-[10px] font-bold text-emerald-700 hidden sm:inline">
                  {displayDiscount}% off
                </span>
              )}
            </div>
          );
        })()}

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

      {/* Action CTA: Add to Cart & Customize First */}
      <div className="mt-2.5 pt-1.5 border-t border-stone-100 flex items-center gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onAddToCart(product);
          }}
          className="flex-1 py-1.5 px-2 rounded-lg bg-[#0E4A93] hover:bg-[#09356A] text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          title="Add directly to cart"
        >
          <ShoppingCart className="w-3 h-3 shrink-0" />
          <span className="truncate">Add to Cart</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (onCustomize) {
              onCustomize(product);
            } else {
              const material = product.categorySlug === 'acrylic' ? 'acrylic' : 'canvas';
              navigate(`/customize/${material}/${product.slug || product.id}`);
            }
          }}
          className="flex-1 py-1.5 px-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#E8752A] border border-orange-200 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          title="Customize before ordering"
        >
          <Sparkles className="w-3 h-3 text-[#E8752A] shrink-0" />
          <span className="truncate">Customize</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
