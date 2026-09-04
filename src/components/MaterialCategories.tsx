import React from 'react';
import { ArrowRight, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface MaterialCategoriesProps {
  onSelectCategory: (category: 'canvas' | 'acrylic' | 'cork') => void;
  onOpenQuote: (material: 'canvas' | 'acrylic' | 'cork') => void;
}

export const MaterialCategories: React.FC<MaterialCategoriesProps> = ({
  onSelectCategory,
  onOpenQuote,
}) => {
  const materials = [
    {
      id: 'canvas' as const,
      name: 'CANVAS',
      tagline: 'Bring photographs and artwork to life.',
      description:
        'Archival 420 GSM pure cotton canvas, museum gallery wrapping, and float frames with 12-color pigment vibrancy.',
      cta: 'Explore Canvas →',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=85',
      badge: 'Archival 420 GSM',
      specs: ['100% Pure Cotton', '1.75" Kiln-Dried Pine', '100+ Yr Pigment'],
    },
    {
      id: 'acrylic' as const,
      name: 'ACRYLIC',
      tagline: 'Premium clarity. Modern presentation.',
      description:
        'Optical cast acrylic with 92% light transmittance, diamond-milled edges, and direct UV sub-surface printing.',
      cta: 'Explore Acrylic →',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
      badge: '92% Optical Cast',
      specs: ['Diamond Micro-Polish', 'Direct Sub-Surface UV', 'Brushed Standoffs'],
    },
    {
      id: 'cork' as const,
      name: 'CORK',
      tagline: 'Natural texture. Endless possibilities.',
      description:
        'Sustainably harvested Portuguese cork with self-healing texture, natural acoustic dampening, and modular 3D geometry.',
      cta: 'Explore Cork →',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85',
      badge: 'Portuguese Acoustic',
      specs: ['Class-A Sound NRC', 'Self-Healing Surface', 'Zero VOC Binders'],
    },
  ];

  return (
    <section id="materials" className="py-16 lg:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-3 border border-orange-200">
            <Layers className="w-3.5 h-3.5 text-orange-600" />
            <span>Core Mediums</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            EXPLORE OUR MATERIALS
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Engineered with material purity. Discover how our three signature mediums elevate modern residential, retail, and corporate environments.
          </p>
        </div>

        {/* 3 Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {materials.map((mat) => (
            <div
              key={mat.id}
              onClick={() => onSelectCategory(mat.id)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-stone-50 border border-stone-200 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
            >
              {/* Image Container with Zoom & Badge */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                <img
                  src={mat.imageUrl}
                  alt={`${mat.name} - Canvas India`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-stone-900 border border-white/50 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>{mat.badge}</span>
                </div>

                {/* Material Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">
                    Collection
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-wide">
                    {mat.name}
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <p className="font-semibold text-stone-900 text-base group-hover:text-orange-600 transition-colors">
                    {mat.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {mat.description}
                  </p>

                  {/* Bullet specs */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {mat.specs.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-stone-100 text-[11px] font-medium text-stone-600 border border-stone-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900 group-hover:text-orange-600 transition-colors inline-flex items-center gap-1.5">
                    <span>{mat.cta}</span>
                  </span>
                  <span className="w-8 h-8 rounded-full bg-stone-200 group-hover:bg-orange-500 text-stone-700 group-hover:text-white transition-all flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
