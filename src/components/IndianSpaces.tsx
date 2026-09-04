import React, { useState } from 'react';
import { ArrowRight, Sparkles, Check, Home, Briefcase, Building2, BedDouble } from 'lucide-react';

interface IndianSpacesProps {
  onExploreSpace: (spaceName: string) => void;
}

export const IndianSpaces: React.FC<IndianSpacesProps> = ({ onExploreSpace }) => {
  const [activeSpace, setActiveSpace] = useState('living-room');

  const spaces = [
    {
      id: 'living-room',
      title: 'Living Room',
      icon: Home,
      tagline: 'Warm, welcoming family statements & panoramic triptychs',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
      recommendedMaterials: ['420 GSM Cotton Canvas', 'Ashwood Floater Frames', '3-Panel Split Prints'],
      description: 'Living rooms in Indian homes require wall art that can withstand tropical weather while celebrating familial memories and vibrant aesthetics. Our moisture-sealed canvas ensures vibrant colors for generations.',
      popularSizes: '16" × 20", 20" × 30", 24" × 36"',
    },
    {
      id: 'bedroom',
      title: 'Bedroom',
      icon: BedDouble,
      tagline: 'Serene, intimate memories & glare-free acoustic harmony',
      imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80',
      recommendedMaterials: ['Matte Archival Canvas', 'Self-Healing Portuguese Cork', 'Minimalist Wood Frames'],
      description: 'Craft a calm sanctuary with glare-free matte canvas wall art and acoustic cork notice tiles behind headboards to soften ambient noise and display personal polaroids.',
      popularSizes: '12" × 18", 16" × 24", Set of 3 (10" × 10")',
    },
    {
      id: 'office',
      title: 'Office & Study',
      icon: Briefcase,
      tagline: 'Focus boards, vision walls & high-definition awards',
      imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80',
      recommendedMaterials: ['Acoustic Cork Boards', 'Desktop Acrylic Photo Blocks', 'Motivational Canvas Prints'],
      description: 'Elevate your daily focus with organic self-healing bulletin boards for pinning project blueprints and freestanding 20mm crystal acrylic blocks celebrating company milestones.',
      popularSizes: '8" × 8" Acrylic Block, 24" × 36" Cork Board',
    },
    {
      id: 'corporate-spaces',
      title: 'Corporate Spaces',
      icon: Building2,
      tagline: 'Architectural brand walls, wayfinding & lobby installations',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      recommendedMaterials: ['Optical Acrylic Signs', 'Architectural Acoustic Paneling', 'Large-Format Lobby Art'],
      description: 'From multi-location tech headquarters in Bengaluru to enterprise boardrooms in Mumbai, Canvas India delivers turnkey brand walls with CNC precision and fire-rated backing.',
      popularSizes: 'Custom Modular Paneling up to 120" continuous span',
    },
  ];

  const current = spaces.find((s) => s.id === activeSpace) || spaces[0];

  return (
    <section id="indian-spaces" className="bg-stone-50 py-12 sm:py-16 border-b border-stone-200">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#E85D04] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture & Interior Design</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F243E] tracking-tight uppercase">
            MADE FOR INDIAN SPACES
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Engineered to resist humidity, sunlight, and wear while bringing timeless warmth to Indian architecture.
          </p>
        </div>

        {/* Space Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-white rounded-xl border border-stone-200 shadow-xs gap-1 sm:gap-2 overflow-x-auto max-w-full">
            {spaces.map((space) => {
              const Icon = space.icon;
              const isActive = activeSpace === space.id;
              return (
                <button
                  key={space.id}
                  type="button"
                  onClick={() => setActiveSpace(space.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#E85D04] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{space.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Space Details Showcase Box */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left: Large High-Resolution Interior Image */}
          <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[440px] bg-stone-100 overflow-hidden group">
            <img
              src={current.imageUrl}
              alt={current.title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#E85D04] px-2.5 py-1 rounded">
                Recommended for: {current.title}
              </span>
              <p className="text-sm font-medium mt-1 text-stone-200">
                Popular Dimensions: {current.popularSizes}
              </p>
            </div>
          </div>

          {/* Right: Detailed Content & Recommendations */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-black text-[#E85D04] uppercase tracking-wider">
                Space Styling Guide
              </div>
              <h3 className="text-2xl font-black text-[#0F243E] mt-1">
                {current.title} Solutions
              </h3>
              <p className="text-xs font-semibold text-stone-500 mt-1">
                {current.tagline}
              </p>

              <p className="text-xs sm:text-sm text-stone-600 mt-4 leading-relaxed font-normal">
                {current.description}
              </p>

              {/* Recommended Materials */}
              <div className="mt-6 pt-5 border-t border-stone-100">
                <span className="text-xs font-extrabold text-[#0F243E] uppercase tracking-wider block mb-2.5">
                  Recommended Mediums & Finishes
                </span>
                <div className="space-y-2">
                  {current.recommendedMaterials.map((mat) => (
                    <div key={mat} className="flex items-center gap-2 text-xs font-medium text-stone-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{mat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => onExploreSpace(current.title)}
                className="w-full py-3.5 px-6 rounded-lg bg-[#0F243E] hover:bg-[#E85D04] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Shop Decor for {current.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
