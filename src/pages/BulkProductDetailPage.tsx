import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, Heart, Percent, Truck, PackageCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getBulkItem, buildBulkItems, QTY_PRICE_TIERS, bulkUnitPriceFor, MIN_BULK_QTY } from './BulkOrdersPage';
import { NotFoundPage } from './NotFoundPage';

const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-[1200px] mx-auto px-4 sm:px-8 ${className}`}>{children}</div>
);

const FAQS = [
  {
    q: 'How does bulk pricing work?',
    a: 'The per-unit price drops automatically as your order quantity goes up — pick a quantity below the price updates to that tier right away. Final pricing can vary slightly by size and finish; request a quote for an exact itemized estimate.',
  },
  {
    q: 'Can every piece have a different photo?',
    a: 'Yes. Bulk orders aren’t limited to one repeated image — once you continue to the customizer, you can set up each piece individually before checkout, or send us your files for a batch setup via "Request a Quote Instead".',
  },
  {
    q: 'Do you provide a GST invoice?',
    a: 'Yes, every bulk order ships with a GST invoice for your business records.',
  },
  {
    q: 'What’s the turnaround time?',
    a: 'Bulk runs typically take longer than a single print due to production volume. Exact timelines depend on quantity, size and finish — we’ll confirm a delivery date when you request a quote.',
  },
];

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-200 py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
      >
        <span className="text-sm font-bold text-stone-900">{q}</span>
        <ChevronDown className={`w-4 h-4 text-stone-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="text-sm text-stone-600 mt-2 leading-relaxed">{a}</p>}
    </div>
  );
};

export const BulkProductDetailPage: React.FC = () => {
  const { material, slug } = useParams<{ material: string; slug: string }>();
  const navigate = useNavigate();
  const { onOpenQuote } = useShop();

  const item = useMemo(() => (material && slug ? getBulkItem(material, slug) : undefined), [material, slug]);

  const [quantity, setQuantity] = useState<number>(MIN_BULK_QTY);
  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(0);

  useEffect(() => {
    setQuantity(MIN_BULK_QTY);
    setActiveVariantIndex(0);
    if (item) {
      document.title = `Bulk ${item.name} | Canvas India`;
    }
  }, [item]);

  const otherItems = useMemo(() => {
    if (!item) return [];
    return buildBulkItems()
      .filter((i) => i.material === item.material && i.slug !== item.slug)
      .slice(0, 5);
  }, [item]);

  if (!item) {
    return <NotFoundPage />;
  }

  const activeVariant = item.variants[activeVariantIndex] || item.variants[0];
  const bulkUnitPrice = bulkUnitPriceFor(activeVariant.price, quantity);
  const totalPrice = bulkUnitPrice * quantity;

  const handleContinueToCustomize = () => {
    const separator = activeVariant.customizeHref.includes('?') ? '&' : '?';
    navigate(`${activeVariant.customizeHref}${separator}qty=${quantity}`);
  };

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope py-6 sm:py-10">
      <Container>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link to="/bulk-order" className="hover:text-[#0E4A93] transition-colors">Bulk &amp; Corporate Orders</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-medium">Bulk {item.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Gallery — each thumbnail is its own selectable layout/style,
              not just a different preview photo. */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/70 aspect-square">
              <img src={activeVariant.image} alt={activeVariant.name} className="w-full h-full object-contain" />
              <button
                type="button"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xs cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 text-stone-600" />
              </button>
            </div>
            {item.variants.length > 1 && (
              <div className="flex gap-2.5 mt-3 overflow-x-auto">
                {item.variants.map((variant, idx) => (
                  <button
                    key={`${variant.name}-${idx}`}
                    type="button"
                    onClick={() => setActiveVariantIndex(idx)}
                    title={variant.name}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      idx === activeVariantIndex ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={variant.image} alt={variant.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info + Purchase */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">Bulk {activeVariant.name}</h1>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                Order {activeVariant.name.toLowerCase()} in volume for offices, events, hotels and gifting programs — start leaving an unforgettable mark on every wall you print for.
              </p>
            </div>

            <ul className="space-y-2 text-sm text-stone-700">
              <li className="flex items-start gap-2">
                <PackageCheck className="w-4 h-4 text-[#0E4A93] shrink-0 mt-0.5" />
                <span><strong>Lower cost per unit</strong> — the more you order, the less each piece costs.</span>
              </li>
              <li className="flex items-start gap-2">
                <Percent className="w-4 h-4 text-[#0E4A93] shrink-0 mt-0.5" />
                <span>Volume discounts apply automatically above {MIN_BULK_QTY} units.</span>
              </li>
              <li className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#0E4A93] shrink-0 mt-0.5" />
                <span>Fast turnaround and pan-India delivery on every bulk run.</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-stone-200">
              <div className="text-3xl font-extrabold text-stone-950 mt-3">
                ₹{totalPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-stone-500 mt-0.5">
                ₹{bulkUnitPrice.toLocaleString('en-IN')} each / {quantity} units
              </div>
            </div>

            <div>
              <label htmlFor="bulk-qty" className="text-sm font-bold text-stone-900 block mb-1.5">
                Quantity<span className="text-[#E8752A]">*</span>
              </label>
              <select
                id="bulk-qty"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full sm:w-72 px-3 py-2.5 text-sm font-semibold bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#0E4A93]"
              >
                {QTY_PRICE_TIERS.map((tier) => (
                  <option key={tier.qty} value={tier.qty}>
                    {tier.qty} units — ₹{bulkUnitPriceFor(activeVariant.price, tier.qty).toLocaleString('en-IN')} each
                  </option>
                ))}
              </select>
              <p className="text-xs text-stone-400 mt-1.5">Minimum: {MIN_BULK_QTY} units</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleContinueToCustomize}
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold text-sm transition-all cursor-pointer"
              >
                Continue to Customize ({quantity} units)
              </button>
              <button
                type="button"
                onClick={onOpenQuote}
                className="flex-1 py-3.5 px-6 rounded-xl border-2 border-stone-300 text-stone-700 hover:border-stone-400 font-bold text-sm transition-all cursor-pointer"
              >
                Request a Quote Instead
              </button>
            </div>
          </div>

        </div>

        {/* Pricing guide */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <h2 className="text-lg font-bold text-stone-900 mb-3">Volume Pricing Guide</h2>
          <div className="rounded-xl border border-stone-200 overflow-hidden text-sm bg-white divide-y divide-stone-100 max-w-md">
            {QTY_PRICE_TIERS.map((tier) => {
              const tierPrice = bulkUnitPriceFor(activeVariant.price, tier.qty);
              const isActive = tier.qty === quantity;
              return (
                <button
                  key={tier.qty}
                  type="button"
                  onClick={() => setQuantity(tier.qty)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left cursor-pointer transition-colors ${isActive ? 'bg-blue-50/60' : 'hover:bg-stone-50'}`}
                >
                  <span className={`font-semibold ${isActive ? 'text-[#0E4A93]' : 'text-stone-800'}`}>{tier.qty}+ units</span>
                  <span className={`font-bold ${isActive ? 'text-[#0E4A93]' : 'text-stone-900'}`}>₹{tierPrice.toLocaleString('en-IN')} each</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-12 pt-8 border-t border-stone-200 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-lg font-bold text-stone-900 mb-3">Bulk Order Guidelines</h2>
            <ul className="space-y-2 text-sm text-stone-600 list-disc pl-4">
              <li>Minimum order quantity is {MIN_BULK_QTY} units per style.</li>
              <li>Mix sizes or finishes within one bulk order — pricing is calculated on total quantity.</li>
              <li>For orders exceeding ₹20,000 in value, request a quote for assisted setup.</li>
              <li>Handcrafted in India — every piece is printed and finished at our own facility.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 mb-3">Frequently Asked Questions</h2>
            <div>
              {FAQS.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </div>

        {/* Other bulk styles */}
        {otherItems.length > 0 && (
          <div className="mt-12 pt-8 border-t border-stone-200">
            <h2 className="text-lg font-bold text-stone-900 mb-4">
              More {item.material === 'canvas' ? 'Canvas' : 'Acrylic'} Bulk Orders
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
              {otherItems.map((other) => {
                const otherPrice = bulkUnitPriceFor(other.unitPrice, MIN_BULK_QTY);
                return (
                  <Link
                    key={`${other.material}-${other.slug}`}
                    to={`/bulk-order/${other.material}/${other.slug}`}
                    className="group text-left cursor-pointer block"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200/70 group-hover:border-[#0E4A93]/40 group-hover:shadow-md transition-all">
                      <img src={other.image} alt={other.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="mt-2 text-sm font-bold text-stone-900 group-hover:text-[#0E4A93] transition-colors">
                      Bulk {other.name}
                    </div>
                    <div className="text-xs font-semibold text-stone-700 mt-0.5">
                      From ₹{otherPrice.toLocaleString('en-IN')} each
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </Container>
    </div>
  );
};

export default BulkProductDetailPage;
