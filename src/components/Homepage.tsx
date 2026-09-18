import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  SlidersHorizontal,
  MapPin,
  Award,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { PRIMARY_CATEGORIES } from '../data/storeData';
import { CreateSomethingNew } from './CreateSomethingNew';

export interface HomepageProps {
  onSelectCategory: (slug: string, sub?: string) => void;
  onAddToCart: (product: Product) => void;
  onCustomize: (product?: Product) => void;
  onOpenQuote: () => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCartCustom?: (customItem: {
    name: string;
    material: string;
    size: string;
    finish: string;
    text: string;
    price: number;
    image: string;
  }) => void;
  allProducts: Product[];
}

export const Homepage: React.FC<HomepageProps> = ({
  onSelectCategory,
  onAddToCart,
  onCustomize,
  onOpenQuote,
  wishlistIds,
  onToggleWishlist,
  allProducts,
}) => {
  const navigate = useNavigate();

  // Launch the full Canvas Studio customizer, same rich experience as Acrylic's
  const handleStartCreatingCanvas = () => {
    const firstCanvasProduct = allProducts.find((p) => p.categorySlug === 'canvas');
    navigate(`/customize/canvas/${firstCanvasProduct?.slug || firstCanvasProduct?.id || 'canvas-classic'}`);
  };

  // 6 Bestsellers for 6-col desktop layout
  const bestsellers = allProducts.slice(0, 6);

  // 7 Circular Categories from shared single source of truth
  const categories = PRIMARY_CATEGORIES;

  // Hero flash cards: a stack of photos where the front card flies off to the
  // top-right (like flicking through a physical stack of flash cards),
  // revealing the next one underneath. Advances on a timer AND on click.
  const heroFlashCards = [
    { name: 'Museum Cotton Canvas', image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&auto=format&fit=crop&q=80', alt: 'Personalized Canvas Wall Art' },
    { name: 'Crystal Acrylic Glass', image: '/assets/acrylic/acrylic-panel-living.jpg', alt: 'Acrylic Glass Photo Print' },
    { name: 'Eco Cork Board', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80', alt: 'Natural Cork Pinboard' },
    { name: 'Custom Photo Gifting', image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80', alt: 'Personalized Gift Print' },
  ];
  const FLY_DURATION_MS = 550;
  const AUTO_ADVANCE_MS = 2800;
  // stackOrder[0] is the index (into heroFlashCards) of the card currently on top
  const [stackOrder, setStackOrder] = useState(heroFlashCards.map((_, i) => i));
  const [flyingOut, setFlyingOut] = useState(false);

  const advanceFlashCard = () => {
    setFlyingOut(true);
  };

  // Once the fly-out animation finishes, send the front card to the back of the stack
  useEffect(() => {
    if (!flyingOut) return;
    const timeout = setTimeout(() => {
      setStackOrder((prev) => [...prev.slice(1), prev[0]]);
      setFlyingOut(false);
    }, FLY_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [flyingOut]);

  // Auto-advance on a timer, unless a card is already mid-flight
  useEffect(() => {
    const timer = setInterval(() => {
      if (!flyingOut) advanceFlashCard();
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [flyingOut]);

  // 6 Compact Occasions
  const occasions = [
    { name: 'Birthday', slug: 'gifts', sub: 'Birthday', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&auto=format&fit=crop&q=80' },
    { name: 'Anniversary', slug: 'gifts', sub: 'Anniversary', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80' },
    { name: 'Wedding', slug: 'gifts', sub: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80' },
    { name: 'Housewarming', slug: 'gifts', sub: 'Housewarming', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop&q=80' },
    { name: 'Diwali', slug: 'gifts', sub: 'Diwali', image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&auto=format&fit=crop&q=80' },
    { name: 'Corporate Gifts', slug: 'gifts', sub: 'Corporate Gifts', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="w-full bg-white text-[#111827] font-manrope selection:bg-orange-100 selection:text-[#E8752A]">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Georgia Italic Headline, Light clean background, Unboxed)*/}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-[#F7F9FC] to-[#F1F5FA] py-10 sm:py-14 lg:py-16 border-b border-stone-200/80">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: 55% (Editorial Typography, CTAs, Process) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8752A] tracking-wider uppercase bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60">
                <Sparkles className="w-3.5 h-3.5 text-[#E8752A]" />
                <span>Personalized Wall Art &amp; Custom Gifting</span>
              </div>

              {/* Large Editorial Georgia Italic Headline (Desktop 56px-66px) */}
              <h1 
                className="text-4xl sm:text-5xl lg:text-[58px] xl:text-[64px] font-bold italic text-[#111827] leading-[1.02] sm:leading-[1.04] tracking-tight font-serif"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
              >
                <span className="text-[#0E4A93] italic">Make it yours</span>
              </h1>

              {/* Subtext */}
              <div className="space-y-1 pt-1">
                <p className="text-sm sm:text-base font-semibold text-[#111827]">
                  Premium Canvas Prints Starting at ₹499
                </p>
                <p className="text-xs sm:text-sm text-stone-500 font-medium">
                  Upload your photo → Customize → Fast Pan-India Delivery
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-5 pt-2">
                <button
                  type="button"
                  onClick={handleStartCreatingCanvas}
                  className="px-6 py-3.5 bg-[#E8752A] hover:bg-[#D3631A] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Create Your Canvas →</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('bestsellers-unboxed');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 border border-stone-300 hover:border-[#0E4A93] bg-white text-[#111827] hover:text-[#0E4A93] text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Shop Best Sellers →</span>
                </button>
              </div>
            </div>

            {/* Right Column: 45% (Flash Card Stack — top card flies off to reveal the next) */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-[16/12]">
                {heroFlashCards.map((card, cardIdx) => {
                  const stackPos = stackOrder.indexOf(cardIdx);
                  const isFront = stackPos === 0;
                  const isFlying = isFront && flyingOut;

                  return (
                    <div
                      key={card.name}
                      onClick={isFront ? advanceFlashCard : undefined}
                      className={`absolute inset-0 rounded-2xl overflow-hidden shadow-lg bg-stone-100 border border-stone-200/80 ${
                        isFront ? 'cursor-pointer' : ''
                      } ${isFlying ? 'transition-all ease-in' : 'transition-all ease-out'}`}
                      style={{
                        transitionDuration: isFlying ? `${FLY_DURATION_MS}ms` : '500ms',
                        transform: isFlying
                          ? 'translate(160px, -190px) rotate(22deg) scale(0.7)'
                          : `translate(${stackPos * 14}px, ${stackPos * -14}px) scale(${1 - stackPos * 0.05})`,
                        opacity: isFlying ? 0 : stackPos < 3 ? 1 : 0,
                        zIndex: isFlying ? heroFlashCards.length + 1 : heroFlashCards.length - stackPos,
                      }}
                    >
                      <img
                        src={card.image}
                        alt={card.alt}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                      <div
                        className="absolute bottom-3 left-3 bg-[#0E4A93]/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-md shadow-sm transition-opacity duration-300 pointer-events-none"
                        style={{ opacity: isFront && !isFlying ? 1 : 0 }}
                      >
                        {card.name}
                      </div>
                    </div>
                  );
                })}

                {/* Progress dots */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                  {heroFlashCards.map((card, idx) => (
                    <span
                      key={card.name}
                      className={`h-1.5 rounded-full transition-all ${
                        stackOrder[0] === idx && !flyingOut ? 'w-5 bg-[#0E4A93]' : 'w-1.5 bg-stone-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. "CREATE SOMETHING NEW" (Positioned IMMEDIATELY after the Hero, White)  */}
      {/* ========================================================================= */}
      <CreateSomethingNew
        onStartCreating={handleStartCreatingCanvas}
        onSelectCategory={onSelectCategory}
      />

      {/* ========================================================================= */}
      {/* 3. USP STRIP (Immediately below Create Something New)                     */}
      {/* ========================================================================= */}
      <section className="bg-white py-4 sm:py-5 border-b border-stone-200/80">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="flex items-center justify-center sm:justify-start gap-3 md:border-r md:border-stone-200 md:pr-4">
              <Truck className="w-5 h-5 text-[#E8752A] shrink-0" strokeWidth={1.8} />
              <div className="text-left">
                <div className="text-xs sm:text-sm font-semibold text-[#111827]">Free Delivery</div>
                <div className="text-[11px] text-stone-500">Above ₹999 pan-India</div>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 md:border-r md:border-stone-200 md:pr-4">
              <SlidersHorizontal className="w-5 h-5 text-[#E8752A] shrink-0" strokeWidth={1.8} />
              <div className="text-left">
                <div className="text-xs sm:text-sm font-semibold text-[#111827]">Easy Customization</div>
                <div className="text-[11px] text-stone-500">In 3 simple steps</div>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 md:border-r md:border-stone-200 md:pr-4">
              <ShieldCheck className="w-5 h-5 text-[#E8752A] shrink-0" strokeWidth={1.8} />
              <div className="text-left">
                <div className="text-xs sm:text-sm font-semibold text-[#111827]">Secure Payments</div>
                <div className="text-[11px] text-stone-500">UPI, Cards &amp; NetBanking</div>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <MapPin className="w-5 h-5 text-[#E8752A] shrink-0" strokeWidth={1.8} />
              <div className="text-left">
                <div className="text-xs sm:text-sm font-semibold text-[#111827]">Pan-India Delivery</div>
                <div className="text-[11px] text-stone-500">19,000+ pin codes</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SHOP BY CATEGORY (Circular image thumbnails, 7 primary categories)      */}
      {/* ========================================================================= */}
      <section id="shop-categories" className="py-10 sm:py-12 bg-white border-b border-stone-200/80">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          
          <div className="flex items-end justify-between gap-4 mb-6">
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                Shop by Category
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Explore custom formats crafted for Indian home walls and desk decor
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="text-xs sm:text-sm font-bold text-[#0E4A93] hover:underline cursor-pointer whitespace-nowrap"
            >
              View All →
            </button>
          </div>

          {/* 7 Circular Category Thumbnails */}
          <div className="flex items-start justify-between gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className="group flex flex-col items-center text-center shrink-0 w-24 sm:w-28 cursor-pointer focus:outline-none"
              >
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden bg-stone-100 border-2 border-stone-200 group-hover:border-[#0E4A93] transition-all group-hover:scale-105 shadow-xs">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
                <span className="mt-2 text-xs font-semibold text-[#111827] group-hover:text-[#0E4A93] transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BESTSELLING PRODUCTS (6-Column Compact Unboxed Grid)                   */}
      {/* ========================================================================= */}
      <section id="bestsellers-unboxed" className="py-10 sm:py-12 bg-[#F7F8FA] border-b border-stone-200/80">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          
          <div className="flex items-end justify-between gap-4 mb-6">
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                Bestselling Products
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Most loved personalized prints and home decor pieces
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="text-xs sm:text-sm font-bold text-[#0E4A93] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 6-Column Clean Product Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
            {bestsellers.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                isWishlisted={wishlistIds.includes(prod.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onCustomize={onCustomize}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SHOP BY OCCASION (Compact Visual Links, Box-Free)                      */}
      {/* ========================================================================= */}
      <section id="shop-occasions" className="py-10 sm:py-12 bg-white border-b border-stone-200/80">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          
          <div className="mb-6 text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
              Shop by Occasion
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Thoughtful personalized gifts for life's most precious celebrations
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {occasions.map((occ) => (
              <div
                key={occ.name}
                onClick={() => onSelectCategory(occ.slug, occ.sub)}
                className="group cursor-pointer text-left"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 mb-2 border border-stone-200 shadow-2xs">
                  <img
                    src={occ.image}
                    alt={occ.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="font-semibold text-xs sm:text-sm text-[#111827] group-hover:text-[#0E4A93] transition-colors">
                  {occ.name}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. WHY CUSTOMERS CHOOSE CANVAS INDIA                                      */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-14 bg-[#F7F8FA] border-b border-stone-200/80">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
              Why Customers Choose Canvas India
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Crafted in India with uncompromising attention to color fidelity and craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Award className="w-6 h-6 text-[#0E4A93] mb-2.5" strokeWidth={1.8} />
              <h3 className="font-bold text-sm text-[#111827]">Premium Quality</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed max-w-xs">
                Fade-resistant prints on museum-grade 380 GSM cotton canvas and crystal acrylic.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <SlidersHorizontal className="w-6 h-6 text-[#0E4A93] mb-2.5" strokeWidth={1.8} />
              <h3 className="font-bold text-sm text-[#111827]">Easy Customization</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed max-w-xs">
                Personalize directly in minutes with instant live preview and resolution checks.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Truck className="w-6 h-6 text-[#0E4A93] mb-2.5" strokeWidth={1.8} />
              <h3 className="font-bold text-sm text-[#111827]">Pan-India Delivery</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed max-w-xs">
                Across 19,000+ pincodes with 48-hour dispatch and sturdy multi-layer transit packing.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <ShieldCheck className="w-6 h-6 text-[#0E4A93] mb-2.5" strokeWidth={1.8} />
              <h3 className="font-bold text-sm text-[#111827]">Secure Payments</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed max-w-xs">
                100% safe checkout with UPI, credit/debit cards, NetBanking and GST invoices.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BULK & CORPORATE ORDERS                                                */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Corporate Imagery */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative aspect-[4/3] w-full max-w-md rounded-2xl overflow-hidden shadow-md bg-stone-100 border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80"
                  alt="Office Wall Art & Bulk Corporate Gifts"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Headline, supporting points, quote actions */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E4A93] tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                <span>Enterprise &amp; Events</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                Bulk &amp; Corporate Orders
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
                Custom branded wall displays, employee milestone rewards, client hampers, and hotel gallery art.
              </p>

              {/* Supporting Points */}
              <div className="flex flex-wrap items-center gap-6 pt-1 text-xs font-semibold text-[#111827]">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#E8752A]" />
                  <span>Custom Branding</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#E8752A]" />
                  <span>Tiered Bulk Pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#E8752A]" />
                  <span>Pan-India Multi-Address Delivery</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    window.open('https://wa.me/917893051555?text=Hi%20Canvas%20India%2C%20I%20would%20like%20to%20talk%20about%20a%20corporate%20order', '_blank');
                  }}
                  className="px-6 py-3 border border-stone-300 text-[#111827] hover:border-[#0E4A93] hover:text-[#0E4A93] text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Talk to Our Team
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
