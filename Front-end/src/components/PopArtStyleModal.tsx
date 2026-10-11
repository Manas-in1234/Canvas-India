import React, { useState, useEffect } from 'react';
import { X, Check, Info, Sparkles, ArrowRight } from 'lucide-react';
import {
  PopArtStyleOption,
  PopArtStyleId,
  POP_ART_STYLES
} from '../data/popArtData';

export interface PopArtStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStyleId: PopArtStyleId;
  onSelectStyle: (style: PopArtStyleOption) => void;
}

export const PopArtStyleModal: React.FC<PopArtStyleModalProps> = ({
  isOpen,
  onClose,
  selectedStyleId,
  onSelectStyle
}) => {
  const [activeInfoStyle, setActiveInfoStyle] = useState<PopArtStyleOption | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeInfoStyle) {
          setActiveInfoStyle(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeInfoStyle, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popart-modal-title"
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-stone-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E8752A]" />
              <h2
                id="popart-modal-title"
                className="text-lg sm:text-xl font-black text-stone-900 tracking-tight"
              >
                Select Pop Art Style
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
              Choose from 16 authentic Andy Warhol, comic halftone, and contemporary Pop Art treatments.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Pop Art Style selector"
            className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Style Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(92vh-130px)]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4.5">
            {POP_ART_STYLES.map((style) => {
              const isSelected = style.id === selectedStyleId;

              return (
                <div
                  key={style.id}
                  onClick={() => {
                    onSelectStyle(style);
                  }}
                  className={`group relative flex flex-col bg-white rounded-xl border transition-all duration-150 cursor-pointer overflow-hidden text-left ${
                    isSelected
                      ? 'border-2 border-[#0E4A93] shadow-md ring-2 ring-[#0E4A93]/15 bg-blue-50/15'
                      : 'border-stone-200 hover:border-[#0E4A93]/60 hover:shadow-sm'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectStyle(style);
                    }
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Select ${style.name} style at ₹${style.price}`}
                >
                  {/* Selected State Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-md bg-[#0E4A93] text-white flex items-center justify-center shadow-md animate-in zoom-in-75 duration-100">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}

                  {/* Highlight Badge */}
                  {style.badge && !isSelected && (
                    <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-[10px] font-black uppercase tracking-wider text-white">
                      {style.badge}
                    </div>
                  )}

                  {/* Style Preview Artwork */}
                  <div className="aspect-4/3 w-full bg-stone-100 relative overflow-hidden flex items-center justify-center border-b border-stone-100">
                    <img
                      src={style.previewImage}
                      alt={style.name}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-250 select-none pointer-events-none"
                      loading="lazy"
                    />
                  </div>

                  {/* Style Card Meta & Price */}
                  <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 bg-white">
                    <div className="font-bold text-stone-900 text-xs sm:text-sm tracking-tight truncate">
                      {style.name}
                    </div>

                    <div className="mt-1.5 flex items-center justify-between">
                      <div className="text-xs sm:text-sm font-black text-[#0E4A93]">
                        ₹{style.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>

                      {/* Information Icon Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveInfoStyle(style);
                        }}
                        className="p-1 rounded-full text-stone-400 hover:text-[#0E4A93] hover:bg-stone-100 transition-colors cursor-pointer"
                        title={`View information about ${style.name}`}
                        aria-label={`Information about ${style.name}`}
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-stone-600 hidden sm:block">
            <span>Selected Style: </span>
            <strong className="text-stone-900 font-bold">
              {POP_ART_STYLES.find((s) => s.id === selectedStyleId)?.name || 'Andy-Warhol'}
            </strong>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-black text-white bg-[#0E4A93] hover:bg-[#0A366C] shadow-md rounded-xl transition-all hover:scale-102 cursor-pointer flex items-center gap-2"
            >
              <span>Continue with Selected Style</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Style Information Popover / Dialog */}
      {activeInfoStyle && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
          onClick={() => setActiveInfoStyle(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-5 sm:p-6 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="style-info-title"
          >
            <div className="flex items-start justify-between mb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <img
                    src={activeInfoStyle.previewImage}
                    alt={activeInfoStyle.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3
                    id="style-info-title"
                    className="text-base font-black text-stone-900 tracking-tight"
                  >
                    {activeInfoStyle.name}
                  </h3>
                  <span className="text-xs font-black text-[#0E4A93]">
                    ₹{activeInfoStyle.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveInfoStyle(null)}
                aria-label="Close information dialog"
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed mb-3">
              {activeInfoStyle.description}
            </p>

            {/* Image Processing Note */}
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-[#0E4A93] leading-relaxed mb-4">
              <strong className="font-bold block mb-0.5">Image Processing Technique:</strong>
              {activeInfoStyle.processingNote}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setActiveInfoStyle(null)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectStyle(activeInfoStyle);
                  setActiveInfoStyle(null);
                }}
                className="px-5 py-2 text-xs font-black text-white bg-[#0E4A93] hover:bg-[#0A366C] rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Select This Style
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
