import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { OCCASIONS, getOccasionBySlug } from '../data/occasionsData';

export const OccasionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { allProducts, wishlistIds, onToggleWishlist, onAddToCart, onOpenCustomize } = useShop();

  const occasion = getOccasionBySlug(slug);

  useEffect(() => {
    if (occasion) {
      document.title = `${occasion.name} Gifts & Prints | Canvas India`;
    }
  }, [occasion]);

  const products = useMemo(() => {
    if (!occasion) return [];
    return allProducts.filter((p) => occasion.categorySlugs.includes(p.categorySlug));
  }, [allProducts, occasion]);

  if (!occasion) {
    return (
      <div className="w-full bg-[#FFFDF9] py-20 text-center text-stone-900 font-manrope min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <h1 className="text-2xl font-bold text-stone-900">Occasion Not Found</h1>
          <p className="text-sm text-stone-500">We couldn&apos;t find that occasion.</p>
          <Link to="/" className="inline-block px-5 py-2.5 bg-[#0E4A93] text-white text-xs font-bold rounded-lg hover:bg-[#09356A] transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope">
      {/* BREADCRUMB */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 pt-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500">
          <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-medium">{occasion.name}</span>
        </nav>
      </div>

      {/* HERO BANNER — each occasion gets its own full-width photo banner */}
      <section className="relative w-full h-[280px] sm:h-[360px] lg:h-[420px] overflow-hidden mt-4">
        <img
          src={occasion.bannerImage}
          alt={occasion.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${occasion.tint} via-black/10 to-black/40`} />
        <div className="relative z-10 h-full w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 flex flex-col items-start justify-end pb-8 sm:pb-12">
          <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 flex items-center justify-center text-2xl shadow-md mb-3">
            {occasion.emoji}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
            {occasion.name} Gifts &amp; Prints
          </h1>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mt-2 leading-relaxed drop-shadow-sm">
            {occasion.tagline}
          </p>
        </div>
      </section>

      {/* OTHER OCCASIONS QUICK SWITCH */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 py-6 flex items-center gap-2.5 overflow-x-auto scrollbar-none">
        {OCCASIONS.map((o) => (
          <Link
            key={o.slug}
            to={`/occasions/${o.slug}`}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              o.slug === occasion.slug
                ? 'text-white border-transparent'
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
            }`}
            style={o.slug === occasion.slug ? { backgroundColor: occasion.accent } : undefined}
          >
            {o.emoji} {o.name}
          </Link>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 pb-16 sm:pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Shop {occasion.name} Picks
          </h2>
          <Link to="/search" className="text-xs font-bold text-[#0E4A93] hover:text-[#E8752A] flex items-center gap-1 transition-colors">
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
            {products.slice(0, 20).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onCustomize={onOpenCustomize}
                variant="listing"
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-stone-500 py-12">New {occasion.name.toLowerCase()} picks are on the way — check back soon.</p>
        )}
      </div>
    </div>
  );
};

export default OccasionPage;
