import React from 'react';
import { 
  Printer, 
  Layers, 
  Ruler, 
  Sparkles, 
  Package, 
  Truck, 
  CheckCircle 
} from 'lucide-react';

export const TrustSection: React.FC = () => {
  const benefits = [
    {
      icon: Printer,
      title: 'Quality Printing',
      desc: '12-color archival pigment inks ensuring vivid color fidelity and long-lasting fade resistance.',
    },
    {
      icon: Layers,
      title: 'Multiple Materials',
      desc: 'Expertise in stretched canvas, high-gloss acrylic glass, natural cork and framed photo papers.',
    },
    {
      icon: Ruler,
      title: 'Custom Sizes',
      desc: 'From compact 4x6 inch desk blocks up to grand 48x72 inch architectural lobby wall murals.',
    },
    {
      icon: Sparkles,
      title: 'Easy Customization',
      desc: 'Upload directly from your phone, add text, adjust border wraps and preview prior to ordering.',
    },
    {
      icon: Package,
      title: 'Secure Packaging',
      desc: 'Multi-layer bubble wrap, edge corner protectors and rigid 5-ply corrugated delivery boxes.',
    },
    {
      icon: Truck,
      title: 'Delivery Across India',
      desc: 'Fast, insured doorstep shipping with live tracking to over 19,000 pin codes nationwide.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E85D04] uppercase tracking-wider mb-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Built for Trust</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Why Canvas India
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
            Crafting personalized products with dependable Indian manufacturing and honest pricing.
          </p>
        </div>

        {/* 6 Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 xl:gap-7">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:border-orange-300 hover:shadow-md transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#E85D04] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 mb-1">
                    {b.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
