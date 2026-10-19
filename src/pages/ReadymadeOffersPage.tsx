import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  X,
  RotateCcw,
  FilterX,
  CheckCircle2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CATALOGUE_PRODUCTS } from '../data/catalogueProducts';
import { CATALOGUE_CANVAS_ACRYLIC_PRODUCTS } from '../data/catalogueCanvasAcrylicProducts';
import { Product } from '../types';

const SERIF = '"Playfair Display", Georgia, serif';
const BLUE = '#0E4A93';
const ORANGE = '#E8752A';

const PRICE_MIN_DEFAULT = 200;
const PRICE_MAX_DEFAULT = 700;

// Ready-made, pre-designed products — a fixed artwork printed to your chosen
// size/material, as opposed to a custom photo-upload Canvas/Acrylic order.
// All 850 currently carry a real discount (25-29% off), so this whole set
// doubles as "products on offer".
const READYMADE_PRODUCTS: Product[] = [...CATALOGUE_PRODUCTS, ...CATALOGUE_CANVAS_ACRYLIC_PRODUCTS];

interface ReadymadeCategory {
  label: string;
  match: (p: Product) => boolean;
}

const READYMADE_CATEGORIES: ReadymadeCategory[] = [
  { label: 'Tribal & Ethnic Art', match: (p) => p.categorySlug === 'tribal-ethnic-art' },
  { label: 'Devotional Art', match: (p) => p.categorySlug === 'devotional-art' },
  { label: 'Line Art', match: (p) => p.categorySlug === 'line-art' },
  { label: 'Motivational Posters', match: (p) => p.categorySlug === 'motivational-posters' },
  { label: 'Scenery & Landscape Art', match: (p) => p.categorySlug === 'scenery-landscape-art' },
  { label: 'Cork Art Patterns', match: (p) => p.categorySlug === 'cork-art-patterns' },
  { label: 'Canvas Reproductions', match: (p) => p.categorySlug === 'canvas' && p.subcategory === 'Artistic Reproductions' },
  { label: 'Acrylic Wall Art', match: (p) => p.categorySlug === 'acrylic' && p.subcategory === 'Acrylic Wall Art' },
];

const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 ${className}`}>{children}</div>
);

// Dedicated listing for ready-to-ship, pre-designed products on offer — the
// counterpart to the "Create Your Canvas" custom-photo flow.
export const ReadymadeOffersPage: React.FC = () => {
  const { wishlistIds, onAddToCart, onOpenCustomize, onToggleWishlist } = useShop();

  useEffect(() => {
    document.title = 'Special Price Offers — Ready-Made Prints | Canvas India';
  }, []);

  const [minPrice, setMinPrice] = useState<number>(PRICE_MIN_DEFAULT);
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX_DEFAULT);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const handleResetFilters = () => {
    setMinPrice(PRICE_MIN_DEFAULT);
    setMaxPrice(PRICE_MAX_DEFAULT);
    setSelectedCategories([]);
  };

  const isFiltered = minPrice > PRICE_MIN_DEFAULT || maxPrice < PRICE_MAX_DEFAULT || selectedCategories.length > 0;

  const filteredProducts = useMemo(() => {
    const activeCategoryMatchers = READYMADE_CATEGORIES.filter((c) => selectedCategories.includes(c.label));
    return READYMADE_PRODUCTS.filter((p) => {
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (activeCategoryMatchers.length > 0 && !activeCategoryMatchers.some((c) => c.match(p))) return false;
      return true;
    });
  }, [minPrice, maxPrice, selectedCategories]);

  const FilterSidebarContent: React.FC = () => (
    <>
      <div className="space-y-3.5 pb-5 border-b border-stone-100">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wide text-stone-900">Price Range</span>
          <span className="text-[11px] font-semibold text-[#0E4A93]">
            ₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')}
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
          aria-label="Price range slider"
        />
      </div>

      <div className="space-y-3 pt-5">
        <span className="font-bold text-xs uppercase tracking-wide text-stone-900 block">Shop by Category</span>
        <p className="text-[10px] text-stone-400 -mt-1.5">Check more than one to view them together.</p>
        <div className="space-y-1">
          {READYMADE_CATEGORIES.map((cat) => {
            const isChecked = selectedCategories.includes(cat.label);
            return (
              <label
                key={cat.label}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:bg-stone-50 text-stone-700"
              >
                <span
                  className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                    isChecked ? 'bg-[#0E4A93] border-[#0E4A93]' : 'bg-white border-stone-300'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-3 h-3 text-white" />}
                </span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCategory(cat.label)}
                  className="sr-only"
                />
                <span className="flex-1">{cat.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope">

      {/* HERO */}
      <section className="w-full bg-gradient-to-br from-[#FDFBF7] via-[#F6EFE1] to-[#F3E3CB] border-b border-stone-200/60 overflow-hidden">
        <Container className="py-8 sm:py-12 lg:py-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
            <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-900">Special Price Offers</span>
          </nav>

          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EA580C]/10 border border-[#EA580C]/30 text-[#EA580C] text-xs font-black uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Special Price • Up to 29% Off</span>
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-3"
              style={{ fontFamily: SERIF }}
            >
              <span style={{ color: BLUE }}>Ready-Made </span>
              <em className="font-semibold italic" style={{ color: ORANGE }}>Offers</em>
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Pre-designed art prints, canvas and acrylic reproductions — ready to ship in your chosen size, no photo upload needed.
            </p>
          </div>
        </Container>
      </section>

      {/* PRODUCT LISTING */}
      <section className="w-full py-8 sm:py-12 border-b border-stone-200/80">
        <Container>

          <div className="lg:hidden flex items-center justify-end pb-6 mb-6 border-b border-stone-200">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-xs font-bold text-stone-800 hover:border-[#0E4A93] shadow-2xs cursor-pointer"
              aria-label="Open filter sidebar"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0E4A93]" />
              <span>Filters</span>
              {isFiltered && <span className="w-2 h-2 rounded-full bg-[#E8752A]"></span>}
            </button>
          </div>

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
              <FilterSidebarContent />
            </aside>

            <main className="lg:col-span-9">
              <div className="flex items-center justify-between pb-4 mb-4 text-xs font-semibold text-stone-600 border-b border-stone-100">
                <div>
                  Showing <span className="text-stone-900 font-bold">{filteredProducts.length}</span> of {READYMADE_PRODUCTS.length} Products
                </div>
                {isFiltered && (
                  <div className="text-[11px] text-[#0E4A93] font-bold">Filtered view active</div>
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
                    <h3 className="text-lg font-bold text-stone-900">No Products Match Filters</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Try widening your price range or clearing category selections.
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
        </Container>
      </section>

      {/* MOBILE FILTER DRAWER */}
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
                <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">Filter Products</h3>
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
              <FilterSidebarContent />
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

      {/* TRUST STRIP */}
      <section className="py-6 sm:py-8">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-2 justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Ready-Made, No Upload Needed</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Premium Archival Printing</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Free Insured Delivery on ₹999+</span>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
};

export default ReadymadeOffersPage;
