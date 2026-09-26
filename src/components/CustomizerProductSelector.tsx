import React from 'react';
import { Check } from 'lucide-react';

export type CustomizerProductIconType =
  | 'block'
  | 'panel'
  | 'wall'
  | 'print'
  | 'collage'
  | 'split'
  | 'signage';

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
}

export const CustomizerProductCard: React.FC<CustomizerProductCardProps> = ({
  product: pt,
  isSelected,
  onSelect
}) => {
  const rawPrice = typeof pt.price === 'number' && !isNaN(pt.price) ? pt.price : pt.startingPrice;
  const safePrice = typeof rawPrice === 'number' && !isNaN(rawPrice) ? rawPrice : 0;

  return (
    <div
      onClick={() => onSelect(pt.id)}
      className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center justify-between min-h-[104px] ${
        isSelected ? 'border-[#0E4A93] bg-blue-50/30 shadow-xs ring-1 ring-[#0E4A93]/20' : 'border-stone-200 hover:border-stone-400 bg-white'
      }`}
    >
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#0E4A93] text-white rounded flex items-center justify-center shadow-xs">
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
      )}

      <div className="w-8 h-8 flex items-center justify-center text-stone-500 my-1">
        {pt.iconType === 'wall' && (
          pt.panelsCount === 1 && pt.defaultShape ? (
            <div className="w-7 h-5 border-2 border-stone-400 bg-[#0E4A93]/20 rounded-xs" />
          ) : (
            <div className="space-y-1">
              <div className="w-6 h-2.5 bg-[#0E4A93]/40 rounded-xs" />
              <div className="flex gap-1">
                <div className="w-2.5 h-3 bg-[#0E4A93]/40 rounded-xs" />
                <div className="w-2.5 h-3 bg-[#0E4A93]/40 rounded-xs" />
              </div>
            </div>
          )
        )}
        {pt.iconType === 'panel' && (
          pt.defaultShape === 'shape-rectangle' || pt.defaultShape === 'shape-landscape' ? (
            <div className="w-7 h-5 border-2 border-stone-400 rounded-xs" />
          ) : (
            <div className="w-6 h-6 border-2 border-stone-400 rounded-xs" />
          )
        )}
        {pt.iconType === 'print' && <div className="w-7 h-5 border-2 border-stone-400 rounded-xs" />}
        {pt.iconType === 'collage' && (
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-3 h-3 bg-[#0E4A93]/40 rounded-xs" />
            <div className="w-3 h-3 bg-[#0E4A93]/40 rounded-xs" />
            <div className="w-3 h-3 bg-[#0E4A93]/40 rounded-xs" />
            <div className="w-3 h-3 bg-[#0E4A93]/40 rounded-xs" />
          </div>
        )}
        {pt.iconType === 'split' && (
          <div className="flex gap-1">
            <div className="w-2 h-6 bg-[#0E4A93]/40 rounded-xs" />
            <div className="w-2 h-6 bg-[#0E4A93]/40 rounded-xs" />
            <div className="w-2 h-6 bg-[#0E4A93]/40 rounded-xs" />
          </div>
        )}
        {pt.iconType === 'block' && (
          <div className="relative w-6 h-6 flex items-center justify-center">
            <div className="absolute top-1 left-1 w-5 h-5 bg-[#0E4A93]/30 border border-[#0E4A93]/40 rounded-xs" />
            <div className="relative -translate-x-0.5 -translate-y-0.5 w-5 h-5 border-2 border-stone-400 bg-white rounded-xs flex items-center justify-center">
              <div className="w-3 h-3 bg-[#0E4A93]/25 rounded-[1px]" />
            </div>
          </div>
        )}
        {pt.iconType === 'signage' && (
          <div className="w-7 h-5 border-2 border-stone-400 rounded-xs flex items-center justify-center">
            <div className="w-4 h-1.5 bg-[#0E4A93]/40 rounded-xs" />
          </div>
        )}
      </div>

      <div>
        <div className="text-xs font-bold text-stone-900 leading-tight">{pt.name}</div>
        <div className={`text-[11px] font-semibold mt-0.5 ${isSelected ? 'text-[#0E4A93]' : 'text-stone-500'}`}>
          Starts at ₹{safePrice.toLocaleString('en-IN')}
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
}

export const CustomizerProductSelector: React.FC<CustomizerProductSelectorProps> = ({
  activeMaterial,
  products,
  selectedProductId,
  onSelectProduct,
  onSwitchMaterial
}) => {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="flex flex-col h-full">
      {/* Material Toggle Bar: CANVAS vs ACRYLIC */}
      <div className="flex items-center border-b border-stone-200 text-xs font-black uppercase tracking-wider shrink-0 bg-stone-100">
        <button
          type="button"
          onClick={activeMaterial === 'acrylic' ? onSwitchMaterial : undefined}
          className={
            activeMaterial === 'canvas'
              ? 'flex-1 text-center py-3 bg-white text-[#0E4A93] border-b-2 border-[#0E4A93] shadow-xs cursor-default font-extrabold flex items-center justify-center gap-1.5'
              : 'flex-1 text-center py-3 bg-stone-100 text-stone-500 hover:text-[#0E4A93] hover:bg-stone-50 border-b-2 border-transparent transition-colors cursor-pointer font-bold flex items-center justify-center gap-1.5'
          }
        >
          {activeMaterial === 'canvas' && <span className="w-2 h-2 rounded-full bg-[#0E4A93]" />}
          CANVAS
        </button>
        <button
          type="button"
          onClick={activeMaterial === 'canvas' ? onSwitchMaterial : undefined}
          className={
            activeMaterial === 'acrylic'
              ? 'flex-1 text-center py-3 bg-white text-[#0E4A93] border-b-2 border-[#0E4A93] shadow-xs cursor-default font-extrabold flex items-center justify-center gap-1.5'
              : 'flex-1 text-center py-3 bg-stone-100 text-stone-500 hover:text-[#0E4A93] hover:bg-stone-50 border-b-2 border-transparent transition-colors cursor-pointer font-bold flex items-center justify-center gap-1.5'
          }
        >
          {activeMaterial === 'acrylic' && <span className="w-2 h-2 rounded-full bg-[#0E4A93]" />}
          ACRYLIC
        </button>
      </div>

      <div className="p-4 space-y-2 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2.5">
          {safeProducts.map((pt) => (
            <CustomizerProductCard
              key={pt.id}
              product={pt}
              isSelected={selectedProductId === pt.id}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomizerProductSelector;
