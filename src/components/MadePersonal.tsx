import React from 'react';
import { ArrowRight, Camera, Palette, Type, Briefcase, Heart, Sparkles } from 'lucide-react';

interface MadePersonalProps {
  onStartCreating: () => void;
}

export const MadePersonal: React.FC<MadePersonalProps> = ({ onStartCreating }) => {
  const transformItems = [
    {
      icon: Camera,
      title: 'Photos & Candid Memories',
      desc: 'Vacation shots, wedding ceremonies, family celebrations & baby milestones.',
      material: 'Canvas & Acrylic Glass',
    },
    {
      icon: Palette,
      title: 'Digital Art & Illustrations',
      desc: 'Folk art, digital paintings, vector graphics & geometric wallpapers.',
      material: 'Fine Cotton Canvas',
    },
    {
      icon: Type,
      title: 'Inspirational Quotes & Poetry',
      desc: 'Motivational slogans, family mottos, favorite verses & custom typography.',
      material: 'Stretched Canvas & Posters',
    },
    {
      icon: Briefcase,
      title: 'Business Branding & Signage',
      desc: 'Company logos, reception plaques, mission boards & trade display prints.',
      material: 'Cast Acrylic & Cork Panels',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          
          {/* Left: Storytelling Content */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Product Story</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
              Made <span className="text-[var(--accent)]">Personal.</span>
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Every room tells a story. At Canvas India, we turn your photos, memories, 
              artwork, quotes, designs and business branding into tangible, high-quality physical products 
              ready to display on your walls and desks.
            </p>

            {/* Transformation capabilities grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {transformItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] text-[var(--accent)] flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-stone-900">{item.title}</h3>
                    <p className="text-[11px] text-stone-500 mt-1 leading-snug">{item.desc}</p>
                    <div className="mt-2 text-[10px] font-semibold text-[var(--accent)]">
                      {item.material}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={onStartCreating}
                className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
              >
                <span>Create Yours</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Rich Visual Composition */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-12 gap-3.5 sm:gap-4 items-center">
              
              {/* Main Canvas Print Display */}
              <div className="col-span-7 space-y-3.5">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-stone-200 group">
                  <img
                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80"
                    alt="Custom Canvas Wall Display"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xs font-bold">Turn Photos into Stretched Canvas</div>
                    <div className="text-[11px] text-stone-200">Museum wrap with pine wood frame</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-stone-800">Photo Quality Check:</span>
                    <span className="text-stone-500 ml-1">Free automated resolution verification</span>
                  </div>
                  <span className="text-[var(--accent)] font-black text-xs">Included</span>
                </div>
              </div>

              {/* Side Stacks: Acrylic & Cork Showcase */}
              <div className="col-span-5 space-y-3.5">
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-md border-2 border-white bg-stone-200 group">
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80"
                    alt="Glossy Acrylic Photo Glass"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold p-1.5 rounded text-center">
                    Glossy Cast Acrylic
                  </div>
                </div>

                <div className="relative aspect-square rounded-xl overflow-hidden shadow-md border-2 border-white bg-stone-200 group">
                  <img
                    src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80"
                    alt="Natural Cork Board Print"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold p-1.5 rounded text-center">
                    Sustainable Cork Art
                  </div>
                </div>

                <div className="bg-[#0F243E] text-white p-3 rounded-xl shadow-md text-center">
                  <div className="text-xs font-bold">12-Color Printing Engine</div>
                  <div className="text-[10px] text-stone-300 mt-0.5">True-to-life skin tones &amp; deep contrast</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
