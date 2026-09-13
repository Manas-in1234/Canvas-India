import React from 'react';
import { Building2, ArrowRight, Check } from 'lucide-react';

interface CorporateSectionProps {
  onOpenQuote: () => void;
}

export const CorporateSection: React.FC<CorporateSectionProps> = ({ onOpenQuote }) => {
  const applications = [
    'Office Reception & Boardroom Wall Art',
    'Custom Logo Signs & Milestone Acrylic Blocks',
    'Employee Welcome Kits & Festive Keepsakes',
    'Architectural Paneling & Event Backdrop Boards',
    'Tiered Wholesale Rates for 20+ Units',
    'GST Invoicing with 18% Input Tax Credit',
  ];

  return (
    <section id="corporate-section" className="py-12 sm:py-16 bg-[#FAF8F5] border-b border-stone-200/60">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Content and Clean Bullets */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              <Building2 className="w-3.5 h-3.5" />
              <span>Commercial &amp; Enterprise Services</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
              Corporate &amp; Bulk Orders
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
              Equip your office, startup, clinic, hotel or retail space with custom printed displays. 
              We assist from digital proofing and GST invoicing to pan-India multi-location dispatch.
            </p>

            {/* Clean Checkmark Bullets (No Boxed Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {applications.map((app, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-stone-800">
                  <Check className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>{app}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenQuote}
                className="px-6 py-2.5 bg-stone-900 hover:bg-[var(--accent)] text-white font-bold text-xs sm:text-sm rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Get a Bulk Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  window.open('https://wa.me/917893051555?text=Hi%20Canvas%20India%2C%20I%20would%20like%20to%20talk%20about%20a%20corporate%20order', '_blank');
                }}
                className="px-5 py-2.5 border border-stone-800 text-stone-800 hover:bg-stone-900 hover:text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Talk to Our Team
              </button>
            </div>
          </div>

          {/* Right Column: Floating Corporate Workspace Visual */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-[16/11] rounded-xl overflow-hidden shadow-md bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80"
                alt="Corporate Workspace Displays"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
