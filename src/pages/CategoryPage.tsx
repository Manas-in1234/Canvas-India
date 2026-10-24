import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { 
  ChevronRight, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Package, 
  X,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { ShopByCategoryFilter } from '../components/ShopByCategoryFilter';
import { SHOP_CATEGORIES, CORK_FILTER_CATEGORIES, isCorkCategoryMatch } from '../data/shopCategories';
import { CATEGORY_CONFIGS } from '../data/productsData';
import { Product } from '../types';

const PRICE_MIN_DEFAULT = 200;
const PRICE_MAX_DEFAULT = 4000;

const isCorkMatch = isCorkCategoryMatch;

interface CategoryPageProps {
  categorySlug?: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug: propSlug }) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Resolve category slug from props or location pathname
  const activeSlug = useMemo(() => {
    if (propSlug) return propSlug;
    const path = location.pathname.replace(/^\//, '').split('/')[0];
    if (path === 'canvas-prints') return 'canvas';
    if (path === 'acrylic-prints') return 'acrylic';
    if (path === 'cork-prints') return 'cork';
    if (path === 'corporate') return 'corporate-orders';
    if (path === 'bulk-orders') return 'bulk-order';
    return path || 'canvas';
  }, [propSlug, location.pathname]);

  const { 
    allProducts, 
    wishlistIds, 
    onToggleWishlist, 
    onAddToCart, 
    onOpenCustomize, 
    onOpenQuote 
  } = useShop();

  const config = CATEGORY_CONFIGS[activeSlug] || CATEGORY_CONFIGS['canvas'];

  // Check if current activeSlug is Cork / Yoga
  const isCorkCategory = activeSlug === 'cork' || activeSlug === 'yoga-fitness' || activeSlug === 'cork-art-patterns';

  // Check if current activeSlug is one of the ShopByCategory items
  const isShopCategory = !isCorkCategory && SHOP_CATEGORIES.some((c) => c.categorySlug === activeSlug);

  const filterCategories = isCorkCategory ? CORK_FILTER_CATEGORIES : SHOP_CATEGORIES;

  // Shop by Category picks
  const [extraCategorySlugs, setExtraCategorySlugs] = useState<string[]>(() =>
    isShopCategory ? [activeSlug] : []
  );

  useEffect(() => {
    if (isShopCategory) {
      setExtraCategorySlugs([activeSlug]);
    } else {
      setExtraCategorySlugs([]);
    }
  }, [activeSlug, isShopCategory]);

  // Price filter states
  const [minPrice, setMinPrice] = useState<number>(PRICE_MIN_DEFAULT);
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX_DEFAULT);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Query param for subcategory
  const initialSub = searchParams.get('sub') || 'All';
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSub);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'newest'>('recommended');

  // Sync with URL query parameter
  useEffect(() => {
    const sub = searchParams.get('sub');
    if (sub) {
      setSelectedSubcategory(sub);
    } else {
      setSelectedSubcategory('All');
    }
  }, [searchParams]);

  // Set document title
  useEffect(() => {
    document.title = `${config.seoTitle || config.title} | Canvas India`;
  }, [config]);

  const handleSelectSub = (sub: string) => {
    setSelectedSubcategory(sub);
    if (sub === 'All') {
      searchParams.delete('sub');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ sub }, { replace: true });
    }
  };

  // "Shop by Category" checkboxes express a different filter intent than the
  // single ?sub= subcategory pill — without clearing it, a page reached via
  // ?sub=Yoga%20Mats keeps that subcategory applied as a hard AND-filter on
  // top of the checked categories, hiding every other checked category's
  // products (e.g. checking Yoga Bricks too would still only show Mats).
  const handleCategoryFilterChange = (slugs: string[]) => {
    setExtraCategorySlugs(slugs);
    if (selectedSubcategory !== 'All') {
      handleSelectSub('All');
    }
  };

  // Base products for this category
  const categoryProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Check slug match
      if (activeSlug === 'canvas' && p.categorySlug !== 'canvas') return false;
      if (activeSlug === 'acrylic' && p.categorySlug !== 'acrylic') return false;
      if (activeSlug === 'posters' && p.categorySlug !== 'posters') return false;
      if (activeSlug === 'cork') {
        return p.categorySlug === 'cork' || p.categorySlug === 'cork-art-patterns';
      }
      if (activeSlug === 'yoga-fitness') {
        return p.categorySlug === 'yoga-fitness' || p.id.startsWith('cork-9c-y');
      }
      if (activeSlug === 'home-decor' && p.categorySlug !== 'home-decor') return false;
      if (activeSlug === 'custom-prints' && p.categorySlug !== 'custom-prints') return false;
      if (activeSlug === 'corporate-orders' && p.categorySlug !== 'corporate-orders') return false;
      if (activeSlug === 'bulk-order') {
        return p.categorySlug === 'bulk-order' || p.tags?.includes('bulk');
      }
      if (activeSlug === 'gifts') {
        return p.categorySlug === 'gifts' || p.tags?.includes('gift');
      }
      if (activeSlug === 'wall-art') {
        return p.tags?.some((t) => t.toLowerCase() === 'wall art') ?? false;
      }
      if (activeSlug === 'photo-frames') {
        return p.finishes?.some((f) => f.toLowerCase().includes('frame')) ?? false;
      }
      // Default: exact categorySlug match
      return p.categorySlug === activeSlug;
    });
  }, [allProducts, activeSlug]);

  // Merge products according to Shop by Category picks
  const baseProducts = useMemo(() => {
    if (isCorkCategory) {
      const allCork = allProducts.filter(
        (p) =>
          p.categorySlug === 'cork' ||
          p.categorySlug === 'cork-art-patterns' ||
          p.categorySlug === 'yoga-fitness' ||
          p.id.startsWith('cork-')
      );
      if (extraCategorySlugs.length > 0) {
        return allCork.filter((p) => extraCategorySlugs.some((slug) => isCorkMatch(p, slug)));
      }
      return allCork;
    }

    if (extraCategorySlugs.length > 0) {
      return allProducts.filter((p) => extraCategorySlugs.includes(p.categorySlug));
    }
    return categoryProducts;
  }, [allProducts, extraCategorySlugs, categoryProducts, isCorkCategory]);

  // Check if any filter is active
  const isFiltered =
    minPrice > PRICE_MIN_DEFAULT ||
    maxPrice < PRICE_MAX_DEFAULT ||
    (isShopCategory
      ? extraCategorySlugs.length !== 1 || extraCategorySlugs[0] !== activeSlug
      : extraCategorySlugs.length > 0) ||
    selectedSubcategory !== 'All' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setMinPrice(PRICE_MIN_DEFAULT);
    setMaxPrice(PRICE_MAX_DEFAULT);
    setExtraCategorySlugs(isShopCategory ? [activeSlug] : []);
    setSelectedSubcategory('All');
    setSearchQuery('');
  };

  const applyPricePreset = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  // Filter products by subcategory, search, and price
  const filteredProducts = useMemo(() => {
    return baseProducts.filter((product) => {
      // Subcategory filter
      if (selectedSubcategory !== 'All') {
        const sel = selectedSubcategory.toLowerCase();
        const matchesSub = 
          product.subcategory?.toLowerCase() === sel ||
          (product.tags && product.tags.some(t => t.toLowerCase() === sel || sel.includes(t.toLowerCase()) || t.toLowerCase().includes(sel)));
        if (!matchesSub) return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          (product.subcategory && product.subcategory.toLowerCase().includes(q)) ||
          (product.tags && product.tags.some(t => t.toLowerCase().includes(q)));
        if (!matchesQuery) return false;
      }

      // Price filter
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      return true;
    });
  }, [baseProducts, selectedSubcategory, searchQuery, minPrice, maxPrice]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  return (
    <div className="w-full bg-[#FFFDF9] py-6 sm:py-10 text-stone-900 font-manrope">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* ========================================================================= */}
        {/* 1. BREADCRUMB                                                             */}
        {/* ========================================================================= */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-6 sm:mb-8">
          <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-semibold">{config.shortTitle || config.title}</span>
          {selectedSubcategory !== 'All' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-[#0E4A93] font-medium">{selectedSubcategory}</span>
            </>
          )}
        </nav>

        {/* ========================================================================= */}
        {/* 2. CATEGORY HERO HEADER                                                   */}
        {/* ========================================================================= */}
        <div className="pb-8 border-b border-stone-200/80 text-left">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#0E4A93]">
                {config.shortTitle || 'Canvas India Collection'}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 tracking-tight">
                {config.title}
              </h1>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
                {config.description}
              </p>
            </div>

            {/* Quick Action CTA based on Category */}
            {activeSlug !== 'bulk-order' && activeSlug !== 'corporate-orders' && (
              <div className="flex items-center gap-3 shrink-0">
                {activeSlug === 'custom-prints' ? (
                  <button
                    type="button"
                    onClick={() => onOpenCustomize()}
                    className="px-5 py-3 rounded-xl bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Start Custom Project →</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenQuote}
                    className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Need Custom Dimensions?</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>



          {/* Special Custom Prints 5-Step Workflow Banner */}
          {activeSlug === 'custom-prints' && (
            <div className="mt-8 p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="text-xs font-black uppercase tracking-wider text-[#0E4A93] mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#E8752A]" />
                <span>Our Simple 5-Step Production Workflow</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-2xs flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0E4A93] font-black text-xs flex items-center justify-center mb-1">1</div>
                  <div className="font-bold text-xs text-stone-900">Your Design</div>
                  <div className="text-[10px] text-stone-500">Upload high-res files</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-2xs flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0E4A93] font-black text-xs flex items-center justify-center mb-1">2</div>
                  <div className="font-bold text-xs text-stone-900">Your Size</div>
                  <div className="text-[10px] text-stone-500">Preset or custom dimensions</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-2xs flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0E4A93] font-black text-xs flex items-center justify-center mb-1">3</div>
                  <div className="font-bold text-xs text-stone-900">Your Material</div>
                  <div className="text-[10px] text-stone-500">Canvas, Acrylic or Paper</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-2xs flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0E4A93] font-black text-xs flex items-center justify-center mb-1">4</div>
                  <div className="font-bold text-xs text-stone-900">Your Finish</div>
                  <div className="text-[10px] text-stone-500">Edge wrap, matte, or gloss</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-2xs flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0E4A93] font-black text-xs flex items-center justify-center mb-1">5</div>
                  <div className="font-bold text-xs text-stone-900">Production</div>
                  <div className="text-[10px] text-stone-500">Precision printed &amp; shipped</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. SUBCATEGORY PILLS BAR                                                  */}
        {/* ========================================================================= */}
        {config.subcategories && config.subcategories.length > 0 && (
          <div className="py-4 overflow-x-auto scrollbar-none flex items-center gap-2 border-b border-stone-200/80">
            {config.subcategories.map((sub) => {
              const isActive = selectedSubcategory.toLowerCase() === sub.toLowerCase();
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleSelectSub(sub)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0E4A93] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. MOBILE FILTER TRIGGER BAR                                              */}
        {/* ========================================================================= */}
        <div className="lg:hidden flex items-center justify-between py-4 border-b border-stone-200">
          <span className="text-xs font-bold text-stone-700">
            Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'}
          </span>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-xs font-bold text-stone-800 hover:border-[#0E4A93] shadow-2xs cursor-pointer"
            aria-label="Open filter sidebar"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0E4A93]" />
            <span>Filters</span>
            {isFiltered && (
              <span className="w-2 h-2 rounded-full bg-[#E8752A]"></span>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 5. ACTIVE FILTER BADGES BAR                                               */}
        {/* ========================================================================= */}
        {isFiltered && (
          <div className="flex flex-wrap items-center gap-2 my-4 p-3 rounded-xl bg-orange-50/60 border border-orange-200/60 text-xs">
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

            {extraCategorySlugs.length > 0 && !isShopCategory && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-orange-200 text-stone-800 px-2.5 py-1 rounded-md font-semibold text-[11px] shadow-2xs">
                <span>Categories: {extraCategorySlugs.length} selected</span>
                <button
                  type="button"
                  onClick={() => setExtraCategorySlugs([])}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSubcategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-orange-200 text-stone-800 px-2.5 py-1 rounded-md font-semibold text-[11px] shadow-2xs">
                <span>{selectedSubcategory}</span>
                <button
                  type="button"
                  onClick={() => handleSelectSub('All')}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                  aria-label="Remove subcategory filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-orange-200 text-stone-800 px-2.5 py-1 rounded-md font-semibold text-[11px] shadow-2xs">
                <span>Search: &quot;{searchQuery}&quot;</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                  aria-label="Remove search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

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

        {/* ========================================================================= */}
        {/* 6. MAIN TWO-COLUMN BROWSING GRID (SIDEBAR + PRODUCT GRID)                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
          
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

              {/* Slider */}
              <div className="pt-2">
                <input
                  type="range"
                  min={PRICE_MIN_DEFAULT}
                  max={PRICE_MAX_DEFAULT}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= minPrice) setMaxPrice(val);
                  }}
                  className="w-full accent-[#0E4A93] cursor-pointer"
                  aria-label="Price range slider"
                />
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
            {/* FILTER B: SHOP BY CATEGORY                                     */}
            {/* ------------------------------------------------------------- */}
            <div className="space-y-3">
              <span className="font-bold text-xs uppercase tracking-wide text-stone-900 block">
                Shop by Category
              </span>
              <p className="text-[10px] text-stone-400 -mt-1.5">Check more than one to view them together.</p>
              <ShopByCategoryFilter categories={filterCategories} selectedSlugs={extraCategorySlugs} onChange={handleCategoryFilterChange} />
            </div>

            {/* Quality & Delivery Assurance Strip in Sidebar */}
            <div className="pt-2 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
              <div className="flex items-center gap-2 text-stone-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{activeSlug === 'acrylic' ? 'Crystal-Clear Optical Acrylic' : activeSlug === 'cork' || activeSlug === 'yoga-fitness' ? '100% Natural Organic Cork' : '100% Cotton Canvas (380 GSM)'}</span>
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
            
            {/* Results status indicator and Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 text-xs font-semibold text-stone-600 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span>
                  Showing <span className="text-stone-900 font-bold">{sortedProducts.length}</span> of {baseProducts.length} Products
                </span>
                {isFiltered && (
                  <span className="text-[11px] text-[#0E4A93] font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Filtered view active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 justify-end">
                {/* Search Input */}
                <div className="relative w-full sm:w-52">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search products...`}
                    className="w-full pl-8 pr-7 py-1.5 bg-white text-stone-900 placeholder-stone-400 rounded-lg border border-stone-300 focus:outline-none focus:border-[#0E4A93] text-xs"
                  />
                  {searchQuery && (
                    <button 
                      type="button" 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-stone-500 hidden md:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-800 font-semibold text-xs focus:outline-none focus:border-[#0E4A93] cursor-pointer"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">New Arrivals</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid or Polished Empty State */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-5">
                {sortedProducts.map((product) => (
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
              /* Empty State */
              <div className="py-20 text-center space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900 text-base">No Products Found</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    We couldn&apos;t find any products matching your current filters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MOBILE FILTER MODAL DRAWER                                                */}
      {/* ========================================================================= */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
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
                  step={50}
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

              {/* Shop by Category */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <span className="font-bold text-xs uppercase tracking-wide text-stone-900 block">
                  Shop by Category
                </span>
                <p className="text-[10px] text-stone-400 -mt-1.5">Check more than one to view them together.</p>
                <ShopByCategoryFilter categories={filterCategories} selectedSlugs={extraCategorySlugs} onChange={handleCategoryFilterChange} />
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
                View ({sortedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoryPage;
