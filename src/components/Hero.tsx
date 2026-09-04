import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Truck, Zap } from 'lucide-react';

interface HeroProps {
  onStartCreating: () => void;
  onExploreProducts: () => void;
  onSelectCategory: (slug: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartCreating,
  onExploreProducts,
  onSelectCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'office' | 'gifts' | 'wall'>('home');

  const lifestyleSlides = {
    home: {
      title: 'Warm Home Wall Decor',
      tag: 'Living Rooms & Bed Spaces',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&auto=format&fit=crop&q=80',
      badge: 'Custom Canvas from ₹599',
      products: ['Stretched Canvas Art', 'Framed Family Wall', 'Cork Board'],
    },
    office: {
      title: 'Modern Corporate Workspaces',
      tag: 'Offices & Conference Halls',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80',
      badge: 'Bulk Discounts Available',
      products: ['Glossy Acrylic Logos', 'Mission Boards', 'Modular Cork Tiles'],
    },
    gifts: {
      title: 'Heartfelt Keepsake Gifts',
      tag: 'Birthdays & Anniversaries',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&auto=format&fit=crop&q=80',
      badge: 'Desk Blocks from ₹699',
      products: ['Solid Acrylic Blocks', 'Memory Photo Collage', 'Custom Quotes'],
    },
    wall: {
      title: 'Gallery Wall Collections',
      tag: 'Stairways & Entryways',
      image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=900&auto=format&fit=crop&q=80',
      badge: 'Ready to Hang Sets',
      products: ['3-Panel Canvases', 'Wood Photo Frames', 'Botanical Sets'],
    },
  };

  const currentSlide = lifestyleSlides[activeTab];

  return (
    <section className="bg-gradient-to-b from-[#FFFDF9] via-stone-50 to-white pt-6 pb-10 sm:py-12 border-b border-stone-200/80">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        {/* Promotional Tagline Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#E85D04] border border-orange-200">
            <Sparkles className="w-3.5 h-3.5" />
            Custom Printing & Personalized Products
          </span>
          <span className="hidden sm:inline text-xs font-semibold text-stone-500">
            • Delivered Across India in 4-6 Days
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          {/* Left Column: Commercial E-commerce Headline and CTAs (~48% - 50%) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-5 xl:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
              Make It <span className="text-[#E85D04]">Yours.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
              Create personalized canvas, acrylic and cork products for your home, gifts and business. 
              Vibrant 12-color printing, solid wood craft and easy online previews.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onStartCreating}
                className="px-6 py-3.5 bg-[#E85D04] hover:bg-[#D44E00] text-white text-sm sm:text-base font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
              >
                <span>Start Creating</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreProducts}
                className="px-6 py-3.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-sm sm:text-base font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <span>Explore Products</span>
              </button>
            </div>

            {/* Trust Badges Strip */}
            <div className="pt-4 border-t border-stone-200/80 grid grid-cols-3 gap-2 sm:gap-4 text-xs font-semibold text-stone-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Quality Check</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#E85D04] flex-shrink-0" />
                <span>Free Shipping &gt; ₹999</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Safe Delivery Box</span>
              </div>
            </div>

            {/* Quick Material Category Shortcuts */}
            <div className="flex items-center gap-2 pt-2 text-xs font-medium text-stone-500">
              <span className="font-bold text-stone-700">Quick Jump:</span>
              <button 
                onClick={() => onSelectCategory('canvas')}
                className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-stone-200 rounded text-stone-700 hover:text-[#E85D04] transition-colors"
              >
                Canvas
              </button>
              <button 
                onClick={() => onSelectCategory('acrylic')}
                className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-stone-200 rounded text-stone-700 hover:text-[#E85D04] transition-colors"
              >
                Acrylic
              </button>
              <button 
                onClick={() => onSelectCategory('cork')}
                className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-stone-200 rounded text-stone-700 hover:text-[#E85D04] transition-colors"
              >
                Cork
              </button>
              <button 
                onClick={() => onSelectCategory('photo-frames')}
                className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-stone-200 rounded text-stone-700 hover:text-[#E85D04] transition-colors"
              >
                Frames
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Lifestyle and Product Composition (~50% - 52%) */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-lg border border-stone-200 relative overflow-hidden">
              {/* Scene Switcher Pills */}
              <div className="flex items-center justify-between gap-1 p-1 bg-stone-100 rounded-xl mb-3 text-xs font-bold text-stone-600">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
                    activeTab === 'home' ? 'bg-[#E85D04] text-white shadow-sm' : 'hover:text-stone-900'
                  }`}
                >
                  Homes
                </button>
                <button
                  onClick={() => setActiveTab('office')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
                    activeTab === 'office' ? 'bg-[#E85D04] text-white shadow-sm' : 'hover:text-stone-900'
                  }`}
                >
                  Offices
                </button>
                <button
                  onClick={() => setActiveTab('gifts')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
                    activeTab === 'gifts' ? 'bg-[#E85D04] text-white shadow-sm' : 'hover:text-stone-900'
                  }`}
                >
                  Gifting
                </button>
                <button
                  onClick={() => setActiveTab('wall')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
                    activeTab === 'wall' ? 'bg-[#E85D04] text-white shadow-sm' : 'hover:text-stone-900'
                  }`}
                >
                  Wall Decor
                </button>
              </div>

              {/* Large Product Lifestyle Image */}
              <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-xl overflow-hidden bg-stone-100">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Overlaid Promotional Tag */}
                <div className="absolute top-3 left-3 bg-[#E85D04] text-white text-xs font-extrabold px-3 py-1.5 rounded-md shadow-md flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{currentSlide.badge}</span>
                </div>

                {/* Overlaid Context Pill */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-white/60 shadow-md flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-900">{currentSlide.title}</div>
                    <div className="text-[11px] text-stone-500">{currentSlide.tag}</div>
                  </div>
                  <button
                    onClick={onStartCreating}
                    className="px-3 py-1.5 bg-[#0F243E] hover:bg-[#1C3E63] text-white text-xs font-bold rounded-md flex items-center gap-1 transition-colors"
                  >
                    <span>Customize</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Mini Feature Highlights */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 font-medium px-2">
                <span>Featured items:</span>
                <div className="flex gap-2">
                  {currentSlide.products.map((p, idx) => (
                    <span key={idx} className="bg-stone-50 border border-stone-200 px-2 py-0.5 rounded text-stone-700">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
