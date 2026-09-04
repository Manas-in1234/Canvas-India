import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Upload,
  Percent,
  Layers,
  ShieldCheck,
  Star
} from 'lucide-react';

interface HeroBannerProps {
  onShopCanvas: () => void;
  onCreateCustomArt: () => void;
}

interface SlideData {
  id: string;
  badge: string;
  heading: string;
  subheading: string;
  highlightText: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  bannerImage: string;
  discountBadge: string;
  priceNote: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopCanvas,
  onCreateCustomArt,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: SlideData[] = [
    {
      id: 'canvas-slide',
      badge: '🇮🇳 FLAT 50% OFF • FESTIVE OFFER',
      heading: 'TURN YOUR MEMORIES INTO WALL ART',
      subheading: 'Premium Canvas, Acrylic & Cork Prints • Handcrafted in India for Modern Homes & Spaces',
      highlightText: 'Museum-grade 420 GSM cotton canvas hand-stretched on solid pine frames.',
      ctaPrimaryText: 'SHOP CANVAS',
      ctaSecondaryText: 'CREATE CUSTOM ART',
      bannerImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
      discountBadge: '50% OFF',
      priceNote: 'Starting from ₹299',
    },
    {
      id: 'acrylic-slide',
      badge: '✨ OPTICAL CAST BRILLIANCE',
      heading: 'CRYSTAL CLARITY FOR MODERN WALLS',
      subheading: 'High-definition sub-surface UV prints behind 92% optical acrylic with diamond-milled edges.',
      highlightText: 'Shatterproof cast acrylic with brushed stainless steel floating standoffs.',
      ctaPrimaryText: 'SHOP ACRYLIC',
      ctaSecondaryText: 'CUSTOM SIZE ACRYLIC',
      bannerImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
      discountBadge: 'UP TO 45% OFF',
      priceNote: 'Starting from ₹599',
    },
    {
      id: 'cork-slide',
      badge: '🌿 SUSTAINABLE & FUNCTIONAL',
      heading: 'SELF-HEALING CORK & ACOUSTIC TILES',
      subheading: 'Natural Portuguese cork pinboards and geometric hexagon wall art for creative workspaces.',
      highlightText: 'Class-A acoustic sound dampening with self-healing grain that leaves zero pin marks.',
      ctaPrimaryText: 'SHOP CORK BOARDS',
      ctaSecondaryText: 'EXPLORE ACOUSTIC TILES',
      bannerImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
      discountBadge: 'FLAT 40% OFF',
      priceNote: 'Starting from ₹499',
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative bg-gradient-to-b from-[var(--accent-bg)]/50 via-white to-stone-50 border-b border-stone-200 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Promotional Banner Box (430 - 520px height) */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#0F243E] via-[#16385d] to-[#1e4976] text-white shadow-xl overflow-hidden min-h-[430px] lg:min-h-[480px] flex flex-col justify-between">
          
          {/* Subtle decorative background glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--accent)]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Main Grid: Left Copy & Right Product Visual Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-6 sm:p-10 lg:p-12 items-center flex-1 z-10">
            
            {/* LEFT COLUMN: Large Promotional Copy (approx 7 cols) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{slide.badge}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase font-sans">
                {slide.heading}
              </h1>

              {/* Subheading */}
              <p className="text-stone-200 text-sm sm:text-base lg:text-lg max-w-xl font-normal leading-relaxed">
                {slide.subheading}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onShopCanvas}
                  className="px-6 sm:px-8 py-3.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-light)] active:bg-[var(--accent-hover)] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[var(--accent-hover)]/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                >
                  <span>{slide.ctaPrimaryText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onCreateCustomArt}
                  className="px-6 sm:px-8 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-white/30 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-amber-300" />
                  <span>{slide.ctaSecondaryText}</span>
                </button>
              </div>

              {/* Promotional Highlights Checkmarks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/15 text-xs text-stone-200 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>Premium Printing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>Made in India</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>Custom Sizes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>Pan-India Delivery</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Large Visual Composition (approx 5 cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Product Mockup Container */}
              <div className="relative w-full max-w-md lg:max-w-none aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border-4 border-white/20 group">
                <img
                  src={slide.bannerImage}
                  alt={slide.heading}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlaid Price & Offer Floating Badge */}
                <div className="absolute top-4 right-4 bg-[var(--accent)] text-white px-3 py-1.5 rounded-lg shadow-lg font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-white" />
                  <span>{slide.discountBadge}</span>
                </div>

                {/* Overlaid Bottom Starting Price Label */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-lg text-white flex items-center justify-between border border-white/15">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-light)] animate-ping" />
                    <span className="text-xs font-bold text-stone-100">{slide.priceNote}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>4.9 (1,200+ Reviews)</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Carousel Navigation: Arrows & Dots */}
          <div className="p-4 bg-black/20 backdrop-blur-xs border-t border-white/10 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
