import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { 
    allProducts, 
    wishlistIds, 
    onToggleWishlist, 
    onAddToCart, 
    onOpenCustomize 
  } = useShop();

  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  useEffect(() => {
    document.title = 'My Wishlist | Canvas India';
    window.scrollTo(0, 0);
  }, []);

  const handleAddAllToCart = () => {
    wishlistedProducts.forEach((p) => onAddToCart(p));
  };

  return (
    <div className="w-full bg-[#FFFDF9] py-8 sm:py-12 text-stone-900 font-manrope min-h-[70vh]">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-stone-900">Wishlist</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8752A] uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60 mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#E8752A]" />
              <span>Saved Items</span>
            </div>
            <h1 
              className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
            >
              Your Wishlist ({wishlistedProducts.length})
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Your curated collection of favorite personalized frames and custom art.
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="px-4 py-2.5 bg-[#E8752A] hover:bg-[#d0641e] text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add All to Cart</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {wishlistedProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Your wishlist is currently empty</h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Explore our collections of handcrafted canvas, acrylic, and cork prints, and tap the heart icon on any product to save it here.
            </p>
            <div className="pt-2">
              <Link
                to="/canvas"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold text-xs rounded-lg shadow-sm transition-all"
              >
                <span>Browse Canvas Prints</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="pt-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {wishlistedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isWishlisted={true}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  onCustomize={onOpenCustomize}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default WishlistPage;
