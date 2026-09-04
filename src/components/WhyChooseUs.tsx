import React from 'react';
import {
  Printer,
  Sparkles,
  Maximize2,
  Truck,
  ShieldCheck,
  Award,
  CheckCircle2
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      id: 'printing',
      icon: Printer,
      title: 'Premium Archival Printing',
      description: '12-color archival pigment & UV inks with 100+ years zero-fade museum longevity guarantee.',
      badge: '12-Color Inks',
    },
    {
      id: 'made-in-india',
      icon: Award,
      title: '100% Made in India',
      description: 'Designed, engineered, and hand-finished in our Indian ateliers for humid & tropical climates.',
      badge: 'Atelier Crafted',
    },
    {
      id: 'custom-sizes',
      icon: Maximize2,
      title: 'Bespoke Custom Sizes',
      description: 'Any continuous dimension from 6" to 120" cut with Swiss CNC sub-millimeter precision.',
      badge: '6" to 120"',
    },
    {
      id: 'fast-delivery',
      icon: Truck,
      title: 'Express Pan-India Delivery',
      description: 'Dispatched in 48–72 hours with WhatsApp & SMS live tracking to all 19,000+ pin codes.',
      badge: '48-72h Dispatch',
    },
    {
      id: 'secure-packaging',
      icon: ShieldCheck,
      title: '5-Layer Secure Packaging',
      description: 'Corner-guarded, shockproof multi-ply crating ensuring zero damage in transit, or free replacement.',
      badge: 'Transit Insured',
    },
  ];

  return (
    <section id="why-canvas-india" className="bg-stone-50 py-12 sm:py-16 border-b border-stone-200">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#E85D04] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Canvas India Advantage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F243E] tracking-tight uppercase">
            WHY CHOOSE CANVAS INDIA?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Trusted by over 10,000+ Indian households, leading interior designers, and premier corporate campuses.
          </p>
        </div>

        {/* 5 Horizontal Feature Blocks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs hover:shadow-md hover:border-[#E85D04]/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-50 border border-orange-200 text-[#E85D04] flex items-center justify-center group-hover:bg-[#E85D04] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 group-hover:bg-orange-100 group-hover:text-[#E85D04] transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-[#0F243E] mb-2 leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-bold text-[#E85D04]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{feature.badge}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
