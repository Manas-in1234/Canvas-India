import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Heart } from 'lucide-react';
import { CANVAS_STYLE_LANDING_DATA } from '../data/canvasStyleLandingData';
import { ACRYLIC_STYLE_LANDING_DATA } from '../data/acrylicStyleLandingData';
import { SHOP_CATEGORIES } from '../data/shopCategories';

// Every Print World catalogue design (Devotional Art, Line Art, etc.)
// starts at this price — pulled from catalogueProducts.ts.
const CATALOGUE_BASE_PRICE = 249;

const SERIF = '"Playfair Display", Georgia, serif';

// Every bulk order, regardless of material, ships at this minimum run.
export const MIN_BULK_QTY = 50;

// Genuine volume pricing — the more units, the lower the per-unit discount
// factor (applied to the style's normal single-unit starting price).
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

// One selectable variant within a bulk item's gallery — its own real photo,
// name and customize link (with its own ?layout= when that style is a
// specific panel/shape layout), so picking a thumbnail picks that exact
// variant to customize, not just a different preview photo.
export interface BulkVariant {
  name: string;
  image: string;
  price: number;
  customizeHref: string;
}

export interface BulkItem {
  slug: string;
  material: 'canvas' | 'acrylic';
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
          const bulkPrice = bulkUnitPriceFor(item.unitPrice, MIN_BULK_QTY);
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

// Print World catalogue categories (Devotional Art, Line Art, etc.) — these
// are pre-designed prints across many individual designs rather than one
// customizable product, so bulk cards link straight to that category's
// listing page instead of a single-product detail/customize flow.
const CatalogueBulkSection: React.FC = () => (
  <section className="py-8 sm:py-10">
    <Container>
      <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-5">Other Bulk Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {SHOP_CATEGORIES.map((cat) => {
          const bulkPrice = bulkUnitPriceFor(CATALOGUE_BASE_PRICE, MIN_BULK_QTY);
          return (
            <Link
              key={cat.categorySlug}
              to={cat.path}
              className="group text-left cursor-pointer block"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200/70 group-hover:border-[#0E4A93]/40 group-hover:shadow-md transition-all">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                <span className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-xs">
                  <Heart className="w-3.5 h-3.5 text-stone-500" />
                </span>
              </div>
              <div className="mt-2.5 text-sm font-bold text-stone-900 group-hover:text-[#0E4A93] transition-colors">
                Bulk {cat.name}
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
          src="/assets/canvas-india-branded-packaging.webp"
          alt="Canvas India branded bulk order packaging"
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

          <div className="max-w-xl mx-auto text-center">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#E8752A]">B2B &amp; Bulk Solutions</span>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-stone-900" style={{ fontFamily: SERIF }}>
              Bulk &amp; Corporate Orders
            </h1>
            <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
              Canvas, acrylic and every catalogue print category at volume pricing for offices, events, hotels and gifting programs — every size and style below ships as a bulk run.
            </p>
          </div>
        </Container>
      </section>

      {canvasItems.length > 0 && <BulkSection title="Canvas Bulk Orders" items={canvasItems} />}
      {acrylicItems.length > 0 && <BulkSection title="Acrylic Bulk Orders" items={acrylicItems} />}
      <CatalogueBulkSection />

      <section className="py-8 sm:py-10 border-t border-stone-200/80">
        <Container>
          <p className="text-xs text-stone-500 text-center">
            Prices shown are indicative bulk starting prices per unit at {MIN_BULK_QTY}+ units — final pricing depends on size, finish and exact quantity.
          </p>
        </Container>
      </section>

    </div>
  );
};

export default BulkOrdersPage;
