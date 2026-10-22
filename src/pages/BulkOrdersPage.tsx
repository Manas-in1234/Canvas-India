import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Building2, FileText, Percent, Zap, Heart, PackageCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CANVAS_STYLE_LANDING_DATA } from '../data/canvasStyleLandingData';
import { ACRYLIC_STYLE_LANDING_DATA } from '../data/acrylicStyleLandingData';

const SERIF = '"Playfair Display", Georgia, serif';
const BLUE = '#0E4A93';
const ORANGE = '#E8752A';

// Every bulk order, regardless of material, ships at this minimum run.
const MIN_BULK_QTY = 50;
// Flat per-unit discount applied to a style's normal starting price once
// ordered at bulk — these are quote-based, not live cart prices.
const BULK_DISCOUNT = 0.8;

interface BulkItem {
  name: string;
  image: string;
  unitPrice: number;
}

const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 ${className}`}>{children}</div>
);

const BulkSection: React.FC<{ title: string; items: BulkItem[]; onQuote: () => void }> = ({ title, items, onQuote }) => (
  <section className="py-8 sm:py-10">
    <Container>
      <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-5">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {items.map((item) => {
          const bulkPrice = Math.round(item.unitPrice * BULK_DISCOUNT);
          return (
            <button
              key={item.name}
              type="button"
              onClick={onQuote}
              className="group text-left cursor-pointer"
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
            </button>
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

  const canvasItems: BulkItem[] = useMemo(
    () =>
      Object.values(CANVAS_STYLE_LANDING_DATA)
        .filter((d) => d.styles[0]?.image)
        .map((d) => ({ name: d.pageTitle, image: d.styles[0].image!, unitPrice: d.styles[0].price })),
    []
  );

  const acrylicItems: BulkItem[] = useMemo(
    () =>
      Object.values(ACRYLIC_STYLE_LANDING_DATA)
        .filter((d) => d.styles[0]?.image)
        .map((d) => ({ name: d.pageTitle, image: d.styles[0].image!, unitPrice: d.styles[0].price })),
    []
  );

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0A1C3D] via-[#0E4A93] to-[#145DB8] text-white">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#E8752A]/25 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <Container className="relative py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold">Bulk &amp; Corporate Orders</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>B2B &amp; Bulk Solutions</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" style={{ fontFamily: SERIF }}>
            Bulk &amp; Corporate Orders
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/85 max-w-2xl leading-relaxed">
            Canvas and acrylic prints at volume pricing for offices, events, hotels and gifting programs — every size and style below ships as a bulk run.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {[
              { icon: PackageCheck, label: `Minimum Order: ${MIN_BULK_QTY} Units` },
              { icon: FileText, label: 'GST Invoice Available' },
              { icon: Percent, label: 'Volume Discounts' },
              { icon: Zap, label: 'Fast Turnaround Across India' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/90">
                <Icon className="w-3.5 h-3.5 text-amber-300" />
                {label}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenQuote}
            className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#FF8A3D] to-[#E8752A] hover:brightness-110 text-white text-sm font-bold shadow-xl cursor-pointer transition"
          >
            Get a Custom Quote
          </button>
        </Container>
      </section>

      {canvasItems.length > 0 && <BulkSection title="Canvas Bulk Orders" items={canvasItems} onQuote={onOpenQuote} />}
      {acrylicItems.length > 0 && <BulkSection title="Acrylic Bulk Orders" items={acrylicItems} onQuote={onOpenQuote} />}

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
