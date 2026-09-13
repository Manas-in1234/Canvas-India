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
  Gift
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from '../components/ProductImage';
import { Product } from '../types';

const ACRYLIC_CHIPS = [
  'All Acrylic Products',
  'Photo Panels',
  'Wall Art',
  'Posters',
  'Artwork',
  'Signage',
  'Decorative Panels',
  'Corporate',
  'Office Graphics',
  'Gifts'
];

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
  | 'Customer Rating';

const SORT_OPTIONS: SortOption[] = [
  'Price: Low to High',
  'Price: High to Low',
  'Newest First',
  'Best Selling',
  'Discount: High to Low',
  'Customer Rating'
];

export const AcrylicCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    allProducts, 
    wishlistIds, 
    onToggleWishlist, 
    onOpenCustomize,
    onAddToCart 
  } = useShop();

  // Subcategory state
  const initialSub = searchParams.get('sub') || 'All Acrylic Products';
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSub);
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

  // Ref for panels outside click detection
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Sync subcategory with URL
  useEffect(() => {
    const sub = searchParams.get('sub');
    if (sub && ACRYLIC_CHIPS.some(c => c.toLowerCase() === sub.toLowerCase())) {
      const matched = ACRYLIC_CHIPS.find(c => c.toLowerCase() === sub.toLowerCase());
      if (matched) setSelectedSubcategory(matched);
    } else if (!sub) {
      setSelectedSubcategory('All Acrylic Products');
    }
  }, [searchParams]);

  useEffect(() => {
    document.title = 'Acrylic Prints & Acrylic Wall Art | Canvas India';
    window.scrollTo(0, 0);
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
      setSortPanelOpen(false); // Close sort if open
      setFilterPanelOpen(true);
    } else {
      setFilterPanelOpen(false);
    }
  };

  const handleToggleSortPanel = () => {
    if (!sortPanelOpen) {
      setFilterPanelOpen(false); // Close filter if open
      setSortPanelOpen(true);
    } else {
      setSortPanelOpen(false);
    }
  };

  const handleSelectSub = (sub: string) => {
    setSelectedSubcategory(sub);
    if (sub === 'All Acrylic Products') {
      searchParams.delete('sub');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ sub }, { replace: true });
    }
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
      // 1. Subcategory filter
      if (selectedSubcategory !== 'All Acrylic Products') {
        const sel = selectedSubcategory.toLowerCase();
        const matchesSubcategory = product.subcategory?.toLowerCase() === sel;
        const matchesTag = product.tags?.some(t => t.toLowerCase() === sel || sel.includes(t.toLowerCase()));
        if (!matchesSubcategory && !matchesTag) {
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
        if (!matchesName && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [acrylicProducts, selectedSubcategory, appliedMinPrice, appliedMaxPrice, appliedOccasions, appliedFeatures, searchQuery]);

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
      default:
        break;
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Primary Card Purchase CTA Handler
  const handleCardCta = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.uploadRequired) {
      // Personalized / photo upload item -> opens customization studio
      onOpenCustomize(product);
    } else {
      // Standard item -> add directly to cart with immediate drawer feedback
      onAddToCart(product);
    }
  };

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope min-h-screen">
      
      {/* ========================================================================= */}
      {/* 1. ACRYLIC PAGE HEADER                                                    */}
      {/* ========================================================================= */}
      <div className="w-full border-b border-stone-200 bg-white">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 pt-4 pb-8 sm:pb-10">
          
          {/* Breadcrumb: Home > Acrylic */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-5">
            <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-900">Acrylic</span>
          </nav>

          {/* Heading & Subtitle */}
          <div className="max-w-4xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-[#0E4A93] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#0E4A93]" />
              <span>Crystal Optical Acrylic Glass</span>
            </div>

            <h1 
              className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight leading-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
            >
              Acrylic Prints &amp; Acrylic Wall Art
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              For a modern, elegant and premium appearance, acrylic prints provide sharp imagery and vibrant visual impact.
            </p>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-stone-100 mt-6 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">Direct Sub-Surface UV Inks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">Diamond-Polished Bevels</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">100% Moisture &amp; UV Proof</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">Floating Wall Studs Included</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUBCATEGORY PILLS / TABS                                               */}
      {/* ========================================================================= */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {ACRYLIC_CHIPS.map((chip) => {
              const isActive = selectedSubcategory.toLowerCase() === chip.toLowerCase();
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSelectSub(chip)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0E4A93] text-white shadow-xs ring-2 ring-[#0E4A93]/20 font-bold'
                      : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TOP CONTROLS: HORIZONTAL FILTERS & SORT BUTTONS                        */}
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
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left font-medium transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 text-[#0E4A93] font-bold'
                              : 'text-stone-700 hover:bg-stone-100'
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
              placeholder="Search acrylic prints..."
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                    Price Range
                  </span>
                  <span className="text-xs font-bold text-[#0E4A93]">
                    ₹{draftMinPrice.toLocaleString('en-IN')} – ₹{draftMaxPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Dual-ended range slider track */}
                <div className="relative pt-3 pb-2 px-1">
                  <div className="relative h-2 bg-stone-200 rounded-full">
                    {/* Active highlight segment between min and max */}
                    <div 
                      className="absolute h-2 bg-[#0E4A93] rounded-full"
                      style={{
                        left: `${((draftMinPrice - 400) / (4000 - 400)) * 100}%`,
                        right: `${100 - ((draftMaxPrice - 400) / (4000 - 400)) * 100}%`
                      }}
                    />
                  </div>

                  {/* Dual input range thumbs */}
                  <input
                    type="range"
                    min={400}
                    max={4000}
                    step={50}
                    value={draftMinPrice}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), draftMaxPrice - 100);
                      setDraftMinPrice(val);
                    }}
                    className="absolute inset-0 w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer accent-[#0E4A93] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0E4A93] [&::-webkit-slider-thumb]:shadow-md"
                  />
                  <input
                    type="range"
                    min={400}
                    max={4000}
                    step={50}
                    value={draftMaxPrice}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), draftMinPrice + 100);
                      setDraftMaxPrice(val);
                    }}
                    className="absolute inset-0 w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer accent-[#0E4A93] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0E4A93] [&::-webkit-slider-thumb]:shadow-md"
                  />
                </div>

                {/* Synchronized Min & Max Price numeric inputs */}
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
                    // Match count for badge
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
                    // Match count for badge
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
                  <X className="w-3 h-3" />
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
                  <X className="w-3 h-3" />
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
                  <X className="w-3 h-3" />
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
            Showing <span className="font-extrabold text-stone-900">{sortedProducts.length}</span> of <span className="font-extrabold text-stone-900">{acrylicProducts.length}</span> Acrylic Products
          </div>

          {selectedSubcategory !== 'All Acrylic Products' && (
            <div className="text-xs text-stone-500 hidden sm:block">
              Category: <span className="font-bold text-[#0E4A93]">{selectedSubcategory}</span>
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

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Image Container with Overlays */}
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    <Link to={`/products/${product.id}`} className="block w-full h-full">
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        category="acrylic"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      {/* Category Tag */}
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#0E4A93]">
                        {product.subcategory || 'ACRYLIC PRINTS'}
                      </div>

                      {/* Product Title (clickable) */}
                      <Link to={`/products/${product.id}`} className="block">
                        <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug group-hover:text-[#0E4A93] transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Description */}
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {product.shortDescription || product.description}
                      </p>
                    </div>

                    {/* Rating & Sizes Row */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating || '4.9'}</span>
                        <span className="text-stone-400 font-normal">({product.reviewsCount || 48})</span>
                      </div>

                      <div className="text-[11px] text-stone-500">
                        <span className="font-semibold text-stone-700">Sizes:</span> {product.availableSizes?.slice(0, 2).join(', ')}...
                      </div>
                    </div>

                    {/* Price & Primary Purchase CTA Row */}
                    <div className="pt-3 border-t border-stone-100 space-y-3">
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

                      {/* CRITICAL RULE: EXACTLY ONE PRIMARY PURCHASE CTA BUTTON PER CARD */}
                      <button
                        type="button"
                        onClick={(e) => handleCardCta(e, product)}
                        className="w-full py-2.5 px-3 bg-[#0E4A93] hover:bg-[#09356A] active:scale-[0.99] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-white" />
                        <span>ADD TO CART</span>
                      </button>
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
                We couldn&apos;t find any acrylic products matching the selected filters.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="px-5 py-2.5 bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
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
                Your design, your way. Choose custom millimetre sizes, 7mm to 18mm thicknesses, desktop freestanding blocks, metallic paper, or floating wall studs.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">4. Perfect for Gifting</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Personalized memories that last. Solid acrylic photo blocks make memorable gifts for weddings, anniversaries, birthdays, housewarmings, and awards.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MADE FOR MODERN SPACES / WHERE ACRYLIC PRINTS WORK BEST                */}
      {/* ========================================================================= */}
      <section className="w-full bg-white border-t border-stone-200 py-12 sm:py-16">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            
            {/* Left Description */}
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E4A93]">Architectural Aesthetics</span>
                <h2 
                  className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
                >
                  Made for Modern Spaces
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Unlike traditional glass frames that trap glare and break easily, optical cast acrylic delivers stunning shatterproof clarity and deep luminous saturation. Each piece is manufactured in our Hyderabad facility and hand-inspected for zero blemishes before dispatch.
                </p>
              </div>

              {/* Where Acrylic Works Best Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70">
                  <div className="font-bold text-stone-900 text-xs sm:text-sm">Living &amp; Dining Rooms</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Large-format statement wall panels</div>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70">
                  <div className="font-bold text-stone-900 text-xs sm:text-sm">Executive Offices</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Corporate branding &amp; directories</div>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70">
                  <div className="font-bold text-stone-900 text-xs sm:text-sm">Work Desks &amp; Shelves</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Freestanding 18mm crystal blocks</div>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70">
                  <div className="font-bold text-stone-900 text-xs sm:text-sm">Hotels &amp; Galleries</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Museum-grade floating standoff art</div>
                </div>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-lg aspect-[16/10] bg-stone-100">
              <ProductImage
                src="/assets/acrylic/acrylic-panel-living.jpg"
                alt="Acrylic wall art installed in modern luxury room"
                category="acrylic"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Modern Architecture</span>
                <div className="text-lg font-bold">Luminous Depth in Natural Sunlight</div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
export default AcrylicCategoryPage;
