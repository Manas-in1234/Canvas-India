import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Sparkle,
  TreeDeciduous,
  Building2,
  Brush,
  PackageCheck
} from 'lucide-react';

interface CustomSolutionsProps {
  onGetQuote: (solutionTitle?: string) => void;
}

export const CustomSolutions: React.FC<CustomSolutionsProps> = ({ onGetQuote }) => {
  const solutions = [
    {
      id: 'custom-canvas',
      title: 'Custom Canvas',
      icon: Layers,
      description: 'Any custom dimension from 6" to 120" with hand-stretched gallery wrap or solid wood floating frames.',
      badge: 'Archival 420 GSM',
    },
    {
      id: 'custom-acrylic',
      title: 'Custom Acrylic',
      icon: Sparkle,
      description: 'Diamond-milled 4mm–12mm cast acrylic with sub-surface UV printing, standoffs, or back-lit logos.',
      badge: '92% Clarity',
    },
    {
      id: 'custom-cork',
      title: 'Custom Cork',
      icon: TreeDeciduous,
      description: 'Precision laser-cut acoustic tiles, bespoke geometric wall installations, and printed bulletin boards.',
      badge: 'Self-Healing Bark',
    },
    {
      id: 'corporate-branding',
      title: 'Corporate Branding',
      icon: Building2,
      description: 'Turnkey architectural signage, mission walls, boardroom artwork, and executive gifting programs.',
      badge: 'Multi-Location Spec',
    },
    {
      id: 'interior-projects',
      title: 'Interior Projects',
      icon: Brush,
      description: 'Dedicated fabrication support for architects and interior curators with bespoke material swatches.',
      badge: 'Architect Partner',
    },
    {
      id: 'bulk-orders',
      title: 'Bulk Orders',
      icon: PackageCheck,
      description: 'Direct manufacturer pricing with tiered discounts, rapid turnaround, and pan-India multi-destination dispatch.',
      badge: 'Tiered Pricing',
    },
  ];

  return (
    <section id="custom-solutions" className="bg-white py-12 sm:py-16 border-b border-stone-200">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#E85D04] text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke & Enterprise Atelier</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F243E] tracking-tight uppercase">
              YOUR IDEA. OUR CRAFT.
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-2xl">
              From an unconventional living room alcove to a nationwide 50-branch corporate rollout, our master craftsmen bring your visual concepts to life.
            </p>
          </div>

          {/* CTA Header Button */}
          <button
            type="button"
            onClick={() => onGetQuote()}
            className="px-6 py-3 rounded-lg bg-[#E85D04] hover:bg-[#ff6f0e] active:bg-[#c94e03] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <span>GET A CUSTOM QUOTE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Solutions Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group bg-stone-50/70 hover:bg-white rounded-xl p-6 border border-stone-200 hover:border-[#E85D04] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-100/60 text-[#E85D04] flex items-center justify-center group-hover:bg-[#E85D04] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white text-stone-600 border border-stone-200 group-hover:border-orange-200 group-hover:text-[#E85D04] transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#0F243E] mb-2 group-hover:text-[#E85D04] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/60">
                  <button
                    type="button"
                    onClick={() => onGetQuote(item.title)}
                    className="text-xs font-extrabold text-[#E85D04] hover:text-[#0F243E] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Request Spec & Quote</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
