import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ChevronRight, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  X,
  Heart,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  RotateCcw,
  ShoppingCart,
  Star,
  Award,
  Palette,
  Gift,
  Shapes
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from '../components/ProductImage';
import { Product } from '../types';
import { loadAllStoredReviews, AcrylicProductReview } from '../data/acrylicReviews';

export interface AcrylicCategoryTab {
  slug: string;
  name: string;
  description: string;
}

export const ACRYLIC_CATEGORY_TABS: AcrylicCategoryTab[] = [
  { slug: 'all', name: 'All Acrylic Products', description: 'Complete collection of premium acrylic prints and wall displays' },
  { slug: 'photo-blocks', name: 'Acrylic Photo Blocks', description: 'Freestanding solid optical acrylic desk blocks' },
  { slug: 'photo-panels', name: 'Acrylic Photo Panels', description: 'Sleek wall panels with diamond-polished edges' },
  { slug: 'wall-art', name: 'Acrylic Wall Art', description: 'Statement acrylic displays and multi-piece art' },
  { slug: 'acrylic-prints', name: 'Acrylic Prints', description: 'Sub-surface UV archival photographic prints' },
  { slug: 'collage-split', name: 'Collage & Split Panels', description: 'Multi-photo collages and triptych panoramic panels' },
  { slug: 'signage-corporate', name: 'Signage & Corporate', description: 'Executive nameplates, logos, and architectural signage' },
  { slug: 'gifts', name: 'Keepsakes & Gifts', description: 'Personalized acrylic gifts for birthdays, weddings, anniversaries' },
  { slug: 'decorative', name: 'Art & Decorative', description: 'Contemporary designs and inspirational typography' }
];

export const SHAPE_TABS = ACRYLIC_CATEGORY_TABS;

export const isProductInAcrylicCategory = (product: Product, slug: string): boolean => {
  if (slug === 'all') return true;
  const name = (product.name || '').toLowerCase();
  const prodSlug = (product.slug || '').toLowerCase();
  const subcat = (product.subcategory || '').toLowerCase();
  const tags = (product.tags || []).map(t => t.toLowerCase());

  switch (slug) {
    case 'photo-blocks':
      return name.includes('block') || prodSlug.includes('block') || tags.includes('photo block') || tags.includes('freestanding');
    case 'photo-panels':
      return (subcat.includes('photo panel') || name.includes('panel') || prodSlug.includes('panel')) && !name.includes('block') && !prodSlug.includes('block');
    case 'wall-art':
      return subcat.includes('wall art') || name.includes('wall art') || prodSlug.includes('wall-art');
    case 'acrylic-prints':
      return name.includes('print') || prodSlug.includes('print');
    case 'collage-split':
      return name.includes('collage') || name.includes('split') || prodSlug.includes('collage') || prodSlug.includes('split');
    case 'signage-corporate':
      return subcat.includes('signage') || subcat.includes('corporate') || subcat.includes('office') || name.includes('signage') || name.includes('corporate') || name.includes('reception') || tags.includes('corporate');
    case 'gifts':
      return subcat.includes('gifts') || name.includes('gift') || name.includes('keepsake') || Boolean(product.occasions && product.occasions.length > 0);
    case 'decorative':
      return subcat.includes('decorative') || subcat.includes('artwork') || subcat.includes('posters') || name.includes('decorative') || name.includes('abstract') || name.includes('poster');
    default:
      return true;
  }
};

const OCCASIONS_LIST = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Housewarming',
  'Diwali',
  'Corporate Gifts'
];

const FEATURES_LIST = [
  'Premium Acrylic',
  'Vibrant & Long Lasting',
  'Ready to Hang',
  'Personalized',
  'Suitable for Gifting',
  'Corporate Use'
];

type SortOption = 
  | 'Price: Low to High'
  | 'Price: High to Low'
  | 'Newest First'
  | 'Best Selling'
  | 'Discount: High to Low'
  | 'Customer Rating'
  | 'Name: A–Z';

const SORT_OPTIONS: SortOption[] = [
  'Price: Low to High',
  'Price: High to Low',
  'Newest First',
  'Best Selling',
  'Discount: High to Low',
  'Customer Rating',
  'Name: A–Z'
];

export const AcrylicCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    allProducts, 
    wishlistIds, 
    onToggleWishlist, 
    onAddToCart 
  } = useShop();

  // Product category filter state (Default: 'all')
  const initialCategory = searchParams.get('category') || searchParams.get('shape') || 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Panels Open/Close State (BOTH CLOSED BY DEFAULT)
  const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
  const [sortPanelOpen, setSortPanelOpen] = useState<boolean>(false);

  // Applied Filter State
  const [appliedMinPrice, setAppliedMinPrice] = useState<number>(400);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number>(4000);
  const [appliedOccasions, setAppliedOccasions] = useState<string[]>([]);
  const [appliedFeatures, setAppliedFeatures] = useState<string[]>([]);

  // Draft Filter State (inside filter panel)
  const [draftMinPrice, setDraftMinPrice] = useState<number>(400);
  const [draftMaxPrice, setDraftMaxPrice] = useState<number>(4000);
  const [draftOccasions, setDraftOccasions] = useState<string[]>([]);
  const [draftFeatures, setDraftFeatures] = useState<string[]>([]);

  // Sorting state (Default: 'Price: Low to High')
  const [sortBy, setSortBy] = useState<SortOption>('Price: Low to High');

  // Product reviews state persisted in localStorage
  const [productReviewsMap] = useState<Record<string, AcrylicProductReview[]>>(() => {
    return loadAllStoredReviews();
  });

  // Ref for panels outside click detection
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Sync category with URL
  useEffect(() => {
    const cat = searchParams.get('category') || searchParams.get('shape');
    if (cat && ACRYLIC_CATEGORY_TABS.some(t => t.slug.toLowerCase() === cat.toLowerCase())) {
      setSelectedCategory(cat.toLowerCase());
    } else if (!cat) {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  useEffect(() => {
    document.title = 'Acrylic Prints & Wall Art | Canvas India';
  }, []);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When opening filter panel, initialize draft state from applied state
  const handleToggleFilterPanel = () => {
    if (!filterPanelOpen) {
      setDraftMinPrice(appliedMinPrice);
      setDraftMaxPrice(appliedMaxPrice);
      setDraftOccasions([...appliedOccasions]);
      setDraftFeatures([...appliedFeatures]);
      setSortPanelOpen(false);
      setFilterPanelOpen(true);
    } else {
      setFilterPanelOpen(false);
    }
  };

  const handleToggleSortPanel = () => {
    if (!sortPanelOpen) {
      setFilterPanelOpen(false);
      setSortPanelOpen(true);
    } else {
      setSortPanelOpen(false);
    }
  };

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
      newParams.delete('shape');
    } else {
      newParams.set('category', slug);
      newParams.delete('shape');
    }
    setSearchParams(newParams, { replace: true });
  };

  // Base Acrylic products from catalog
  const acrylicProducts = useMemo(() => {
    return allProducts.filter((p) => p.categorySlug === 'acrylic');
  }, [allProducts]);

  // Occasion checkbox toggle in draft
  const handleToggleDraftOccasion = (occasion: string) => {
    setDraftOccasions((prev) => 
      prev.includes(occasion) ? prev.filter((o) => o !== occasion) : [...prev, occasion]
    );
  };

  // Feature checkbox toggle in draft
  const handleToggleDraftFeature = (feature: string) => {
    setDraftFeatures((prev) => 
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  // Clear all filters action
  const handleClearAllFilters = () => {
    setDraftMinPrice(400);
    setDraftMaxPrice(4000);
    setDraftOccasions([]);
    setDraftFeatures([]);
    setAppliedMinPrice(400);
    setAppliedMaxPrice(4000);
    setAppliedOccasions([]);
    setAppliedFeatures([]);
    setFilterPanelOpen(false);
  };

  // Apply filters action
  const handleApplyFilters = () => {
    let min = Math.max(400, Math.min(draftMinPrice, draftMaxPrice));
    let max = Math.min(4000, Math.max(draftMinPrice, draftMaxPrice));
    if (min === max) {
      if (max < 4000) max += 100;
      else min -= 100;
    }
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
    setDraftMinPrice(min);
    setDraftMaxPrice(max);
    setAppliedOccasions([...draftOccasions]);
    setAppliedFeatures([...draftFeatures]);
    setFilterPanelOpen(false);
  };

  // Active filter count calculation
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (appliedMinPrice > 400 || appliedMaxPrice < 4000) count += 1;
    count += appliedOccasions.length;
    count += appliedFeatures.length;
    return count;
  }, [appliedMinPrice, appliedMaxPrice, appliedOccasions, appliedFeatures]);

  // Handle Sort Option selection
  const handleSelectSort = (option: SortOption) => {
    setSortBy(option);
    setSortPanelOpen(false);
  };

  // Filtered Acrylic Products
  const filteredProducts = useMemo(() => {
    return acrylicProducts.filter((product) => {
      // 1. Category filter
      if (selectedCategory !== 'all') {
        if (!isProductInAcrylicCategory(product, selectedCategory)) {
          return false;
        }
      }

      // 2. Price range filter
      if (product.price < appliedMinPrice || product.price > appliedMaxPrice) {
        return false;
      }

      // 3. Occasions filter (OR logic within occasions)
      if (appliedOccasions.length > 0) {
        const matchesOccasion = appliedOccasions.some(occ => 
          product.occasions?.includes(occ) ||
          product.tags?.some(t => t.toLowerCase() === occ.toLowerCase())
        );
        if (!matchesOccasion) {
          return false;
        }
      }

      // 4. Features filter (OR logic within features)
      if (appliedFeatures.length > 0) {
        const matchesFeature = appliedFeatures.some(feat => {
          if (feat === 'Personalized' && (product.customizable || product.uploadRequired)) return true;
          if (feat === 'Corporate Use' && (product.subcategory === 'Corporate' || product.subcategory === 'Signage' || product.tags?.includes('corporate'))) return true;
          return product.features?.some(pf => pf.toLowerCase().includes(feat.toLowerCase()));
        });
        if (!matchesFeature) {
          return false;
        }
      }

      // 5. Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesTags = product.tags?.some(t => t.toLowerCase().includes(q));
        const matchesMaterial = product.material?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTags && !matchesMaterial) {
          return false;
        }
      }

      return true;
    });
  }, [acrylicProducts, selectedCategory, appliedMinPrice, appliedMaxPrice, appliedOccasions, appliedFeatures, searchQuery]);

  // Sorted Products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'Price: Low to High':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'Newest First':
        list.sort((a, b) => new Date(b.createdAt || '2026-01-01').getTime() - new Date(a.createdAt || '2026-01-01').getTime());
        break;
      case 'Best Selling':
        list.sort((a, b) => ((b.bestseller || b.badge === 'Best Seller') ? 1 : 0) - ((a.bestseller || a.badge === 'Best Seller') ? 1 : 0));
        break;
      case 'Discount: High to Low':
        list.sort((a, b) => (b.discountPercent || b.discount || 0) - (a.discountPercent || a.discount || 0));
        break;
      case 'Customer Rating':
        list.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        break;
      case 'Name: A–Z':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Current active category tab object
  const currentCategoryTab = useMemo(() => {
    return ACRYLIC_CATEGORY_TABS.find(t => t.slug === selectedCategory) || ACRYLIC_CATEGORY_TABS[0];
  }, [selectedCategory]);

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope min-h-screen">
      
      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL ACRYLIC HERO SECTION                                      */}
      {/* ========================================================================= */}
      <section className="w-full bg-gradient-to-b from-[#FFFDF9] via-[#F8F9FA] to-white border-b border-stone-200/80 overflow-hidden">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 py-8 sm:py-12 lg:py-14">
          
          {/* Breadcrumb: Home > Acrylic */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
            <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-900">Acrylic</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Heading, Description, and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0E4A93] text-xs font-black tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#0E4A93]" />
                <span>Premium Optical Acrylic Glass</span>
              </div>

              {/* Exact Heading & Subtitle */}
              <div className="space-y-3">
                <h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight leading-tight"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
                >
                  Acrylic Prints &amp; Wall Art
                </h1>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
                  Turn your memories into crystal-clear luminous wall displays and freestanding desk blocks with premium optical acrylic.
                </p>
              </div>

              {/* Primary Action Buttons: [ SHOP ACRYLIC ] & [ CUSTOMIZE YOUR ACRYLIC ] */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const catalogEl = document.getElementById('acrylic-catalog');
                    if (catalogEl) {
                      catalogEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-6 py-3.5 bg-[#0E4A93] hover:bg-[#09356A] active:scale-[0.99] text-white text-xs sm:text-sm font-black rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>SHOP ACRYLIC</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/customize/acrylic/acrylic-rectangle-print')}
                  className="px-6 py-3.5 bg-[#E8752A] hover:bg-[#d6651d] active:scale-[0.99] text-white text-xs sm:text-sm font-black rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>CUSTOMIZE YOUR ACRYLIC</span>
                </button>
              </div>

              {/* Key Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-200/70 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Sub-Surface UV Inks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Diamond Polished</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">100% Moisture Proof</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Pan-India Delivery</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Acrylic Lifestyle Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-xl bg-stone-100 group aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
                <img
                  src="/assets/acrylic/acrylic-panel-living.jpg"
                  alt="Acrylic Prints and Wall Art in Living Room"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== '/assets/acrylic/acrylic-custom-wall-art.jpg') {
                      target.src = '/assets/acrylic/acrylic-custom-wall-art.jpg';
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Acrylic Gloss Glass Sheen Layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none" />

                {/* Floating Highlight Badge */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-stone-200/80 flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <div className="text-[11px] font-black text-stone-900 leading-tight">Crystal Clear Optical Acrylic</div>
                    <div className="text-[10px] text-stone-500">Starting from ₹899 | Up to 60% OFF</div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ACRYLIC PRODUCT CATEGORIES HORIZONTAL NAVIGATION                       */}
      {/* ========================================================================= */}
      <div id="acrylic-catalog" className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {ACRYLIC_CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.slug;
              // Compute dynamic product count for this acrylic category
              const count = tab.slug === 'all'
                ? acrylicProducts.length
                : acrylicProducts.filter(p => isProductInAcrylicCategory(p, tab.slug)).length;

              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => handleSelectCategory(tab.slug)}
                  className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0E4A93] text-white shadow-xs ring-2 ring-[#0E4A93]/20 font-bold'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-300 font-medium'
                  }`}
                >
                  <span>{tab.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-stone-200/80 text-stone-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TOP CONTROLS: HORIZONTAL FILTERS, SORT BUTTONS, & SEARCH               */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 pt-5 pb-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Action Buttons: FILTERS (Left) & SORT (Right) */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            
            {/* [ FILTERS ] Button */}
            <div className="relative">
              <button
                type="button"
                onClick={handleToggleFilterPanel}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer border ${
                  filterPanelOpen || activeFiltersCount > 0
                    ? 'bg-[#0E4A93] text-white border-[#0E4A93] shadow-sm'
                    : 'bg-white text-stone-800 border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                }`}
                aria-expanded={filterPanelOpen}
                aria-label="Toggle Filters"
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span>FILTERS</span>
                {activeFiltersCount > 0 && (
                  <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black ${
                    filterPanelOpen ? 'bg-amber-400 text-stone-900' : 'bg-[#0E4A93] text-white border border-white/40'
                  }`}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* [ SORT ] Button */}
            <div className="relative" ref={sortRef}>
              <button
                type="button"
                onClick={handleToggleSortPanel}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer border ${
                  sortPanelOpen
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-800 border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                }`}
                aria-expanded={sortPanelOpen}
                aria-label="Toggle Sort"
              >
                <ArrowUpDown className="w-4 h-4 shrink-0 text-stone-500" />
                <span>SORT: <span className="font-semibold text-stone-600">{sortBy}</span></span>
              </button>

              {/* SORT DROPDOWN PANEL (Closed by default, opens on click) */}
              {sortPanelOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-stone-100 text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
                    Sort Acrylic Products
                  </div>
                  <div className="p-1 space-y-0.5">
                    {SORT_OPTIONS.map((option) => {
                      const isSelected = sortBy === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSelectSort(option)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-50 text-[#0E4A93]'
                              : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                          }`}
                        >
                          <span>{option}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#0E4A93] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Search Box within Acrylic Prints */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by shape, name, or style..."
              className="w-full pl-8 pr-7 py-2 bg-white text-stone-900 placeholder-stone-400 rounded-xl border border-stone-300 focus:outline-none focus:border-[#0E4A93] text-xs transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. EXPANDABLE FILTER PANEL (Closed by default)                            */}
        {/* ========================================================================= */}
        {filterPanelOpen && (
          <div 
            ref={filterRef}
            className="mt-4 bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-7 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#0E4A93]" />
                <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">
                  Filter Acrylic Products
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFilterPanelOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
                aria-label="Close Filter Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* SECTION A: PRICE RANGE */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">
                  Price Range
                </span>
                
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                      Min Price
                    </label>
                    <div className="flex items-center px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl focus-within:border-[#0E4A93] focus-within:bg-white transition-colors">
                      <span className="text-stone-400 font-bold text-xs mr-1">₹</span>
                      <input
                        type="number"
                        min={400}
                        max={draftMaxPrice - 50}
                        step={50}
                        value={draftMinPrice}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setDraftMinPrice(val);
                        }}
                        onBlur={() => {
                          let val = Math.max(400, Math.min(draftMinPrice, draftMaxPrice - 100));
                          setDraftMinPrice(val);
                        }}
                        className="w-full bg-transparent text-xs font-bold text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                      Max Price
                    </label>
                    <div className="flex items-center px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl focus-within:border-[#0E4A93] focus-within:bg-white transition-colors">
                      <span className="text-stone-400 font-bold text-xs mr-1">₹</span>
                      <input
                        type="number"
                        min={draftMinPrice + 50}
                        max={4000}
                        step={50}
                        value={draftMaxPrice}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setDraftMaxPrice(val);
                        }}
                        onBlur={() => {
                          let val = Math.min(4000, Math.max(draftMaxPrice, draftMinPrice + 100));
                          setDraftMaxPrice(val);
                        }}
                        className="w-full bg-transparent text-xs font-bold text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>₹400</span>
                  <span>₹4,000</span>
                </div>
              </div>

              {/* SECTION B: SHOP BY OCCASION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                    Shop by Occasion
                  </span>
                  {draftOccasions.length > 0 && (
                    <span className="text-[11px] font-bold text-[#0E4A93]">
                      {draftOccasions.length} selected
                    </span>
                  )}
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {OCCASIONS_LIST.map((occasion) => {
                    const isChecked = draftOccasions.includes(occasion);
                    const matchCount = acrylicProducts.filter(p => 
                      p.occasions?.includes(occasion) || p.tags?.some(t => t.toLowerCase() === occasion.toLowerCase())
                    ).length;

                    return (
                      <label
                        key={occasion}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                          isChecked 
                            ? 'bg-blue-50/70 border border-blue-200 text-stone-900 font-bold' 
                            : 'hover:bg-stone-50 text-stone-700 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleDraftOccasion(occasion)}
                            className="w-4 h-4 rounded border-stone-300 text-[#0E4A93] focus:ring-[#0E4A93] accent-[#0E4A93] cursor-pointer"
                          />
                          <span>{occasion}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-stone-400 px-1.5 py-0.5 rounded-full bg-stone-100">
                          {matchCount}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION C: ACRYLIC FEATURES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                    Acrylic Features
                  </span>
                  {draftFeatures.length > 0 && (
                    <span className="text-[11px] font-bold text-[#0E4A93]">
                      {draftFeatures.length} selected
                    </span>
                  )}
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {FEATURES_LIST.map((feature) => {
                    const isChecked = draftFeatures.includes(feature);
                    const matchCount = acrylicProducts.filter(p => {
                      if (feature === 'Personalized' && (p.customizable || p.uploadRequired)) return true;
                      if (feature === 'Corporate Use' && (p.subcategory === 'Corporate' || p.subcategory === 'Signage' || p.tags?.includes('corporate'))) return true;
                      return p.features?.some(pf => pf.toLowerCase().includes(feature.toLowerCase()));
                    }).length;

                    return (
                      <label
                        key={feature}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                          isChecked 
                            ? 'bg-blue-50/70 border border-blue-200 text-stone-900 font-bold' 
                            : 'hover:bg-stone-50 text-stone-700 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleDraftFeature(feature)}
                            className="w-4 h-4 rounded border-stone-300 text-[#0E4A93] focus:ring-[#0E4A93] accent-[#0E4A93] cursor-pointer"
                          />
                          <span>{feature}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-stone-400 px-1.5 py-0.5 rounded-full bg-stone-100">
                          {matchCount}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* SECTION D: BOTTOM ACTION BUTTONS */}
            <div className="flex items-center justify-between pt-5 mt-6 border-t border-stone-100">
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>CLEAR ALL</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setFilterPanelOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="px-6 py-2.5 bg-[#0E4A93] hover:bg-[#09356A] text-white text-xs font-extrabold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  APPLY FILTERS
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Active Filters Pill Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3 pb-1">
            <span className="text-xs font-semibold text-stone-500">Active Filters:</span>
            
            {(appliedMinPrice > 400 || appliedMaxPrice < 4000) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 rounded-full text-xs font-medium">
                <span>₹{appliedMinPrice} – ₹{appliedMaxPrice}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedMinPrice(400);
                    setAppliedMaxPrice(4000);
                  }}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {appliedOccasions.map((occ) => (
              <span key={occ} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#0E4A93] rounded-full text-xs font-medium border border-blue-200/60">
                <span>{occ}</span>
                <button
                  type="button"
                  onClick={() => setAppliedOccasions(prev => prev.filter(o => o !== occ))}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {appliedFeatures.map((feat) => (
              <span key={feat} className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-medium border border-amber-200/60">
                <span>{feat}</span>
                <button
                  type="button"
                  onClick={() => setAppliedFeatures(prev => prev.filter(f => f !== feat))}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-xs font-bold text-[#0E4A93] hover:underline cursor-pointer ml-1"
            >
              Clear All
            </button>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 5. DYNAMIC PRODUCT COUNT & GRID                                           */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 py-4">
        
        {/* Dynamic Product Count Display */}
        <div className="flex items-center justify-between pb-4">
          <div className="text-sm text-stone-600 font-medium">
            {selectedCategory === 'all' ? (
              <>
                Showing <span className="font-extrabold text-stone-900">{sortedProducts.length}</span> of{' '}
                <span className="font-extrabold text-stone-900">{acrylicProducts.length}</span> Acrylic Products
              </>
            ) : (
              <>
                Showing <span className="font-extrabold text-stone-900">{sortedProducts.length}</span>{' '}
                <span className="font-extrabold text-[#0E4A93]">{currentCategoryTab.name}</span>
              </>
            )}
          </div>

          {selectedCategory !== 'all' && (
            <div className="text-xs text-stone-500 hidden sm:flex items-center gap-1.5">
              <span>Category:</span>
              <span className="font-bold text-[#0E4A93] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                {currentCategoryTab.name}
              </span>
            </div>
          )}
        </div>

        {/* ACRYLIC PRODUCT CARDS GRID */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
            {sortedProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const discount = product.discount || product.discountPercent || 25;
              const originalPrice = product.originalPrice || product.compareAtPrice || Math.round(product.price * 1.3);

              // Reviews calculations for this specific product
              const reviewsForProduct = productReviewsMap[product.id] || [];
              const totalReviewsCount = (product.reviewsCount || 24) + reviewsForProduct.filter(r => r.id.startsWith('rev-')).length;
              const averageRating = reviewsForProduct.length > 0
                ? Number((reviewsForProduct.reduce((acc, r) => acc + r.rating, 0) / reviewsForProduct.length).toFixed(1))
                : (product.rating || 4.8);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Image Container with Overlays */}
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden flex items-center justify-center p-3">
                    <Link to={`/products/${product.slug || product.id}`} className="block w-full h-full">
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        category="acrylic"
                        categorySlug="acrylic"
                        shape={product.shape}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Acrylic Gloss Glass Sheen Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none" />

                    {/* Top Left: Discount Badge Overlay */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      <span className="bg-[#E8752A] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs tracking-wide">
                        {discount}% OFF
                      </span>

                      {product.badge && product.badge !== 'Custom' && (
                        <span className="bg-[#0E4A93] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Top Right: Wishlist Heart Button Overlay */}
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xs cursor-pointer ${
                        isWishlisted
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white'
                      }`}
                      aria-label="Toggle Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                    </button>

                    {/* Bottom Left: Thickness / Style Tag */}
                    <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
                      {product.availableThicknesses?.[0] || '5mm'} Optical Acrylic
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      {/* Product Category Tag */}
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#0E4A93] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{product.subcategory || 'ACRYLIC PRINT'}</span>
                      </div>

                      {/* Product Title (clickable) */}
                      <Link to={`/products/${product.slug || product.id}`} className="block">
                        <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug group-hover:text-[#0E4A93] transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Description */}
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {product.shortDescription || product.description}
                      </p>
                    </div>

                    {/* Rating Summary Row (Clean display of rating and reviews count) */}
                    <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{averageRating}</span>
                      <span className="text-stone-400 font-normal">
                        ({totalReviewsCount} reviews)
                      </span>
                    </div>

                    {/* Price & Primary Purchase CTA Row */}
                    <div className="pt-2 border-t border-stone-100 space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg sm:text-xl font-extrabold text-stone-950">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-stone-400 line-through">
                            ₹{originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                          Save ₹{(originalPrice - product.price).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Two Action Buttons: [ CUSTOMIZE ] & [ ADD TO CART ] */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/customize/acrylic/${product.slug || product.id}`);
                          }}
                          className="py-2 px-2 bg-stone-100 hover:bg-[#0E4A93] hover:text-white text-[#0E4A93] border border-[#0E4A93]/30 active:scale-[0.99] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>CUSTOMIZE</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart(product);
                          }}
                          className="py-2 px-2 bg-[#0E4A93] hover:bg-[#09356A] active:scale-[0.99] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-white" />
                          <span>ADD TO CART</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0E4A93] flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-stone-900 text-lg">No Acrylic Products Found</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                We couldn&apos;t find any acrylic products matching the selected category or filters.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                handleSelectCategory('all');
                handleClearAllFilters();
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Category &amp; Filters</span>
            </button>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 6. WHY CHOOSE ACRYLIC PRINTS? (4 CLEAN BENEFITS SECTION)                  */}
      {/* ========================================================================= */}
      <section className="w-full bg-stone-50 border-t border-stone-200/80 py-12 sm:py-16 mt-8">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#0E4A93] uppercase tracking-wider">The Canvas India Difference</span>
            <h2 
              className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
            >
              Why Choose Acrylic Prints?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1.5">
              Engineered with cast monomer optical acrylic for gallery-grade depth, luminance, and longevity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Benefit 1 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0E4A93] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">1. Premium Quality</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Crystal clear and vibrant prints with direct 12-color sub-surface UV curing that captures high dynamic range and subtle gradients without banding.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#E8752A] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">2. Modern &amp; Elegant</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Enhances any space with frameless floating elegance. Polished diamond-beveled edges refract room lighting to create an immersive 3D depth effect.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">3. Fully Customizable</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your design, your way. Choose custom shapes, 18+ cut geometries, 5mm to 8mm thicknesses, desktop freestanding blocks, metallic paper, or floating wall studs.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">4. Perfect for Gifting</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Cherish weddings, anniversaries, and milestones forever. Acrylic glass will never discolor, oxidize, or warp under ambient humidity.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
export default AcrylicCategoryPage;
