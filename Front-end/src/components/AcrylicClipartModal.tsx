import React, { useState } from 'react';
import {
  X,
  Smile,
  Trash2,
  Copy,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Palette
} from 'lucide-react';
import {
  CLIPART_ITEMS,
  CLIPART_CATEGORY_NAMES,
  ClipartItem,
  ClipartCategoryName
} from '../data/acrylicClipartData';

export interface ClipartElement {
  id: string;
  clipartId: string;
  name: string;
  svgPath: string;
  viewBox: string;
  color: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface AcrylicClipartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClipart: (item: ClipartItem) => void;
  activeClipart: ClipartElement | null;
  onUpdateClipart: (updates: Partial<ClipartElement>) => void;
  onDuplicateClipart: () => void;
  onDeleteClipart: () => void;
}

export const AcrylicClipartModal: React.FC<AcrylicClipartModalProps> = ({
  isOpen,
  onClose,
  onAddClipart,
  activeClipart,
  onUpdateClipart,
  onDuplicateClipart,
  onDeleteClipart
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ClipartCategoryName>('Celebration');

  const filteredItems = CLIPART_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <>
      {/* Floating Active Clipart Controls Bar (When an item is selected on canvas) */}
      {activeClipart && (
        <div
          className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-xl border border-stone-200 flex items-center gap-2 select-none animate-in fade-in slide-in-from-top-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[11px] font-extrabold text-stone-800 pr-2 border-r border-stone-200 flex items-center gap-1">
            <Smile className="w-3.5 h-3.5 text-[#E8752A]" />
            <span>{activeClipart.name}</span>
          </div>

          {/* Scale Buttons */}
          <div className="flex items-center gap-1 bg-stone-100 px-1.5 py-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => onUpdateClipart({ scale: Math.max(0.4, Number((activeClipart.scale - 0.15).toFixed(2))) })}
              className="w-5 h-5 rounded flex items-center justify-center hover:bg-white text-stone-700 font-bold text-xs cursor-pointer"
              title="Shrink Clipart"
            >
              −
            </button>
            <span className="text-[11px] font-bold text-stone-800 min-w-[32px] text-center">
              {(activeClipart.scale || 1).toFixed(2)}x
            </span>
            <button
              type="button"
              onClick={() => onUpdateClipart({ scale: Math.min(3.0, Number((activeClipart.scale + 0.15).toFixed(2))) })}
              className="w-5 h-5 rounded flex items-center justify-center hover:bg-white text-stone-700 font-bold text-xs cursor-pointer"
              title="Enlarge Clipart"
            >
              +
            </button>
          </div>

          {/* Rotate Button */}
          <button
            type="button"
            onClick={() => onUpdateClipart({ rotation: ((activeClipart.rotation || 0) + 45) % 360 })}
            className="flex items-center gap-1 text-[11px] font-bold text-stone-700 hover:text-[#0E4A93] bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            title="Rotate 45°"
          >
            <RotateCw className="w-3 h-3" />
            <span>{activeClipart.rotation || 0}°</span>
          </button>

          {/* Color Picker Swatches for Vector Fill */}
          <div className="flex items-center gap-1 pl-1 border-l border-stone-200">
            {['#FFFFFF', '#000000', '#D4AF37', '#EF4444', '#0E4A93', '#10B981'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onUpdateClipart({ color: c })}
                style={{ backgroundColor: c }}
                className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                  activeClipart.color === c ? 'border-[#0E4A93] scale-125 ring-1 ring-[#0E4A93]' : 'border-stone-300'
                }`}
              />
            ))}
          </div>

          {/* Duplicate & Delete */}
          <button
            type="button"
            onClick={onDuplicateClipart}
            className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
            title="Duplicate Clipart"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDeleteClipart}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
            title="Delete Clipart"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Clipart Library Picker Dialog */}
      {isOpen && (
        <div
          className="absolute top-14 right-4 z-40 bg-white border border-stone-200 rounded-2xl shadow-2xl p-4 w-96 max-w-[calc(100vw-2rem)] select-none animate-in fade-in slide-in-from-top-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-200 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E8752A]/10 text-[#E8752A] flex items-center justify-center font-bold">
                <Smile className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-stone-900">Visual Clipart Library</h3>
                <p className="text-[10px] text-stone-500 font-medium">Click any vector sticker to place on preview</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 12 Categories Horizontal Scroll / Tab Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-thin">
            {CLIPART_CATEGORY_NAMES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0E4A93] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Visual Vector Clipart Grid (Crisp SVG paths) */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 p-2 bg-stone-50 rounded-xl max-h-60 overflow-y-auto border border-stone-100">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onAddClipart(item)}
                className="group relative flex flex-col items-center justify-center p-2 bg-white hover:bg-stone-100/90 border border-stone-200/80 hover:border-[#0E4A93]/40 rounded-xl transition-all hover:scale-105 hover:shadow-sm cursor-pointer"
                title={item.name}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center text-stone-700 group-hover:text-[#0E4A93] transition-colors"
                  dangerouslySetInnerHTML={{
                    __html: `<svg viewBox="${item.viewBox}" width="28" height="28">${item.svgPath}</svg>`
                  }}
                />
                <span className="text-[9px] font-semibold text-stone-600 truncate w-full text-center mt-1 group-hover:text-stone-900">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
