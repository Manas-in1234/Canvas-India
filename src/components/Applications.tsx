import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { INDUSTRY_APPLICATIONS } from '../data/brandData';

interface ApplicationsProps {
  onSelectApplication?: (appName: string) => void;
  onOpenQuote?: () => void;
}

export const Applications: React.FC<ApplicationsProps> = ({
  onSelectApplication,
  onOpenQuote,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="applications" className="py-16 lg:py-24 bg-stone-50 border-b border-stone-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Horizontal Scroll Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2 border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Spatial Versatility</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              DESIGNED FOR INDIAN SPACES
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base">
              Explore how Canvas, Acrylic, and Cork products fit real spaces across modern India.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="p-3 rounded-full border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors shadow-xs cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-3 rounded-full border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors shadow-xs cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontally Scrolling Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-6 pt-1 scroll-smooth snap-x snap-mandatory"
        >
          {INDUSTRY_APPLICATIONS.map((app) => (
            <div
              key={app.id || app.name}
              onClick={() => {
                if (onSelectApplication) onSelectApplication(app.name);
                else if (onOpenQuote) onOpenQuote();
              }}
              className="snap-start shrink-0 w-[290px] sm:w-[350px] md:w-[390px] rounded-3xl overflow-hidden bg-white border border-stone-200 hover:border-orange-400 shadow-xs hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              {/* Large Image with Dark Gradient & Title Overlay */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                <img
                  src={app.imageUrl}
                  alt={`${app.name} space design - Canvas India`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/25 to-transparent" />
                
                {/* Category Label */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md text-white border border-white/20">
                    {app.category || app.name}
                  </span>
                </div>

                {/* Name on image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    {app.name}
                  </h3>
                </div>
              </div>

              {/* Minimal Text & Suitable Materials */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {app.description}
                </p>

                <div className="pt-3 border-t border-stone-100 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                      Recommended Products:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.suitableMaterials?.map((mat) => (
                        <span
                          key={mat}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200/60"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectApplication) onSelectApplication(app.name);
                      else if (onOpenQuote) onOpenQuote();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-orange-500 text-stone-800 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                  >
                    <span>View Products for this Space</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
