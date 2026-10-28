import React from 'react';
import { Check } from 'lucide-react';
import { bulkUnitPriceFor, MIN_BULK_QTY } from '../pages/BulkOrdersPage';

export type CustomizerProductIconType =
  | 'block'
  | 'panel'
  | 'wall'
  | 'print'
  | 'collage'
  | 'split'
  | 'signage'
  | 'round'
  | 'triangle'
  | 'heart'
  | 'oval'
  | 'hexagon'
  | 'mosaic'
  | 'lyric'
  | 'painting'
  | 'quotes'
  | 'bus-roll'
  | 'banner'
  | 'pop-art'
  | 'word-art';

export interface CustomizerProductItem {
  id: string;
  name: string;
  price?: number;
  startingPrice: number;
  iconType: CustomizerProductIconType;
  image?: string;
  defaultShape?: string;
  supportedShapes?: string[];
  defaultLayout?: string;
  defaultLayoutId?: string;
  panelsCount?: number;
  description?: string;
  defaultSizeOptionId?: string;
}

export interface CustomizerProductCardProps {
  product: CustomizerProductItem;
  isSelected: boolean;
  onSelect: (productId: string) => void;
  /** When set to a bulk quantity (>= MIN_BULK_QTY), the displayed starting
   * price reflects the same volume discount shown on the Bulk Orders page. */
  bulkQuantity?: number;
}

export const CustomizerProductCard: React.FC<CustomizerProductCardProps> = ({
  product: pt,
  isSelected,
  onSelect,
  bulkQuantity
}) => {
  const rawPrice = typeof pt.price === 'number' && !isNaN(pt.price) ? pt.price : pt.startingPrice;
  const basePrice = typeof rawPrice === 'number' && !isNaN(rawPrice) ? rawPrice : 0;
  const safePrice = bulkQuantity !== undefined && bulkQuantity >= MIN_BULK_QTY
    ? bulkUnitPriceFor(basePrice, bulkQuantity)
    : basePrice;

  return (
    <div
      onClick={() => onSelect(pt.id)}
      className={`relative p-2 rounded-[10px] border transition-all cursor-pointer flex flex-col items-center text-center justify-between h-[126px] sm:h-[128px] overflow-hidden select-none ${
        isSelected
          ? 'border-[#0E4A93] bg-blue-50/20 shadow-xs ring-1 ring-[#0E4A93]/20'
          : 'border-stone-200 hover:border-stone-400 bg-white shadow-none'
      }`}
    >
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#0E4A93] text-white rounded-[3px] flex items-center justify-center shadow-xs z-10">
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
      )}

      {/* Product Icon Geometry matching Screenshot in Blue/Gray */}
      <div className="w-10 h-10 flex items-center justify-center text-slate-500 my-0.5 shrink-0">
        {pt.iconType === 'round' ? (
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 shadow-2xs" />
        ) : pt.iconType === 'triangle' ? (
          <svg viewBox="0 0 32 32" className="w-8 h-8 fill-slate-200 stroke-slate-400 stroke-[1.5]">
            <polygon points="16,4 30,28 2,28" />
          </svg>
        ) : pt.iconType === 'heart' ? (
          <svg viewBox="0 0 32 32" className="w-8 h-8 fill-slate-200 stroke-slate-400 stroke-[1.5]">
            <path d="M16 28 C16 28 3 20 3 10 C3 5 7 2 12 2 C14.5 2 15.5 3.5 16 4.5 C16.5 3.5 17.5 2 20 2 C25 2 29 5 29 10 C29 20 16 28 16 28 Z" />
          </svg>
        ) : pt.iconType === 'oval' ? (
          <div className="w-8 h-6 rounded-[50%] bg-slate-200 border border-slate-300 shadow-2xs" />
        ) : pt.iconType === 'hexagon' ? (
          <svg viewBox="0 0 32 32" className="w-8 h-8 fill-slate-200 stroke-slate-400 stroke-[1.5]">
            <polygon points="16,2 29,9.5 29,24.5 16,32 3,24.5 3,9.5" />
          </svg>
        ) : pt.iconType === 'wall' ? (
          <div className="flex flex-col items-center justify-center gap-0.5 h-8 w-8">
            <div className="w-6 h-1.5 bg-slate-300 border border-slate-400 rounded-xs" />
            <div className="flex gap-0.5">
              <div className="w-2 h-4 bg-slate-300 border border-slate-400 rounded-xs" />
              <div className="w-3.5 h-4 bg-slate-300 border border-slate-400 rounded-xs" />
              <div className="w-2 h-4 bg-slate-300 border border-slate-400 rounded-xs" />
            </div>
            <div className="w-6 h-1.5 bg-slate-300 border border-slate-400 rounded-xs" />
          </div>
        ) : pt.iconType === 'collage' ? (
          <div className="grid grid-cols-2 gap-0.5 w-7 h-7">
            <div className="bg-slate-300 border border-slate-400 rounded-[1px]" />
            <div className="bg-slate-300 border border-slate-400 rounded-[1px]" />
            <div className="bg-slate-300 border border-slate-400 rounded-[1px]" />
            <div className="bg-slate-300 border border-slate-400 rounded-[1px]" />
          </div>
        ) : pt.iconType === 'split' ? (
          <div className="flex gap-1 h-7">
            <div className="w-2 h-7 bg-slate-300 border border-slate-400 rounded-xs" />
            <div className="w-2 h-7 bg-slate-300 border border-slate-400 rounded-xs" />
            <div className="w-2 h-7 bg-slate-300 border border-slate-400 rounded-xs" />
          </div>
        ) : pt.iconType === 'mosaic' ? (
          <div className="grid grid-cols-3 gap-0.5 w-7 h-7 p-0.5 bg-slate-100 border border-slate-400 rounded-xs">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-slate-400 rounded-[1px]" />
            ))}
          </div>
        ) : pt.iconType === 'lyric' ? (
          <div className="w-7 h-7 bg-slate-50 border border-slate-400 rounded-xs p-1 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[8px] text-[#0E4A93] font-bold leading-none">
              <span>♪</span>
              <span>♫</span>
            </div>
            <div className="space-y-0.5">
              <div className="h-0.5 bg-slate-400 rounded" />
              <div className="h-0.5 bg-slate-400 rounded w-3/4" />
            </div>
          </div>
        ) : pt.iconType === 'painting' ? (
          <div className="w-7 h-7 bg-slate-50 border-2 border-slate-400 rounded-xs relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-slate-400" />
            <svg viewBox="0 0 24 24" className="w-full h-full fill-slate-300 stroke-slate-400 stroke-1 mt-2">
              <polygon points="0,24 8,12 16,18 24,10 24,24" />
            </svg>
          </div>
        ) : pt.iconType === 'quotes' ? (
          <div className="w-7 h-7 bg-slate-600 rounded-xs flex flex-col items-center justify-center p-0.5 text-[5px] font-black text-white leading-tight uppercase select-none">
            <span className="flex items-center gap-0.5">♥ LIVE</span>
            <span>LOVE</span>
            <span>LIFE ♥</span>
          </div>
        ) : pt.iconType === 'bus-roll' ? (
          <div className="w-6 h-7 bg-white border border-slate-400 rounded-xs flex flex-col items-center justify-center p-0.5 text-[6.5px] font-black text-slate-700 leading-tight space-y-0.5 uppercase select-none">
            <span className="tracking-widest">ABC</span>
            <span className="tracking-widest border-y border-slate-200 py-0.5">ABC</span>
            <span className="tracking-widest">ABC</span>
          </div>
        ) : pt.iconType === 'banner' ? (
          <div className="relative w-6 h-7 flex flex-col items-center">
            <div className="w-7 h-1 bg-amber-800 rounded-xs mb-0.5" />
            <div className="w-5 h-5 bg-slate-100 border border-slate-300 rounded-xs" />
            <div className="w-7 h-1 bg-amber-800 rounded-xs mt-0.5" />
          </div>
        ) : pt.iconType === 'pop-art' ? (
          <div className="w-7 h-7 bg-blue-50/50 border border-[#0E4A93]/40 rounded-xs flex flex-col items-center justify-center text-[7px] font-black text-[#0E4A93] leading-tight">
            <span>POP</span>
            <span>ART</span>
          </div>
        ) : pt.iconType === 'word-art' ? (
          <div className="relative w-8 h-8 flex flex-col items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-8 h-8 fill-slate-200 stroke-slate-300 stroke-1">
              <path d="M16 28 C16 28 3 20 3 10 C3 5 7 2 12 2 C14.5 2 15.5 3.5 16 4.5 C16.5 3.5 17.5 2 20 2 C25 2 29 5 29 10 C29 20 16 28 16 28 Z" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-[4.5px] font-black text-slate-700 leading-[5px] uppercase select-none pointer-events-none">
              <span className="tracking-tighter">CARE LOVE</span>
              <span className="tracking-tight text-[5px]">HAPPINESS</span>
              <span className="tracking-widest text-[4px]">LIFE FAMILY</span>
              <span className="tracking-tighter text-[3.5px]">FRIEND</span>
            </div>
          </div>
        ) : pt.iconType === 'print' ? (
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-8 h-8 stroke-slate-500 fill-none stroke-[1.5]">
              <polygon points="18,4 32,11 18,18 4,11" className="fill-slate-100 stroke-slate-600" />
              <line x1="18" y1="4" x2="18" y2="18" className="stroke-slate-400 stroke-1 stroke-dashed" />
              <line x1="4" y1="11" x2="32" y2="11" className="stroke-slate-400 stroke-1 stroke-dashed" />
              <polygon points="18,9 32,16 18,23 4,16" className="fill-slate-200/70 stroke-slate-500" />
              <polygon points="18,14 32,21 18,28 4,21" className="fill-slate-300/60 stroke-slate-400" />
            </svg>
          </div>
        ) : pt.iconType === 'block' ? (
          <div className="relative w-6 h-6 flex items-center justify-center">
            <div className="absolute top-1 left-1 w-5 h-5 bg-[#0E4A93]/20 border border-[#0E4A93]/30 rounded-xs" />
            <div className="relative -translate-x-0.5 -translate-y-0.5 w-5 h-5 border-2 border-slate-300 bg-white rounded-xs flex items-center justify-center">
              <div className="w-3 h-3 bg-[#0E4A93]/20 rounded-[1px]" />
            </div>
          </div>
        ) : pt.iconType === 'signage' ? (
          <div className="w-7 h-5 border-2 border-slate-300 rounded-xs bg-white relative flex items-center justify-center">
            <span className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-[#0E4A93]/50" />
            <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-[#0E4A93]/50" />
            <span className="absolute bottom-0.5 left-0.5 w-1 h-1 rounded-full bg-[#0E4A93]/50" />
            <span className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-[#0E4A93]/50" />
            <div className="w-3.5 h-1 bg-[#0E4A93]/35 rounded-full" />
          </div>
        ) : (
          /* Default: Single Print with subtle depth */
          <div className="relative w-6 h-7">
            <div className="absolute inset-0 bg-slate-200 border border-slate-300 rounded-xs shadow-xs" />
            <div className="absolute bottom-0 right-0 left-0 h-1 bg-slate-400 rounded-b-xs" />
          </div>
        )}
      </div>

      <div className="w-full flex flex-col items-center justify-end pb-0.5">
        <div className="text-[11px] font-bold text-stone-900 leading-tight line-clamp-2 h-[26px] flex items-center justify-center px-0.5" title={pt.name}>
          {pt.name}
        </div>
        <div className="text-[10px] font-medium text-stone-400 leading-none mt-1">
          Starts at
        </div>
        <div
          className={`text-xs font-black leading-tight mt-0.5 ${
            isSelected ? 'text-[#0E4A93]' : 'text-stone-900'
          }`}
        >
          ₹{safePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
};

export interface CustomizerProductSelectorProps {
  activeMaterial: 'canvas' | 'acrylic';
  products: CustomizerProductItem[];
  selectedProductId: string;
  onSelectProduct: (productId: string) => void;
  onSwitchMaterial: () => void;
  /** When set to a bulk quantity (>= MIN_BULK_QTY), every card's displayed
   * starting price reflects the same volume discount shown on the Bulk
   * Orders page. */
  bulkQuantity?: number;
}

const MATERIAL_TABS = ['CANVAS', 'ACRYLIC'] as const;

export const CustomizerProductSelector: React.FC<CustomizerProductSelectorProps> = ({
  activeMaterial,
  products,
  selectedProductId,
  onSelectProduct,
  onSwitchMaterial,
  bulkQuantity
}) => {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="flex flex-col h-full">
      {/* Material Toggle Bar: CANVAS & ACRYLIC only */}
      <div className="grid grid-cols-2 border-b border-stone-200 text-xs font-black uppercase tracking-wider shrink-0 bg-[#F8F9FA]">
        {MATERIAL_TABS.map((tab) => {
          const isTabActive =
            (tab === 'CANVAS' && activeMaterial === 'canvas') ||
            (tab === 'ACRYLIC' && activeMaterial === 'acrylic');

          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                if (tab === 'CANVAS' && activeMaterial !== 'canvas') {
                  onSwitchMaterial();
                } else if (tab === 'ACRYLIC' && activeMaterial !== 'acrylic') {
                  onSwitchMaterial();
                }
              }}
              className={`text-center py-2.5 transition-colors font-extrabold flex items-center justify-center gap-1 cursor-pointer ${
                isTabActive
                  ? 'bg-white text-[#0E4A93] border-b-2 border-[#0E4A93]'
                  : 'bg-[#F8F9FA] text-stone-500 hover:text-stone-800 border-b-2 border-transparent'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 4-column Product Grid matching Screenshot */}
      <div className="p-2 sm:p-2.5 overflow-y-auto flex-1 min-h-0 no-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2.5 gap-y-2">
          {safeProducts.map((pt) => (
            <CustomizerProductCard
              key={pt.id}
              product={pt}
              isSelected={selectedProductId === pt.id}
              onSelect={onSelectProduct}
              bulkQuantity={bulkQuantity}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomizerProductSelector;

