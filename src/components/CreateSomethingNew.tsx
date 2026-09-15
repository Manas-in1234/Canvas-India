import React from 'react';
import { Sparkles, ArrowRight, Palette, Layers, CircleDot } from 'lucide-react';

interface CreateSomethingNewProps {
  onStartCreating: () => void;
  onSelectCategory: (slug: string) => void;
}

export const CreateSomethingNew: React.FC<CreateSomethingNewProps> = ({
  onStartCreating,
  onSelectCategory,
}) => {
  return (
    <section 
      id="customizer-section" 
      className="w-full bg-white py-12 sm:py-16 border-b border-stone-200/80 transition-colors"
    >
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Narrative, Headline, Features, CTAs */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E8752A]">
              <Sparkles className="w-3.5 h-3.5 text-[#E8752A]" />
              <span>Personalized Printing &amp; Custom Art</span>
            </div>

            {/* Heading: "Create Something New" */}
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] font-serif italic text-[#111827]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
            >
              Create Something New
            </h2>

            {/* Supporting text */}
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
              Turn your favorite memories and ideas into personalized products. 
              Museum-grade cotton canvas, optical crystal acrylic, and natural cork wall art handcrafted in India.
            </p>

            {/* Flat format highlights (No rectangular cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <button
                type="button"
                onClick={() => onSelectCategory('canvas-prints')}
                className="group flex items-center gap-2.5 text-left cursor-pointer focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 bg-orange-50 text-[#E8752A] border border-orange-200/60">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 group-hover:text-[#0E4A93] transition-colors">Canvas Prints</div>
                  <div className="text-[11px] text-stone-500">From ₹499</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectCategory('acrylic-prints')}
                className="group flex items-center gap-2.5 text-left cursor-pointer focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 bg-blue-50 text-[#0E4A93] border border-blue-200/60">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 group-hover:text-[#0E4A93] transition-colors">Acrylic Glass</div>
                  <div className="text-[11px] text-stone-500">From ₹399</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectCategory('cork-prints')}
                className="group flex items-center gap-2.5 text-left cursor-pointer focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 bg-amber-50 text-amber-800 border border-amber-200/60">
                  <CircleDot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 group-hover:text-[#0E4A93] transition-colors">Cork Boards</div>
                  <div className="text-[11px] text-stone-500">From ₹449</div>
                </div>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onStartCreating}
                className="px-7 py-3.5 bg-[#E8752A] hover:bg-[#D3631A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Start Creating</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onSelectCategory('canvas-prints')}
                className="text-xs sm:text-sm font-bold text-[#0E4A93] hover:underline transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Explore All Formats →</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Natural visual composition (No Card Grid, flowing imagery) */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full max-w-xl mx-auto">
              
              {/* Primary Canvas Art Piece */}
              <div 
                onClick={onStartCreating}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl cursor-pointer group bg-stone-100 border border-stone-200"
              >
                <img
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80"
                  alt="Custom Canvas Wall Art"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5">
                    <span>Customize this format</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="absolute top-3 left-3 bg-[#0E4A93]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                  Museum Canvas
                </div>
              </div>

              {/* Offset Visual 1: Glossy Acrylic Glass (Overlapping top-right) */}
              <div 
                onClick={() => onSelectCategory('acrylic-prints')}
                className="hidden sm:block absolute -top-5 -right-5 w-44 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white cursor-pointer group bg-stone-100 transition-transform hover:scale-105"
              >
                <img
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80"
                  alt="Glossy Acrylic Photo"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-2 left-2 bg-[#0E4A93]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                  Acrylic Glass
                </div>
              </div>

              {/* Offset Visual 2: Natural Cork Print (Overlapping bottom-left) */}
              <div 
                onClick={() => onSelectCategory('cork-prints')}
                className="hidden sm:block absolute -bottom-5 -left-5 w-40 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white cursor-pointer group bg-stone-100 transition-transform hover:scale-105"
              >
                <img
                  src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80"
                  alt="Natural Cork Pinboard"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-2 left-2 bg-stone-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                  Eco Cork
                </div>
              </div>

              {/* Clean Floating Trust Badge */}
              <div className="absolute -bottom-4 right-4 bg-white/95 backdrop-blur-xs text-stone-900 px-3.5 py-1.5 rounded-full shadow-md border border-stone-200/80 text-[11px] font-bold flex items-center gap-1.5">
                <span className="text-amber-500">★ 4.8</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-600">1,50,000+ Happy Customers</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
