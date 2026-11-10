import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, MessageCircle } from 'lucide-react';
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

export const BulkOrdersPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Bulk & Corporate Orders | Canvas India';
  }, []);

  const whatsappQuoteUrl =
    'https://wa.me/917893051555?text=Hi%20Canvas%20India%2C%20I%20would%20like%20to%20get%20a%20quote%20for%20Bulk%20%26%20Corporate%20Orders';

  return (
    <div className="w-full min-h-[70vh] bg-[#FFFDF9] text-stone-900 font-manrope flex flex-col justify-center">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F7F1E5] border-b border-stone-200/60 py-12 sm:py-20">
        <img
          src="/assets/canvas-india-branded-packaging.webp"
          alt="Canvas India branded bulk order packaging"
          className="hidden lg:block absolute right-0 top-0 h-full w-[55%] object-cover object-center"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, #000 35%, #000 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, #000 35%, #000 100%)',
          }}
        />
        <div className="hidden lg:block absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#F7F1E5] via-[#F7F1E5]/80 to-transparent pointer-events-none" />

        <Container className="relative z-10 py-6 sm:py-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
            <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-semibold">Bulk &amp; Corporate Orders</span>
          </nav>

          <div className="max-w-xl">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#E8752A]">B2B &amp; Bulk Solutions</span>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-stone-900" style={{ fontFamily: SERIF }}>
              Bulk &amp; Corporate Orders
            </h1>
            <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed">
              Custom employee welcome kits, company branded products, uniform prints, corporate gifts, and bulk orders. Connect with our team on WhatsApp for custom volume quotations.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={whatsappQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm sm:text-base font-bold text-white bg-[#E8752A] hover:bg-[#D3631A] rounded-full px-7 py-3.5 shadow-lg shadow-orange-950/20 transition-all hover:scale-105 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Get a Quote on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default BulkOrdersPage;
