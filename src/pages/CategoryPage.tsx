import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { 
  ChevronRight, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Package, 
  Filter, 
  X,
  Layers,
  Palette,
  CheckCircle2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORY_CONFIGS } from '../data/productsData';
import { Product } from '../types';

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

  // Filter products for this category
  const categoryProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Check slug match
      if (activeSlug === 'canvas' && p.categorySlug !== 'canvas') return false;
      if (activeSlug === 'acrylic' && p.categorySlug !== 'acrylic') return false;
      if (activeSlug === 'posters' && p.categorySlug !== 'posters') return false;
      if (activeSlug === 'cork' && p.categorySlug !== 'cork') return false;
      if (activeSlug === 'yoga-fitness' && p.categorySlug !== 'yoga-fitness') return false;
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
      return true;
    });
  }, [allProducts, activeSlug]);

  // Filter by subcategory and search query
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
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

      return true;
    });
  }, [categoryProducts, selectedSubcategory, searchQuery]);

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
        {/* 2. CATEGORY HERO HEADER (Clean, Box-Free)                                 */}
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
            <div className="flex items-center gap-3 shrink-0">
              {activeSlug === 'bulk-order' || activeSlug === 'corporate-orders' ? (
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="px-5 py-3 rounded-xl bg-[#E8752A] hover:bg-[#D3631A] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  <span>{activeSlug === 'bulk-order' ? 'Request Bulk Quote →' : 'Request Corporate Quote →'}</span>
                </button>
              ) : activeSlug === 'custom-prints' ? (
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
                  <div className="text-[10px] text-stone-500">Canvas, Acrylic, Cork, Paper</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-2xs flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0E4A93] font-black text-xs flex items-center justify-center mb-1">4</div>
                  <div className="font-bold text-xs text-stone-900">Your Finish</div>
                  <div className="text-[10px] text-stone-500">Matte, Gloss, Floater Frame</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-2xs flex flex-col items-center col-span-2 sm:col-span-1">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center mb-1">5</div>
                  <div className="font-bold text-xs text-emerald-800">Our Production</div>
                  <div className="text-[10px] text-emerald-600">3–5 Day Safe Dispatch</div>
                </div>
              </div>
            </div>
          )}

          {/* Special Corporate & Commercial Value Strip */}
          {(activeSlug === 'corporate-orders' || activeSlug === 'bulk-order') && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
                <Building2 className="w-5 h-5 text-[#0E4A93] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">Brand Guidelines &amp; Pantone Colors</div>
                  <div className="text-[11px] text-stone-500">Customized exactly to your brand fonts, dimensions and color codes</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">Official GST Invoicing</div>
                  <div className="text-[11px] text-stone-500">Claim 18% Input Tax Credit on all commercial purchases</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
                <Package className="w-5 h-5 text-[#E8752A] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">Tiered Volume Pricing</div>
                  <div className="text-[11px] text-stone-500">Special discounted pricing for orders above 15+ units</div>
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
        {/* 4. FILTER, SORT & SEARCH CONTROLS                                         */}
        {/* ========================================================================= */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Left: Product Count + Active Filter Tag */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="font-bold text-stone-900">
              Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'}
            </span>
            {selectedSubcategory !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-[#0E4A93] font-semibold px-2.5 py-0.5 rounded-full border border-blue-200/60">
                <span>{selectedSubcategory}</span>
                <button 
                  type="button" 
                  onClick={() => handleSelectSub('All')} 
                  className="hover:text-rose-600 cursor-pointer"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {/* Right: Search within category + Sort Selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${config.shortTitle || 'category'}...`}
                className="w-full pl-8 pr-3 py-1.5 bg-white text-stone-900 placeholder-stone-400 rounded-lg border border-stone-300 focus:outline-none focus:border-[#0E4A93] text-xs"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
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

        {/* ========================================================================= */}
        {/* 5. PRODUCT GRID                                                           */}
        {/* ========================================================================= */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-5 gap-y-10 pt-4">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onCustomize={onOpenCustomize}
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
                We couldn&apos;t find any products matching your current filters in {config.title}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedSubcategory('All');
                setSearchQuery('');
                searchParams.delete('sub');
                setSearchParams(searchParams, { replace: true });
              }}
              className="px-4 py-2 bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryPage;
