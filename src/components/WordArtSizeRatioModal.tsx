import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import {
  WORD_ART_SIZE_CATALOG,
  type WordArtRatioTab,
  type WordArtSizeOption
} from '../data/wordArtData';

export interface WordArtSizeRatioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize: (size: WordArtSizeOption) => void;
  onCreateWordArt: (size: WordArtSizeOption) => void;
  currentSelectedSizeId?: string;
  selectedSizeId?: string;
}

const TABS: WordArtRatioTab[] = ['Square', '3:2 Ratio', '4:3 Ratio', '16:9 Ratio'];

export const WordArtSizeRatioModal: React.FC<WordArtSizeRatioModalProps> = ({
  isOpen,
  onClose,
  onSelectSize,
  onCreateWordArt,
  currentSelectedSizeId,
  selectedSizeId: initialSelectedSizeId = 'word-sq-8x8'
}) => {
  const initialId = currentSelectedSizeId || initialSelectedSizeId || 'word-sq-8x8';
  const [activeTab, setActiveTab] = useState<WordArtRatioTab>('Square');
  const [selectedSizeId, setSelectedSizeId] = useState<string>(initialId);

  useEffect(() => {
    const idToUse = currentSelectedSizeId || initialSelectedSizeId;
    if (idToUse) {
      setSelectedSizeId(idToUse);
      for (const tab of TABS) {
        if (WORD_ART_SIZE_CATALOG[tab].some((s) => s.id === idToUse)) {
          setActiveTab(tab);
          break;
        }
      }
    }
  }, [currentSelectedSizeId, initialSelectedSizeId, isOpen]);

  if (!isOpen) return null;

  const currentOptions = WORD_ART_SIZE_CATALOG[activeTab] || WORD_ART_SIZE_CATALOG.Square;

  // Resolve currently selected option object
  const allSizes = [
    ...WORD_ART_SIZE_CATALOG.Square,
    ...WORD_ART_SIZE_CATALOG['3:2 Ratio'],
    ...WORD_ART_SIZE_CATALOG['4:3 Ratio'],
    ...WORD_ART_SIZE_CATALOG['16:9 Ratio']
  ];
  const selectedOption = allSizes.find((s) => s.id === selectedSizeId) || currentOptions[0];

  const handleCardClick = (size: WordArtSizeOption) => {
    setSelectedSizeId(size.id);
    onSelectSize(size);
  };

  const handleCardDoubleClick = (size: WordArtSizeOption) => {
    setSelectedSizeId(size.id);
    onSelectSize(size);
    onCreateWordArt(size);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Styled to match Canvas India brand */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0E4A93] text-white">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-black tracking-tight">
              Select Size of Word Art on Canvas
            </h2>
            <span className="hidden sm:inline-block text-[11px] font-bold text-blue-100 bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
              Personalized Typography
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ratio Tabs */}
        <div className="px-6 pt-3 pb-2 bg-stone-50 border-b border-stone-200 flex gap-2 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0E4A93] text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                }`}
              >
                {tab}
                <span className="ml-1.5 text-[11px] opacity-75 font-semibold">
                  ({WORD_ART_SIZE_CATALOG[tab].length})
                </span>
              </button>
            );
          })}
        </div>

        {/* Size Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[58vh]">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-3.5">
            {currentOptions.map((opt) => {
              const isSelected = selectedSizeId === opt.id;
              // Aspect box dimensions for visual representation
              const maxDim = 32;
              const w = opt.aspectRatio >= 1 ? maxDim : Math.round(maxDim * opt.aspectRatio);
              const h = opt.aspectRatio <= 1 ? maxDim : Math.round(maxDim / opt.aspectRatio);

              return (
                <div
                  key={opt.id}
                  onClick={() => handleCardClick(opt)}
                  onDoubleClick={() => handleCardDoubleClick(opt)}
                  className={`group relative rounded-xl border p-2.5 transition-all cursor-pointer flex flex-col items-center justify-between text-center min-h-[105px] overflow-hidden bg-white hover:border-[#0E4A93]/60 ${
                    isSelected
                      ? 'border-2 border-[#0E4A93] shadow-md bg-blue-50/20 ring-2 ring-[#0E4A93]/20'
                      : 'border-stone-200 shadow-xs hover:shadow-sm'
                  }`}
                >
                  {/* Selected checkmark badge */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 z-10 w-4 h-4 rounded-full bg-[#0E4A93] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Ratio shape miniature icon */}
                  <div className="w-10 h-10 flex items-center justify-center my-0.5">
                    <div
                      style={{ width: `${w}px`, height: `${h}px` }}
                      className={`border rounded-xs transition-colors ${
                        isSelected
                          ? 'border-[#0E4A93] bg-[#0E4A93]/25'
                          : 'border-stone-300 bg-stone-100 group-hover:border-stone-400'
                      }`}
                    />
                  </div>

                  {/* Dimensions and Price */}
                  <div className="w-full mt-1">
                    <p className="text-xs font-bold text-stone-900 leading-tight">
                      {opt.label}
                    </p>
                    <p className="text-[11px] font-black text-[#0E4A93] mt-0.5">
                      ₹{opt.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with "CREATE WORD ART" CTA */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            Selected: <span className="font-extrabold text-stone-800">{selectedOption.label}</span> —{' '}
            <span className="font-black text-[#0E4A93]">₹{selectedOption.price.toFixed(2)}</span>
            <span className="hidden sm:inline text-stone-400 ml-2">| Double-click a card or press button below</span>
          </div>
          <button
            type="button"
            onClick={() => onCreateWordArt(selectedOption)}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0E4A93] hover:bg-[#0a3770] text-white text-sm font-black tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            CREATE WORD ART
          </button>
        </div>
      </div>
    </div>
  );
};
