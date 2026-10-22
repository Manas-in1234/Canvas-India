import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Check, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CANVAS_STYLE_LANDING_DATA } from '../data/canvasStyleLandingData';
import { ACRYLIC_STYLE_LANDING_DATA } from '../data/acrylicStyleLandingData';

const SERIF = '"Playfair Display", Georgia, serif';

const u = (id: string, w = 1600) => `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=90`;

// Every bulk order, regardless of material, ships at this minimum run.
export const MIN_BULK_QTY = 50;
// Flat per-unit discount applied to a style's normal starting price once
// ordered at bulk — these are quote-based, not live cart prices.
export const BULK_DISCOUNT = 0.8;

export interface BulkItem {
  slug: string;
  material: 'canvas' | 'acrylic';
  name: string;
  image: string;
  unitPrice: number;
  customizeHref: string;
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
    }));
  return [...canvas, ...acrylic];
}

// Canvas and Acrylic style slugs overlap (e.g. both have "wall-display" and
// "photo-collage"), so lookups are keyed on material + slug together.
export function getBulkItem(material: string, slug: string): BulkItem | undefined {
  return buildBulkItems().find((item) => item.material === material && item.slug === slug);
}

const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 ${className}`}>{children}</div>
);

const BulkSection: React.FC<{ title: string; items: BulkItem[] }> = ({ title, items }) => (
  <section className="py-8 sm:py-10">
    <Container>
      <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-5">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {items.map((item) => {
          const bulkPrice = Math.round(item.unitPrice * BULK_DISCOUNT);
          return (
            <Link
              key={`${item.material}-${item.slug}`}
              to={`/bulk-order/${item.material}/${item.slug}`}
              className="group text-left cursor-pointer block"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200/70 group-hover:border-[#0E4A93]/40 group-hover:shadow-md transition-all">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                <span className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-xs">
                  <Heart className="w-3.5 h-3.5 text-stone-500" />
                </span>
              </div>
              <div className="mt-2.5 text-sm font-bold text-stone-900 group-hover:text-[#0E4A93] transition-colors">
                Bulk {item.name}
              </div>
              <div className="text-xs font-semibold text-stone-700 mt-0.5">
                From ₹{bulkPrice.toLocaleString('en-IN')} each
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                Minimum quantity {MIN_BULK_QTY}
              </div>
            </Link>
          );
        })}
      </div>
    </Container>
  </section>
);

export const BulkOrdersPage: React.FC = () => {
  const { onOpenQuote } = useShop();

  useEffect(() => {
    document.title = 'Bulk & Corporate Orders | Canvas India';
  }, []);

  const allItems = useMemo(() => buildBulkItems(), []);
  const canvasItems = useMemo(() => allItems.filter((i) => i.material === 'canvas'), [allItems]);
  const acrylicItems = useMemo(() => allItems.filter((i) => i.material === 'acrylic'), [allItems]);

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F7F1E5] border-b border-stone-200/60">
        <img
          src={u('1497215728101-856f4ea42174', 2000)}
          alt="Corporate office workspace"
          className="hidden lg:block absolute right-0 top-0 h-full w-[55%] object-cover object-center"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, #000 35%, #000 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, #000 35%, #000 100%)',
          }}
        />
        <div className="hidden lg:block absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#F7F1E5] via-[#F7F1E5]/80 to-transparent pointer-events-none" />

        <Container className="relative py-10 sm:py-14">
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
            <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
              Canvas and acrylic prints at volume pricing for offices, events, hotels and gifting programs — every size and style below ships as a bulk run.
            </p>

            <ul className="mt-5 space-y-1.5">
              {[`Minimum order: ${MIN_BULK_QTY} units`, 'GST invoice available', 'Volume discounts', 'Fast turnaround across India'].map((label) => (
                <li key={label} className="flex items-center gap-2 text-sm text-stone-700">
                  <Check className="w-4 h-4 text-[#0E4A93] shrink-0" />
                  {label}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onOpenQuote}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white bg-[#E8752A] hover:bg-[#D3631A] rounded-full px-6 py-3 shadow-lg shadow-orange-950/20 transition-colors cursor-pointer"
            >
              Get a Custom Quote
            </button>
          </div>
        </Container>
      </section>

      {canvasItems.length > 0 && <BulkSection title="Canvas Bulk Orders" items={canvasItems} />}
      {acrylicItems.length > 0 && <BulkSection title="Acrylic Bulk Orders" items={acrylicItems} />}

      <section className="py-8 sm:py-10 border-t border-stone-200/80">
        <Container>
          <p className="text-xs text-stone-500 text-center">
            Prices shown are indicative bulk starting prices per unit at {MIN_BULK_QTY}+ units — final pricing depends on size, finish and exact quantity. Request a quote for an itemized estimate.
          </p>
        </Container>
      </section>

    </div>
  );
};

export default BulkOrdersPage;
