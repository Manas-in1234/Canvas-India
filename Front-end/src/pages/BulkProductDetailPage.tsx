import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, Heart, Percent, Truck, PackageCheck } from 'lucide-react';
import { getBulkItem, buildBulkItems, QTY_PRICE_TIERS, bulkUnitPriceFor, MIN_BULK_QTY } from './BulkOrdersPage';
import { NotFoundPage } from './NotFoundPage';

const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-[1200px] mx-auto px-4 sm:px-8 ${className}`}>{children}</div>
);

const FAQS = [
  {
    q: 'How does bulk pricing work?',
    a: 'The per-unit price drops automatically as your order quantity goes up — pick a quantity below and the price updates to that tier right away. Final pricing can vary slightly by size and finish.',
  },
  {
    q: 'Can every piece have a different photo?',
    a: 'Yes. Bulk orders aren’t limited to one repeated image — once you continue to the customizer, you can set up each piece individually before checkout.',
  },
  {
    q: 'Do you provide a GST invoice?',
    a: 'Yes, every bulk order ships with a GST invoice for your business records.',
  },
  {
    q: 'What’s the turnaround time?',
    a: 'Bulk runs typically take longer than a single print due to production volume. Exact timelines depend on quantity, size and finish — estimated delivery dates are displayed during checkout.',
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

  const item = useMemo(() => (material && slug ? getBulkItem(material, slug) : undefined), [material, slug]);

  const [quantity, setQuantity] = useState<number>(MIN_BULK_QTY);
  const [customBulkQty, setCustomBulkQty] = useState<string>('');
  const [customQtyError, setCustomQtyError] = useState<string>('');
  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlQty = parseInt(params.get('qty') || '', 10);
    const initialQty = !isNaN(urlQty) && urlQty >= MIN_BULK_QTY ? urlQty : MIN_BULK_QTY;
    setQuantity(initialQty);
    setCustomBulkQty(urlQty && !QTY_PRICE_TIERS.some((t) => t.qty === urlQty) ? String(urlQty) : '');
    setCustomQtyError('');
    setActiveVariantIndex(0);
    if (item) {
      document.title = `Bulk ${item.name} | Canvas India`;
    }
  }, [item]);

  const handleApplyCustomQty = () => {
    const n = parseInt(customBulkQty, 10);
    if (isNaN(n) || n < MIN_BULK_QTY) {
      setCustomQtyError(`Minimum bulk order: ${MIN_BULK_QTY} units`);
      return;
    }
    setCustomQtyError('');
    setQuantity(n);
  };

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
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-stone-600 mb-2">
                  <span className="font-bold text-stone-800">
                    Select Design ({item.variants.length} available)
                  </span>
                  <span className="text-[11px] text-[#0E4A93] font-semibold">
                    Selected: #{String(activeVariantIndex + 1).padStart(2, '0')} — {activeVariant.name}
                  </span>
                </div>
                <div
                  className={`gap-2 ${
                    item.variants.length > 6
                      ? 'grid grid-cols-5 sm:grid-cols-6 max-h-64 overflow-y-auto p-2 border border-stone-200/80 rounded-xl bg-stone-50/60'
                      : 'flex overflow-x-auto pb-1'
                  }`}
                >
                  {item.variants.map((variant, idx) => (
                    <button
                      key={`${variant.name}-${idx}`}
                      type="button"
                      onClick={() => setActiveVariantIndex(idx)}
                      title={variant.name}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        item.variants.length <= 6 ? 'w-16 h-16 shrink-0' : 'w-full'
                      } ${
                        idx === activeVariantIndex
                          ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/30 shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100 bg-white'
                      }`}
                    >
                      <img src={variant.image} alt={variant.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-stone-900/70 text-white text-[9px] font-bold text-center leading-tight py-0.5">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                    </button>
                  ))}
                </div>
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

            {/* Quantity Controls: Preset dropdown (1st image) + Custom quantity input (2nd image) side-by-side */}
            <div className="pt-1">
              <div className="flex flex-wrap items-start gap-5 sm:gap-6">
                {/* 1st image: Quantity Dropdown Sector */}
                <div className="flex-1 min-w-[220px] max-w-[280px]">
                  <label htmlFor="bulk-qty" className="text-sm font-bold text-stone-900 block mb-1.5">
                    Quantity<span className="text-[#E8752A]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="bulk-qty"
                      value={QTY_PRICE_TIERS.some((t) => t.qty === quantity) ? quantity : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setQuantity(Number(e.target.value));
                          setCustomBulkQty('');
                          setCustomQtyError('');
                        }
                      }}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#0E4A93] h-[44px] cursor-pointer appearance-none pr-9 text-stone-900 shadow-2xs"
                    >
                      {!QTY_PRICE_TIERS.some((t) => t.qty === quantity) && (
                        <option value="">Custom: {quantity} units</option>
                      )}
                      {QTY_PRICE_TIERS.map((tier) => (
                        <option key={tier.qty} value={tier.qty}>
                          {tier.qty} units — ₹{bulkUnitPriceFor(activeVariant.price, tier.qty).toLocaleString('en-IN')} each
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-700 pointer-events-none" />
                  </div>
                  <p className="text-xs text-stone-400 mt-1.5 font-normal">Minimum: {MIN_BULK_QTY} units</p>
                </div>

                {/* 2nd image: Custom Quantity Sector */}
                <div className="shrink-0">
                  <label htmlFor="custom-bulk-qty" className="text-sm font-bold text-stone-800 block mb-1.5">
                    Or enter a custom quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="custom-bulk-qty"
                      type="number"
                      min={MIN_BULK_QTY}
                      value={customBulkQty}
                      onChange={(e) => {
                        setCustomBulkQty(e.target.value);
                        if (customQtyError) setCustomQtyError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleApplyCustomQty();
                        }
                      }}
                      placeholder={`${MIN_BULK_QTY}+`}
                      className="w-24 px-3 py-2.5 text-sm font-medium rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#0E4A93] h-[44px] shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomQty}
                      className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-stone-300 text-stone-800 hover:border-[#0E4A93] hover:text-[#0E4A93] hover:bg-blue-50/40 bg-white transition-colors cursor-pointer shadow-2xs h-[44px]"
                    >
                      Apply
                    </button>
                  </div>
                  {customQtyError ? (
                    <p className="text-xs text-rose-600 mt-1.5 font-medium">{customQtyError}</p>
                  ) : (
                    <p className="text-xs text-stone-400 mt-1.5 font-normal">
                      Minimum bulk order: {MIN_BULK_QTY} units
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleContinueToCustomize}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold text-sm transition-all cursor-pointer"
              >
                {item.material === 'cork' && !activeVariant.customizeHref.includes('customiz')
                  ? `Proceed to Order (${quantity} units)`
                  : `Continue to Customize (${quantity} units)`}
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
              const activeTier = [...QTY_PRICE_TIERS].reverse().find((t) => quantity >= t.qty) || QTY_PRICE_TIERS[0];
              const isActive = tier.qty === activeTier.qty;
              return (
                <button
                  key={tier.qty}
                  type="button"
                  onClick={() => { setQuantity(tier.qty); setCustomBulkQty(''); setCustomQtyError(''); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left cursor-pointer transition-colors ${isActive ? 'bg-blue-50/60' : 'hover:bg-stone-50'}`}
                >
                  <span className={`font-semibold ${isActive ? 'text-[#0E4A93]' : 'text-stone-800'}`}>
                    {tier.qty}+ units {isActive && quantity !== tier.qty ? `(Active: ${quantity} units)` : ''}
                  </span>
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
              More {item.material === 'canvas' ? 'Canvas' : item.material === 'acrylic' ? 'Acrylic' : 'Cork'} Bulk Orders
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
