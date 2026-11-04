import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ArrowRight, 
  MessageCircle, 
  Building2, 
  CheckCircle2, 
  FileText, 
  Truck, 
  Award, 
  Mail, 
  Phone 
} from 'lucide-react';
import { CANVAS_STYLE_LANDING_DATA } from '../data/canvasStyleLandingData';
import { ACRYLIC_STYLE_LANDING_DATA } from '../data/acrylicStyleLandingData';
import { CORK_BULK_ITEMS } from '../data/corkBulkData';

const SERIF = '"Playfair Display", Georgia, serif';

// Preserved exports for backward compatibility across customize and product pages
export const MIN_BULK_QTY = 50;
export const QTY_PRICE_TIERS: { qty: number; discount: number }[] = [
  { qty: 50, discount: 0.85 },
  { qty: 100, discount: 0.8 },
  { qty: 150, discount: 0.76 },
  { qty: 200, discount: 0.72 },
  { qty: 300, discount: 0.67 },
  { qty: 500, discount: 0.6 },
];

export function bulkUnitPriceFor(basePrice: number, qty: number): number {
  const tier = [...QTY_PRICE_TIERS].reverse().find((t) => qty >= t.qty) || QTY_PRICE_TIERS[0];
  return Math.round(basePrice * tier.discount);
}

export interface BulkVariant {
  name: string;
  image: string;
  price: number;
  customizeHref: string;
}

export interface BulkItem {
  slug: string;
  material: 'canvas' | 'acrylic' | 'cork';
  name: string;
  image: string;
  unitPrice: number;
  customizeHref: string;
  variants: BulkVariant[];
}

export function buildBulkItems(): BulkItem[] {
  const canvas = Object.values(CANVAS_STYLE_LANDING_DATA)
    .filter((d) => d.styles[0]?.image)
    .map((d) => ({
      slug: d.slug,
      material: 'canvas' as const,
      name: d.pageTitle,
      image: d.styles[0].image!,
      unitPrice: d.styles[0].price,
      customizeHref: d.styles[0].customizeHref,
      variants: d.styles
        .filter((s): s is typeof s & { image: string } => Boolean(s.image))
        .map((s) => ({ name: s.name, image: s.image, price: s.price, customizeHref: s.customizeHref })),
    }));
  const acrylic = Object.values(ACRYLIC_STYLE_LANDING_DATA)
    .filter((d) => d.styles[0]?.image)
    .map((d) => ({
      slug: d.slug,
      material: 'acrylic' as const,
      name: d.pageTitle,
      image: d.styles[0].image!,
      unitPrice: d.styles[0].price,
      customizeHref: d.styles[0].customizeHref,
      variants: d.styles
        .filter((s): s is typeof s & { image: string } => Boolean(s.image))
        .map((s) => ({ name: s.name, image: s.image, price: s.price, customizeHref: s.customizeHref })),
    }));
  return [...canvas, ...acrylic, ...CORK_BULK_ITEMS];
}

export function getBulkItem(material: string, slug: string): BulkItem | undefined {
  return buildBulkItems().find((item) => item.material === material && item.slug === slug);
}

const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 ${className}`}>{children}</div>
);

const CORPORATE_SOLUTIONS = [
  {
    title: 'Office Reception & Boardroom Art',
    description: 'Commanding large-format canvas prints, panoramic office skyline installations, and acoustic wall art tailored to corporate interiors.',
    icon: Building2,
  },
  {
    title: 'Employee Welcome Kits & Gifting',
    description: 'Curated onboarding merchandise, customized keepsake desk frames, and festive employee recognition awards with custom branding.',
    icon: Award,
  },
  {
    title: 'Custom Acrylic Displays & Signage',
    description: 'Ultra-clear cast acrylic signs, standoff wall plaques, milestone blocks, and brand showcase panels with polished diamond edges.',
    icon: CheckCircle2,
  },
  {
    title: 'Eco-Friendly Cork Notice Boards',
    description: 'High-density sustainable cork pinboards and bulletin displays for modern conference rooms, agile workspaces, and design studios.',
    icon: FileText,
  },
];

const CORPORATE_PERKS = [
  {
    title: '100% GST Invoicing',
    description: 'Official B2B tax invoice with 18% Input Tax Credit (ITC) for your company books.',
    icon: FileText,
  },
  {
    title: 'Tiered Volume Discounts',
    description: 'Direct factory pricing with steep tiered discounts on quantities of 10 to 5,000+ units.',
    icon: Award,
  },
  {
    title: 'Safe Pan-India Freight',
    description: 'Specialized reinforced foam-padded crate packaging with doorstep multi-office logistics.',
    icon: Truck,
  },
  {
    title: 'Dedicated Account Manager',
    description: 'Direct WhatsApp & phone assistance for free mockups, custom sizing, and prompt order turnaround.',
    icon: MessageCircle,
  },
];

export const BulkOrdersPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Bulk & Corporate Orders | Canvas India';
  }, []);

  const whatsappQuoteUrl =
    'https://wa.me/917893051555?text=Hi%20Canvas%20India%2C%20I%20would%20like%20to%20get%20a%20quote%20for%20Bulk%20%26%20Corporate%20Orders';

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0A1C3D] text-white py-14 sm:py-20">
        <img
          src="/assets/canvas-india-branded-packaging.webp"
          alt="Canvas India bulk order packaging"
          className="hidden lg:block absolute right-0 top-0 h-full w-[55%] object-cover object-center opacity-85"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 20%, #000 45%, #000 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 20%, #000 45%, #000 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1C3D] via-[#0A1C3D]/95 lg:via-[#0A1C3D]/85 to-transparent pointer-events-none" />

        <Container className="relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-300 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-white font-semibold">Bulk &amp; Corporate Orders</span>
          </nav>

          <div className="max-w-2xl">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-300">
              B2B &amp; Commercial Solutions
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" style={{ fontFamily: SERIF }}>
              Corporate &amp; Bulk Orders
            </h1>
            <p className="mt-4 text-sm sm:text-base text-stone-200 leading-relaxed max-w-xl">
              Elevate your workspace, hotel, startup or corporate gifting program. From custom employee welcome kits and boardroom canvas prints to acrylic brand signage — we provide tailored volume quotes, free digital proofs, and pan-India safe dispatch.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={whatsappQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm sm:text-base font-bold text-white bg-[#E8752A] hover:bg-[#D3631A] rounded-full px-7 py-3.5 shadow-xl shadow-orange-950/50 transition-all hover:scale-105 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Get a Quote on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="mailto:info@canvassindia.com"
                className="inline-flex items-center gap-2 text-sm font-semibold text-stone-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-full px-6 py-3.5 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>info@canvassindia.com</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* CORPORATE SOLUTIONS SECTION */}
      <section className="py-14 sm:py-20 bg-white border-b border-stone-200/70">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#E8752A]">
              What We Fabricate
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900" style={{ fontFamily: SERIF }}>
              B2B Custom Printing Capabilities
            </h2>
            <p className="mt-3 text-sm text-stone-600">
              Every bulk run is precision-manufactured at our state-of-the-art facility to match your exact dimensions, substrates, and brand guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORPORATE_SOLUTIONS.map((sol, idx) => {
              const Icon = sol.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-7 border border-stone-200/80 hover:border-[#0E4A93]/40 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0E4A93]/10 text-[#0E4A93] flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mb-2">{sol.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{sol.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* WHY CHOOSE US / PERKS */}
      <section className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-stone-200/70">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#0E4A93]">
              Why Work With Us
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900" style={{ fontFamily: SERIF }}>
              Built for Enterprise Reliability
            </h2>
            <p className="mt-3 text-sm text-stone-600">
              Trusted by commercial architects, interior designers, startups, corporate offices, and institutions across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORPORATE_PERKS.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
                  <div className="w-10 h-10 rounded-lg bg-[#E8752A]/10 text-[#E8752A] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 mb-1.5">{perk.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{perk.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* DIRECT INQUIRY / WHATSAPP BANNER */}
      <section className="py-14 sm:py-20 bg-stone-900 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Instant WhatsApp Concierge</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" style={{ fontFamily: SERIF }}>
              Ready for a Tailored Quotation?
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Share your dimensions, preferred material, volume, or artwork specifications. Our B2B concierge will reply with custom pricing and digital previews within 2 business hours.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href={whatsappQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-white bg-[#E8752A] hover:bg-[#D3631A] rounded-full px-8 py-4 shadow-xl shadow-orange-950/40 transition-all hover:scale-105 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp (+91 78930 51555)</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-6 border-t border-stone-800 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Direct Line: <strong>+91 78930 51555</strong></span>
              </span>
              <span className="hidden sm:inline text-stone-600">•</span>
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Email RFQ: <strong>info@canvassindia.com</strong></span>
              </span>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
};

export default BulkOrdersPage;
