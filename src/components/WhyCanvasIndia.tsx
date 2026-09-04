import React from 'react';
import {
  Layers,
  Sparkles,
  Maximize2,
  Leaf,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Award,
} from 'lucide-react';

export const WhyCanvasIndia: React.FC = () => {
  const strengths = [
    {
      id: 'premium-materials',
      number: '01',
      title: 'Premium Materials',
      description:
        'Archival-grade 420 GSM pure cotton canvas, cast monomer optical acrylic with 92% light transmittance, and 100% genuine Portuguese cork.',
      icon: Layers,
      highlight: 'Archival Cotton & Cast Monomer',
    },
    {
      id: 'museum-grade-quality',
      number: '02',
      title: 'Museum-Grade Quality',
      description:
        'Ultra-high definition 12-color archival pigment inks and direct UV flatbed curing ensuring 100+ years lightfastness without discoloration or yellowing.',
      icon: Award,
      highlight: '100+ Year Archival Guarantee',
    },
    {
      id: 'custom-fabrication',
      number: '03',
      title: 'Custom Fabrication',
      description:
        'Engineered to any exact architectural dimension from a 6-inch desktop piece to seamless continuous 120-inch lobby masterworks.',
      icon: Maximize2,
      highlight: 'Sub-Millimeter Bespoke Sizing',
    },
    {
      id: 'sustainable-sourcing',
      number: '04',
      title: 'Sustainable Sourcing',
      description:
        'Eco-conscious production using 100% naturally harvested self-regenerating cork bark, non-toxic VOC-free inks, and FSC-certified kiln-dried pine wood.',
      icon: Leaf,
      highlight: 'FSC Certified & Low VOC',
    },
    {
      id: 'precision-finishing',
      number: '05',
      title: 'Precision Finishing',
      description:
        'Swiss CNC sub-millimeter cutting, diamond-milled edge beveling, and museum hand-stretching with zero corner deflection or canvas slack.',
      icon: Sparkles,
      highlight: 'Diamond Polished & Hand-Tensioned',
    },
    {
      id: 'pan-india-delivery',
      number: '06',
      title: 'Pan-India Delivery',
      description:
        'Dispatched in 48 to 72 hours with heavy-duty crated freight, shockproof corner protection, and insured transit to every pin code across India.',
      icon: Truck,
      highlight: 'Insured Crated Pan-India Dispatch',
    },
  ];

  return (
    <section id="why-canvas-india" className="py-16 lg:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-3 border border-orange-200 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E8751A]" />
            <span>Crafted with Indian Precision • Made in India</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            WHY CANVAS INDIA
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Every product reflects our obsessive commitment to material authenticity, engineering precision, and enduring architectural beauty.
          </p>
        </div>

        {/* 6 Grid of Strengths Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {strengths.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-[#E8751A] text-[#E8751A] group-hover:text-white transition-colors flex items-center justify-center shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-stone-400 group-hover:text-[#E8751A] transition-colors">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-[#E8751A] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
