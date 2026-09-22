import React from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, Trash2, ShoppingBag, ArrowRight, ExternalLink } from 'lucide-react';
import { Product } from '../types';
import { ProductImage } from './ProductImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  allProducts: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  allProducts,
  onAddToCart,
  onToggleWishlist,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-manrope">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 bg-[#0E4A93] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-[#E8752A] text-[#E8752A]" />
              <h2 className="font-bold text-base">Your Wishlist</h2>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                {wishlistedProducts.length} saved
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-md transition-colors text-white"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
            {wishlistedProducts.length === 0 ? (
              <div className="py-16 text-center text-stone-400 space-y-3">
                <Heart className="w-12 h-12 mx-auto text-stone-300 stroke-1" />
                <div className="font-bold text-base text-stone-600">Your wishlist is empty</div>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Save your favorite canvas, acrylic prints, and custom decor pieces to order later.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-[#0E4A93] text-white text-xs font-bold rounded-lg mt-2 cursor-pointer shadow-sm hover:bg-[#0a356a] transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div key={product.id} className="py-3 flex gap-3 items-center justify-between">
                  <div className="flex gap-3 items-center min-w-0 flex-1">
                    <Link 
                      to={`/products/${product.id}`}
                      onClick={onClose}
                      className="w-16 h-16 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-50 block cursor-pointer"
                    >
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        categorySlug={product.categorySlug}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-stone-500 uppercase font-semibold">
                        {product.subcategory || product.category}
                      </div>
                      <Link 
                        to={`/products/${product.id}`}
                        onClick={onClose}
                        className="font-bold text-xs text-stone-900 truncate block hover:text-[#0E4A93] transition-colors"
                      >
                        {product.name}
                      </Link>
                      <div className="font-black text-xs text-stone-900 mt-0.5">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onAddToCart(product)}
                      className="px-2.5 py-1.5 bg-[#E8752A] hover:bg-[#d0641e] text-white text-[11px] font-bold rounded-md flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with full page link */}
          {wishlistedProducts.length > 0 && (
            <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-2">
              <Link
                to="/wishlist"
                onClick={onClose}
                className="w-full py-2.5 px-3 border border-stone-300 hover:border-[#0E4A93] bg-white text-stone-800 text-xs font-bold rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Wishlist Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
