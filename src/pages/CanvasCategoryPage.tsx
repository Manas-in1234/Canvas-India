import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  ChevronRight, 
  FilterX, 
  ArrowUpDown,
  Sparkles,
  Check
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CreateSomethingNew } from '../components/CreateSomethingNew';
import { CANVAS_FILTER_OCCASIONS } from '../data/storeData';
import { Product } from '../types';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'discount';

const PRICE_MIN_DEFAULT = 400;
const PRICE_MAX_DEFAULT = 4000;

export const CanvasCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    allProducts,
    wishlistIds,
    onAddToCart,
    onOpenCustomize,
    onToggleWishlist
  } = useShop();

  // Filter States
  const [minPrice, setMinPrice] = useState<number>(PRICE_MIN_DEFAULT);
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX_DEFAULT);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Source of truth for Canvas category products — pulled from the shared
  // catalog (same as Acrylic) so product cards link to real, working detail pages
  const products: Product[] = useMemo(
    () => allProducts.filter((p) => p.categorySlug === 'canvas'),
    [allProducts]
  );

  // Matches an occasion against a product's occasions list, falling back to tags
  const productMatchesOccasion = (product: Product, occ: string) =>
    !!product.occasions?.includes(occ) ||
    !!product.tags?.some((t) => t.toLowerCase() === occ.toLowerCase());

  // Occasion count helper
  const occasionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CANVAS_FILTER_OCCASIONS.forEach((occ) => {
      counts[occ] = products.filter((p) => productMatchesOccasion(p, occ)).length;
    });
    return counts;
  }, [products]);

  // Handle category routing from CreateSomethingNew
  const handleSelectCategory = (slug: string) => {
    if (slug === 'canvas' || slug === 'canvas-prints') {
      const el = document.getElementById('canvas-catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (slug === 'acrylic-prints' || slug === 'cork-prints') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('shop-categories');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate('/');
    }
  };

  // Toggle occasion filter
  const handleToggleOccasion = (occ: string) => {
    setSelectedOccasions((prev) => 
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setMinPrice(PRICE_MIN_DEFAULT);
    setMaxPrice(PRICE_MAX_DEFAULT);
    setSelectedOccasions([]);
    setSortBy('featured');
  };

  // Check if any filter is active
  const isFiltered = 
    minPrice > PRICE_MIN_DEFAULT || 
    maxPrice < PRICE_MAX_DEFAULT || 
    selectedOccasions.length > 0;

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      // Price range check
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

      // Occasion check
      const matchesOccasion =
        selectedOccasions.length === 0 ||
        selectedOccasions.some((occ) => productMatchesOccasion(product, occ));

      return matchesPrice && matchesOccasion;
    });

    // Sorting
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
        // Default ordering
        break;
    }

    return result;
  }, [products, minPrice, maxPrice, selectedOccasions, sortBy]);

  // Price presets
  const applyPricePreset = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope">
      
      {/* ========================================================================= */}
      {/* 1. REUSED HOMEPAGE SECTION: "Create Something New"                         */}
      {/* ========================================================================= */}
      <CreateSomethingNew
        onStartCreating={() => onOpenCustomize()}
        onSelectCategory={handleSelectCategory}
      />

      {/* ========================================================================= */}
      {/* 2. CANVAS PRODUCT LISTING (Amazon-Style Layout + Canvas India Identity)  */}
      {/* ========================================================================= */}
      <section id="canvas-catalog-section" className="w-full py-8 sm:py-12 border-b border-stone-200/80">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-4 text-xs font-medium text-stone-500 flex items-center gap-1.5">
            <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link to="/" className="hover:text-[#0E4A93] transition-colors">Shop by Category</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-900">Canvas Prints</span>
          </nav>

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-6 border-b border-stone-200">
            <div className="text-left space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8752A] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Museum Cotton Canvas</span>
              </div>
              <h1 
                className="text-3xl sm:text-4xl font-bold italic text-stone-900 tracking-tight font-serif"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
              >
                Canvas Prints &amp; Wall Art
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
                Archival 380 GSM pure cotton stretched over kiln-dried solid pine frames. 
                Fade-resistant pigment inks handcrafted for Indian homes, galleries, and corporate workspaces.
              </p>
            </div>

            {/* Results Count & Controls */}
            <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
              {/* Mobile Filter Trigger */}
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

              {/* Sort By Dropdown */}
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

          {/* Active Filter Badges Bar */}
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

          {/* Main Two-Column E-Commerce Browsing Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* =================================================================== */}
            {/* LEFT COLUMN: DESKTOP FILTER SIDEBAR (lg:col-span-3)                 */}
            {/* =================================================================== */}
            <aside className="hidden lg:block lg:col-span-3 space-y-6 text-left sticky top-24 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
              
              {/* Sidebar Title & Reset */}
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

              {/* ------------------------------------------------------------- */}
              {/* FILTER A: PRICE RANGE                                          */}
              {/* ------------------------------------------------------------- */}
              <div className="space-y-3.5 pb-5 border-b border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wide text-stone-900">
                    Price Range
                  </span>
                  <span className="text-[11px] font-semibold text-[#0E4A93]">
                    ₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Range Slider Control */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={PRICE_MIN_DEFAULT}
                      max={PRICE_MAX_DEFAULT}
                      step={100}
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

                {/* Min / Max Inputs */}
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
                        step={50}
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
                        step={50}
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

                {/* Quick Price Bracket Chips */}
                <div className="pt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPricePreset(PRICE_MIN_DEFAULT, 999)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                      minPrice === PRICE_MIN_DEFAULT && maxPrice === 999 
                        ? 'bg-[#0E4A93] text-white border-[#0E4A93]' 
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Under ₹1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPricePreset(1000, 1999)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                      minPrice === 1000 && maxPrice === 1999 
                        ? 'bg-[#0E4A93] text-white border-[#0E4A93]' 
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    ₹1,000 – ₹1,999
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPricePreset(2000, PRICE_MAX_DEFAULT)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                      minPrice === 2000 && maxPrice === PRICE_MAX_DEFAULT 
                        ? 'bg-[#0E4A93] text-white border-[#0E4A93]' 
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    ₹2,000+
                  </button>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* FILTER B: SHOP BY OCCASION                                     */}
              {/* ------------------------------------------------------------- */}
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

              {/* Quality & Delivery Assurance Strip in Sidebar */}
              <div className="pt-2 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-2 text-stone-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>100% Cotton Canvas (380 GSM)</span>
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

            {/* =================================================================== */}
            {/* RIGHT COLUMN: PRODUCT GRID (lg:col-span-9)                          */}
            {/* =================================================================== */}
            <main className="lg:col-span-9">
              
              {/* Results status indicator */}
              <div className="flex items-center justify-between pb-4 mb-4 text-xs font-semibold text-stone-600 border-b border-stone-100">
                <div>
                  Showing <span className="text-stone-900 font-bold">{filteredProducts.length}</span> of {products.length} Canvas Prints
                </div>
                {isFiltered && (
                  <div className="text-[11px] text-[#0E4A93] font-bold">
                    Filtered view active
                  </div>
                )}
              </div>

              {/* Grid or Polished Empty State */}
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
                /* Polished Empty State */
                <div className="py-16 sm:py-20 px-6 rounded-2xl bg-white border border-stone-200/80 text-center space-y-4 max-w-md mx-auto my-6 shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-orange-50 text-[#E8752A] flex items-center justify-center mx-auto border border-orange-200">
                    <FilterX className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-stone-900">
                      No Canvas Prints Match Filters
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
      {/* 3. MOBILE FILTER SLIDE-OVER DRAWER                                        */}
      {/* ========================================================================= */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 text-left">
            {/* Drawer Header */}
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

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Price Range */}
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
                  step={100}
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

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => applyPricePreset(PRICE_MIN_DEFAULT, 999)}
                    className="px-2 py-1 text-[10px] font-semibold rounded bg-stone-100 text-stone-700"
                  >
                    Under ₹1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPricePreset(1000, 1999)}
                    className="px-2 py-1 text-[10px] font-semibold rounded bg-stone-100 text-stone-700"
                  >
                    ₹1,000 – ₹1,999
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPricePreset(2000, PRICE_MAX_DEFAULT)}
                    className="px-2 py-1 text-[10px] font-semibold rounded bg-stone-100 text-stone-700"
                  >
                    ₹2,000+
                  </button>
                </div>
              </div>

              {/* Shop by Occasion */}
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

            {/* Drawer Footer Actions */}
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

export default CanvasCategoryPage;
