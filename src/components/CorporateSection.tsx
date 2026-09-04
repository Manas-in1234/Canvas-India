import React from 'react';
import { Briefcase, ArrowRight, CheckCircle2, Phone, Mail, Building2 } from 'lucide-react';

interface CorporateSectionProps {
  onOpenQuote: () => void;
}

export const CorporateSection: React.FC<CorporateSectionProps> = ({ onOpenQuote }) => {
  const applications = [
    { title: 'Office Branding', desc: 'Reception logo boards & conference room visuals' },
    { title: 'Employee Gifts', desc: 'Milestone desk blocks & welcome kit frames' },
    { title: 'Event Displays', desc: 'Backdrop boards, signage stands & podium panels' },
    { title: 'Business Signage', desc: 'Directional acrylic boards & room name plaques' },
    { title: 'Bulk Printing', desc: 'Tiered wholesale rates for orders above 20 units' },
    { title: 'Custom Wall Art', desc: 'Timeline walls, company core values & mission prints' },
  ];

  return (
    <section id="corporate-section" className="py-12 sm:py-16 bg-white border-b border-stone-200">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          
          {/* Left: Content and Checklist */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
              <Building2 className="w-3.5 h-3.5 text-[#E85D04]" />
              <span>Commercial &amp; Enterprise Services</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Corporate &amp; Bulk Orders
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Equip your office, startup, clinic, hotel or retail space with custom printed displays. 
              We assist from digital proofing and GST invoicing to pan-India multi-location dispatch.
            </p>

            {/* Practical Business Applications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {applications.map((app, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-[#E85D04] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-stone-900">{app.title}</h3>
                    <p className="text-[11px] text-stone-500 leading-tight mt-0.5">{app.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenQuote}
                className="px-6 py-3 bg-[#0F243E] hover:bg-[#1A385C] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
              >
                <span>Get a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-xs text-stone-500 flex items-center gap-2">
                <span>Direct Desk:</span>
                <a href="tel:+919845012345" className="font-bold text-stone-800 hover:text-[#E85D04]">
                  +91 98450 12345
                </a>
              </div>
            </div>
          </div>

          {/* Right: Business Image with Quick Stats */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80"
                alt="Corporate Workspace Displays"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Stats Strip */}
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-white/60 shadow text-center">
                <div>
                  <div className="text-base sm:text-lg font-black text-[#E85D04]">500+</div>
                  <div className="text-[10px] text-stone-500 font-semibold">Offices Fitted</div>
                </div>
                <div className="border-x border-stone-200">
                  <div className="text-base sm:text-lg font-black text-stone-900">100%</div>
                  <div className="text-[10px] text-stone-500 font-semibold">GST Invoicing</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-stone-900">4-6 Days</div>
                  <div className="text-[10px] text-stone-500 font-semibold">Dispatch Time</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
