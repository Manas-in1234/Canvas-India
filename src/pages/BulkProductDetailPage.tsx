import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Heart, FileText, Percent, Truck, PackageCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getBulkItem, MIN_BULK_QTY, BULK_DISCOUNT } from './BulkOrdersPage';
import { NotFoundPage } from './NotFoundPage';

const QTY_TIERS = [50, 100, 150, 200, 300, 500];

const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-[1200px] mx-auto px-4 sm:px-8 ${className}`}>{children}</div>
);

export const BulkProductDetailPage: React.FC = () => {
  const { material, slug } = useParams<{ material: string; slug: string }>();
  const navigate = useNavigate();
  const { onOpenQuote } = useShop();

  const item = useMemo(() => (material && slug ? getBulkItem(material, slug) : undefined), [material, slug]);

  const [quantity, setQuantity] = useState<number>(MIN_BULK_QTY);

  useEffect(() => {
    setQuantity(MIN_BULK_QTY);
    if (item) {
      document.title = `Bulk ${item.name} | Canvas India`;
    }
  }, [item]);

  if (!item) {
    return <NotFoundPage />;
  }

  const bulkUnitPrice = Math.round(item.unitPrice * BULK_DISCOUNT);
  const totalPrice = bulkUnitPrice * quantity;

  const handleContinueToCustomize = () => {
    const separator = item.customizeHref.includes('?') ? '&' : '?';
    navigate(`${item.customizeHref}${separator}qty=${quantity}`);
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

          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/70 aspect-[4/3]">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            <button
              type="button"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xs cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 text-stone-600" />
            </button>
          </div>

          {/* Info + Purchase */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">Bulk {item.name}</h1>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                Order {item.name.toLowerCase()} in volume for offices, events, hotels and gifting programs — start leaving an unforgettable mark on every wall you print for.
              </p>
            </div>

            <ul className="space-y-2 text-sm text-stone-700">
              <li className="flex items-start gap-2">
                <PackageCheck className="w-4 h-4 text-[#0E4A93] shrink-0 mt-0.5" />
                <span><strong>Lower cost per unit</strong> — the more you order, the less each piece costs.</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-[#0E4A93] shrink-0 mt-0.5" />
                <span>GST invoice available on every bulk order.</span>
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
                className="w-full sm:w-56 px-3 py-2.5 text-sm font-semibold bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#0E4A93]"
              >
                {QTY_TIERS.map((q) => (
                  <option key={q} value={q}>{q} units</option>
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
      </Container>
    </div>
  );
};

export default BulkProductDetailPage;
