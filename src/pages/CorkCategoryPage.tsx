import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronRight,
  FilterX,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  ShoppingCart
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CANVAS_FILTER_OCCASIONS } from '../data/storeData';
import { Product } from '../types';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'discount';

const PRICE_MIN_DEFAULT = 200;
const PRICE_MAX_DEFAULT = 500;

// Same layout as Canvas/Acrylic's dedicated category pages (hero + sidebar
// filters + product grid), minus the Customize entry point — Cork products
// are Size + Frame only, not customizable.
export const CorkCategoryPage: React.FC = () => {
  const {
    allProducts,
    wishlistIds,
    onAddToCart,
    onOpenCustomize,
    onToggleWishlist
  } = useShop();

  const [minPrice, setMinPrice] = useState<number>(PRICE_MIN_DEFAULT);
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX_DEFAULT);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const products: Product[] = useMemo(
    () => allProducts.filter((p) => p.categorySlug === 'cork' || p.categorySlug === 'cork-art-patterns'),
    [allProducts]
  );

  const productMatchesOccasion = (product: Product, occ: string) =>
    !!product.occasions?.includes(occ) ||
    !!product.tags?.some((t) => t.toLowerCase() === occ.toLowerCase());

  const occasionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CANVAS_FILTER_OCCASIONS.forEach((occ) => {
      counts[occ] = products.filter((p) => productMatchesOccasion(p, occ)).length;
    });
    return counts;
  }, [products]);

  const handleToggleOccasion = (occ: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  const handleResetFilters = () => {
    setMinPrice(PRICE_MIN_DEFAULT);
    setMaxPrice(PRICE_MAX_DEFAULT);
    setSelectedOccasions([]);
    setSortBy('featured');
  };

  const isFiltered =
    minPrice > PRICE_MIN_DEFAULT ||
    maxPrice < PRICE_MAX_DEFAULT ||
    selectedOccasions.length > 0;

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      const matchesOccasion =
        selectedOccasions.length === 0 ||
        selectedOccasions.some((occ) => productMatchesOccasion(product, occ));
      return matchesPrice && matchesOccasion;
    });

    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'discount':
        result = [...result].sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'featured':
      default:
        break;
    }

    return result;
  }, [products, minPrice, maxPrice, selectedOccasions, sortBy]);

  const applyPricePreset = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope">

      {/* ========================================================================= */}
      {/* HERO SECTION                                                              */}
      {/* ========================================================================= */}
      <section className="w-full bg-gradient-to-b from-[#FFFDF9] via-[#F8F9FA] to-white border-b border-stone-200/80 overflow-hidden">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 py-8 sm:py-12 lg:py-14">

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
            <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-900">Cork Art Patterns</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            <div className="lg:col-span-7 space-y-6">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0E4A93] text-xs font-black tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#0E4A93]" />
                <span>Natural Cork Finish</span>
              </div>

              <div className="space-y-3">
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight leading-tight"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
                >
                  Cork Art Patterns
                </h1>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
                  Textured, eco-friendly cork-finish prints — from geometric motifs to natural wood-grain designs. Lightweight, durable and ready to hang in any room.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const catalogEl = document.getElementById('cork-catalog-section');
                    if (catalogEl) {
                      catalogEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-6 py-3.5 bg-[#0E4A93] hover:bg-[#09356A] active:scale-[0.99] text-white text-xs sm:text-sm font-black rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>SHOP CORK</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-200/70 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Natural Cork Texture</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Lightweight &amp; Durable</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Ready to Hang</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Pan-India Delivery</span>
                </div>
              </div>

            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-xl bg-stone-100 group aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1200&auto=format&fit=crop&q=80"
                  alt="Cork Art Patterns and Wall Decor"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />

                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-stone-200/80 flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <div className="text-[11px] font-black text-stone-900 leading-tight">Eco-Friendly Cork Prints</div>
                    <div className="text-[10px] text-stone-500">Starting from ₹249 | Up to 29% OFF</div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* CORK PRODUCT LISTING                                                      */}
      {/* ========================================================================= */}
      <section id="cork-catalog-section" className="w-full py-8 sm:py-12 border-b border-stone-200/80">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">

          <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 pb-6 mb-6 border-b border-stone-200">
            <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-xs font-bold text-stone-800 hover:border-[#0E4A93] shadow-2xs cursor-pointer"
                aria-label="Open filter sidebar"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0E4A93]" />
                <span>Filters</span>
                {isFiltered && (
                  <span className="w-2 h-2 rounded-full bg-[#E8752A]"></span>
                )}
              </button>

              <div className="flex items-center gap-2 text-xs">
                <label htmlFor="sort-dropdown" className="font-semibold text-stone-500 hidden sm:inline">
                  Sort:
                </label>
                <div className="relative">
                  <select
                    id="sort-dropdown"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-white border border-stone-300 hover:border-[#0E4A93] text-stone-800 font-semibold text-xs rounded-lg px-3 py-2 pr-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0E4A93]/20 shadow-2xs"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="discount">Biggest Discount</option>
                  </select>
                  <ArrowUpDown className="w-3 h-3 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {isFiltered && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-orange-50/60 border border-orange-200/60 text-xs">
              <span className="font-bold text-stone-700">Active Filters:</span>

              {(minPrice > PRICE_MIN_DEFAULT || maxPrice < PRICE_MAX_DEFAULT) && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-orange-200 text-stone-800 px-2.5 py-1 rounded-md font-semibold text-[11px] shadow-2xs">
                  <span>Price: ₹{minPrice.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')}</span>
                  <button
                    type="button"
                    onClick={() => { setMinPrice(PRICE_MIN_DEFAULT); setMaxPrice(PRICE_MAX_DEFAULT); }}
                    className="text-stone-400 hover:text-stone-700 cursor-pointer"
                    aria-label="Remove price filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedOccasions.map((occ) => (
                <span
                  key={occ}
                  className="inline-flex items-center gap-1.5 bg-white border border-orange-200 text-stone-800 px-2.5 py-1 rounded-md font-semibold text-[11px] shadow-2xs"
                >
                  <span>{occ}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleOccasion(occ)}
                    className="text-stone-400 hover:text-stone-700 cursor-pointer"
                    aria-label={`Remove ${occ} filter`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-[#E8752A] hover:underline ml-auto flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <aside className="hidden lg:block lg:col-span-3 space-y-6 text-left sticky top-24 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">

              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#0E4A93]" />
                  <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">Filters</h3>
                </div>
                {isFiltered && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-[#E8752A] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              <div className="space-y-3.5 pb-5 border-b border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wide text-stone-900">
                    Price Range
                  </span>
                  <span className="text-[11px] font-semibold text-[#0E4A93]">
                    ₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={PRICE_MIN_DEFAULT}
                      max={PRICE_MAX_DEFAULT}
                      step={25}
                      value={maxPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= minPrice) {
                          setMaxPrice(val);
                        }
                      }}
                      className="w-full accent-[#0E4A93] cursor-pointer"
                      aria-label="Price range slider"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label htmlFor="desktop-min-price" className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                      Min Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-semibold">₹</span>
                      <input
                        id="desktop-min-price"
                        type="number"
                        min={PRICE_MIN_DEFAULT}
                        max={maxPrice}
                        step={25}
                        value={minPrice}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val <= maxPrice) setMinPrice(val);
                        }}
                        className="w-full pl-6 pr-2 py-1.5 text-xs font-bold text-stone-800 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#0E4A93]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="desktop-max-price" className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                      Max Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-semibold">₹</span>
                      <input
                        id="desktop-max-price"
                        type="number"
                        min={minPrice}
                        max={PRICE_MAX_DEFAULT}
                        step={25}
                        value={maxPrice}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= minPrice) setMaxPrice(val);
                        }}
                        className="w-full pl-6 pr-2 py-1.5 text-xs font-bold text-stone-800 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#0E4A93]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPricePreset(PRICE_MIN_DEFAULT, 299)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                      minPrice === PRICE_MIN_DEFAULT && maxPrice === 299
                        ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Under ₹300
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPricePreset(300, 400)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                      minPrice === 300 && maxPrice === 400
                        ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    ₹300 – ₹400
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPricePreset(400, PRICE_MAX_DEFAULT)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                      minPrice === 400 && maxPrice === PRICE_MAX_DEFAULT
                        ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    ₹400+
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wide text-stone-900">
                    Shop by Occasion
                  </span>
                  {selectedOccasions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedOccasions([])}
                      className="text-[10px] font-bold text-stone-500 hover:text-stone-800"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {CANVAS_FILTER_OCCASIONS.map((occasion) => {
                    const isChecked = selectedOccasions.includes(occasion);
                    const count = occasionCounts[occasion] || 0;

                    return (
                      <label
                        key={occasion}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-blue-50/70 text-[#0E4A93]'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleOccasion(occasion)}
                            className="w-4 h-4 rounded text-[#0E4A93] focus:ring-[#0E4A93] cursor-pointer"
                          />
                          <span>{occasion}</span>
                        </div>
                        <span className={`text-[11px] font-medium ${isChecked ? 'text-[#0E4A93]' : 'text-stone-400'}`}>
                          ({count})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-2 text-stone-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Natural Portuguese Cork Finish</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Ready to Hang with Hardware</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Free Insured Delivery on ₹999+</span>
                </div>
              </div>

            </aside>

            <main className="lg:col-span-9">

              <div className="flex items-center justify-between pb-4 mb-4 text-xs font-semibold text-stone-600 border-b border-stone-100">
                <div>
                  Showing <span className="text-stone-900 font-bold">{filteredProducts.length}</span> of {products.length} Cork Prints
                </div>
                {isFiltered && (
                  <div className="text-[11px] text-[#0E4A93] font-bold">
                    Filtered view active
                  </div>
                )}
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-5">
                  {filteredProducts.map((product) => (
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
                <div className="py-16 sm:py-20 px-6 rounded-2xl bg-white border border-stone-200/80 text-center space-y-4 max-w-md mx-auto my-6 shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-orange-50 text-[#E8752A] flex items-center justify-center mx-auto border border-orange-200">
                    <FilterX className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-stone-900">
                      No Cork Prints Match Filters
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      We couldn't find any products in your selected price range or occasion criteria.
                      Try widening your price range or clearing occasion selections.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 bg-[#0E4A93] hover:bg-[#0A3770] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}

            </main>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* MOBILE FILTER SLIDE-OVER DRAWER                                           */}
      {/* ========================================================================= */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 text-left">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#0E4A93]" />
                <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
                  Filter Products
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wide text-stone-900">
                    Price Range
                  </span>
                  <span className="text-[11px] font-semibold text-[#0E4A93]">
                    ₹{minPrice} – ₹{maxPrice}
                  </span>
                </div>

                <input
                  type="range"
                  min={PRICE_MIN_DEFAULT}
                  max={PRICE_MAX_DEFAULT}
                  step={25}
                  value={maxPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= minPrice) setMaxPrice(val);
                  }}
                  className="w-full accent-[#0E4A93] cursor-pointer"
                  aria-label="Price range slider mobile"
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label htmlFor="mobile-min-price" className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                      Min (₹)
                    </label>
                    <input
                      id="mobile-min-price"
                      type="number"
                      min={PRICE_MIN_DEFAULT}
                      max={maxPrice}
                      value={minPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val <= maxPrice) setMinPrice(val);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-bold text-stone-800 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="mobile-max-price" className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                      Max (₹)
                    </label>
                    <input
                      id="mobile-max-price"
                      type="number"
                      min={minPrice}
                      max={PRICE_MAX_DEFAULT}
                      value={maxPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= minPrice) setMaxPrice(val);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-bold text-stone-800 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => applyPricePreset(PRICE_MIN_DEFAULT, 299)}
                    className="px-2 py-1 text-[10px] font-semibold rounded bg-stone-100 text-stone-700"
                  >
                    Under ₹300
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPricePreset(300, 400)}
                    className="px-2 py-1 text-[10px] font-semibold rounded bg-stone-100 text-stone-700"
                  >
                    ₹300 – ₹400
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPricePreset(400, PRICE_MAX_DEFAULT)}
                    className="px-2 py-1 text-[10px] font-semibold rounded bg-stone-100 text-stone-700"
                  >
                    ₹400+
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-100">
                <span className="font-bold text-xs uppercase tracking-wide text-stone-900 block">
                  Shop by Occasion
                </span>
                <div className="space-y-2">
                  {CANVAS_FILTER_OCCASIONS.map((occasion) => {
                    const isChecked = selectedOccasions.includes(occasion);
                    const count = occasionCounts[occasion] || 0;

                    return (
                      <label
                        key={occasion}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold cursor-pointer ${
                          isChecked ? 'bg-blue-50 text-[#0E4A93]' : 'bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleOccasion(occasion)}
                            className="w-4 h-4 rounded text-[#0E4A93] cursor-pointer"
                          />
                          <span>{occasion}</span>
                        </div>
                        <span className="text-[11px] text-stone-400">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-stone-200 flex items-center gap-3 bg-stone-50">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-1/2 py-2.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-1/2 py-2.5 bg-[#0E4A93] rounded-lg text-xs font-bold text-white shadow-sm hover:bg-[#0A3770] cursor-pointer"
              >
                View ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CorkCategoryPage;
