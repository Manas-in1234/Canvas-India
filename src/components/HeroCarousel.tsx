import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Check, Layers, Shield, Eye } from 'lucide-react';

interface HeroCarouselProps {
  onOpenQuote: (material?: 'canvas' | 'acrylic' | 'cork') => void;
  onExploreProducts: () => void;
  onSelectCategory?: (category: 'canvas' | 'acrylic' | 'cork') => void;
  variant?: 'orange-signature' | 'editorial' | 'commerce';
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onOpenQuote,
  onExploreProducts,
  onSelectCategory,
  variant = 'orange-signature',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 'canvas',
      materialKey: 'canvas' as const,
      eyebrow: 'SLIDE 1 — CANVAS',
      slideHeadline: 'TURN MEMORIES INTO ART.',
      description:
        'Premium canvas prints designed for your walls, spaces and stories. Museum-grade 420 GSM pure cotton archival canvas hand-stretched over bevelled kiln-dried pine.',
      ctaText: 'Explore Canvas',
      stats: [
        { label: 'Archival Rating', value: '100+ Years' },
        { label: 'Standard Depth', value: '1.75" Pine' },
        { label: 'Turnaround', value: '48-72 Hours' },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
      badge: 'Archival Canvas Art',
      accentColor: 'text-[var(--accent)]',
      tagColor: 'bg-[var(--accent-bg)] text-[var(--accent-hover)] border-[var(--accent-border)]',
    },
    {
      id: 'acrylic',
      materialKey: 'acrylic' as const,
      eyebrow: 'SLIDE 2 — ACRYLIC',
      slideHeadline: 'MAKE YOUR SPACE STAND OUT.',
      description:
        'Modern acrylic displays with clarity, depth and premium finishing. Cast optical acrylic with diamond-milled edges and direct sub-surface UV printing.',
      ctaText: 'Explore Acrylic',
      stats: [
        { label: 'Light Clarity', value: '92% Transmittance' },
        { label: 'Hardware', value: 'Brushed Standoffs' },
        { label: 'Edge Finish', value: 'Diamond Polished' },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
      badge: 'Optical Acrylic Frame',
      accentColor: 'text-sky-600',
      tagColor: 'bg-sky-100 text-sky-700 border-sky-200',
    },
    {
      id: 'cork',
      materialKey: 'cork' as const,
      eyebrow: 'SLIDE 3 — CORK',
      slideHeadline: 'TEXTURE MEETS FUNCTION.',
      description:
        'Natural cork solutions for creative, functional spaces. Sustainably harvested regenerative cork for acoustic wall cladding, executive pinboards, and statement panels.',
      ctaText: 'Explore Cork',
      stats: [
        { label: 'Sound NRC', value: 'Class-A Rating' },
        { label: 'Origin', value: '100% Portuguese' },
        { label: 'Feature', value: 'Self-Healing Bark' },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      badge: 'Sustainable Cork Board',
      accentColor: 'text-amber-600',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
  ];

  // Subtle automatic slide
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const slide = slides[currentSlide];

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      id="hero"
      className="relative bg-gradient-to-b from-stone-50 via-white to-stone-50 border-b border-stone-200/80 overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Subtle Geometric Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1c1917 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        {/* Split Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Typography, Value Proposition & CTA Stack */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Top Eyebrow Chip with Carousel Indicator */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${slide.tagColor} flex items-center gap-1.5`}>
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{slide.eyebrow}</span>
              </span>
              <span className="text-stone-400 text-xs font-mono">
                0{currentSlide + 1} / 0{slides.length}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.08]">
                BRING YOUR <br />
                <span className="text-[var(--accent)] underline decoration-[var(--accent-border)] decoration-wavy decoration-2 underline-offset-8">
                  IDEAS TO LIFE.
                </span>
              </h1>

              {/* Dynamic Slide Sub-headline */}
              <div className="flex items-center gap-2 pt-1">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                <h2 className="text-lg sm:text-xl font-bold text-stone-800 tracking-wide">
                  {slide.slideHeadline}
                </h2>
              </div>

              {/* Supporting Text */}
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl">
                Premium Canvas, Acrylic &amp; Cork products made for modern Indian spaces.
                {slide.description}
              </p>
            </div>

            {/* Primary & Secondary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(slide.materialKey);
                  }
                  onExploreProducts();
                }}
                className="px-6 sm:px-8 py-3.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:bg-[var(--accent-hover)] text-white font-bold text-sm sm:text-base shadow-lg shadow-[var(--accent)]/25 hover:shadow-xl hover:shadow-[var(--accent)]/35 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onOpenQuote(slide.materialKey)}
                className="px-6 sm:px-8 py-3.5 rounded-full bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-800 font-bold text-sm sm:text-base border border-stone-300 hover:border-stone-400 shadow-xs transition-all cursor-pointer"
              >
                Get a Quote
              </button>
            </div>

            {/* Technical Highlights / Specs Bar */}
            <div className="pt-4 border-t border-stone-200/90 grid grid-cols-3 gap-4 max-w-lg">
              {slide.stats.map((stat, idx) => (
                <div key={idx} className="space-y-0.5">
                  <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
                    {stat.label}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Carousel Navigation Dots and Arrows */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentSlide(idx);
                    }}
                    className={`h-2 transition-all rounded-full ${
                      idx === currentSlide ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}: ${s.id}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-xs"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-xs"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Visual Stage with Interactive Pins */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 group">
              {/* Product Photograph */}
              <div className="aspect-4/3 sm:aspect-5/4 w-full relative overflow-hidden">
                <img
                  src={slide.imageUrl}
                  alt={`${slide.slideHeadline} - Canvas India`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent" />
              </div>

              {/* Floating Verified Quality Tag */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-200 shadow-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="text-xs font-bold text-stone-800">{slide.badge}</span>
              </div>

              {/* Interactive Material Pin Overlays */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-stone-200/80 shadow-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] font-bold text-xs shrink-0">
                    CI
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-stone-900">{slide.slideHeadline}</h2>
                    <p className="text-[11px] text-stone-500">Official Canvas India Manufacturing Atelier</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenQuote(slide.materialKey)}
                  className="px-3 py-1.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Quick Material Switcher Badges Beneath Image */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentSlide(idx);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    idx === currentSlide
                      ? 'bg-[var(--accent-bg)] border-[var(--accent-light)] ring-2 ring-[var(--accent)]/20 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Material 0{idx + 1}
                  </span>
                  <span className={`text-xs font-bold capitalize ${idx === currentSlide ? 'text-[var(--accent)]' : 'text-stone-800'}`}>
                    {s.id}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
