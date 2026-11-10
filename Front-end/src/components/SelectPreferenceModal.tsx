import React, { useState } from 'react';
import { X, Check, PenTool, LayoutTemplate, Sparkles, ArrowRight } from 'lucide-react';

export interface SelectPreferenceModalProps {
  isOpen?: boolean;
  onClose: () => void;
  selectedPreference?: 'create-own' | 'collection' | null;
  onSelectCreateOwn: () => void;
  onSelectCollection: () => void;
  title?: string;
}

export const SelectPreferenceModal: React.FC<SelectPreferenceModalProps> = ({
  isOpen = true,
  onClose,
  selectedPreference = null,
  onSelectCreateOwn,
  onSelectCollection,
  title = 'SELECT PREFERENCE'
}) => {
  const [activeChoice, setActiveChoice] = useState<'create-own' | 'collection'>(
    selectedPreference || 'collection'
  );

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (activeChoice === 'create-own') {
      onSelectCreateOwn();
    } else {
      onSelectCollection();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[70] animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-stone-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#0E4A93] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              {title}
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            Choose how you would like to design your custom quote print.
          </p>
          <div className="h-px bg-stone-200 mt-3" />
        </div>

        {/* 2 Option Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Create Your Own */}
          <button
            type="button"
            onClick={() => {
              setActiveChoice('create-own');
            }}
            onDoubleClick={() => {
              onSelectCreateOwn();
            }}
            className={`group text-left relative flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer ${
              activeChoice === 'create-own'
                ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/20 bg-blue-50/30 shadow-sm'
                : 'border-stone-200 bg-white hover:border-stone-400 hover:shadow-2xs'
            }`}
          >
            {/* Checkmark Indicator */}
            {activeChoice === 'create-own' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#0E4A93] text-white flex items-center justify-center shadow-xs z-10">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}

            {/* Illustration Box */}
            <div className="relative aspect-4/3 w-full rounded-lg bg-linear-to-br from-stone-800 to-stone-900 p-3 flex flex-col items-center justify-center text-white mb-3 shadow-inner overflow-hidden border border-stone-700">
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-amber-300 mb-1.5 shadow-2xs">
                <PenTool className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-widest uppercase font-mono text-stone-300">CUSTOM</span>
              <span className="text-base font-black tracking-wide text-white leading-tight">Create Your Own</span>
            </div>

            <div className="mt-auto">
              <span className={`block text-xs font-black uppercase tracking-wide ${activeChoice === 'create-own' ? 'text-[#0E4A93]' : 'text-stone-900'}`}>
                Create Your Own
              </span>
              <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                Write your custom quote, choose solid background colors or use your uploaded photo.
              </p>
            </div>
          </button>

          {/* Card 2: Select From Our Collection */}
          <button
            type="button"
            onClick={() => {
              setActiveChoice('collection');
            }}
            onDoubleClick={() => {
              onSelectCollection();
            }}
            className={`group text-left relative flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer ${
              activeChoice === 'collection'
                ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/20 bg-blue-50/30 shadow-sm'
                : 'border-stone-200 bg-white hover:border-stone-400 hover:shadow-2xs'
            }`}
          >
            {/* Checkmark Indicator */}
            {activeChoice === 'collection' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#0E4A93] text-white flex items-center justify-center shadow-xs z-10">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}

            {/* Illustration Box */}
            <div className="relative aspect-4/3 w-full rounded-lg bg-linear-to-br from-[#0E4A93] to-[#082852] p-3 flex flex-col items-center justify-center text-white mb-3 shadow-inner overflow-hidden border border-blue-900">
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-blue-200 mb-1.5 shadow-2xs">
                <LayoutTemplate className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-widest uppercase font-mono text-blue-200">CURATED</span>
              <span className="text-base font-black tracking-wide text-white leading-tight">Our Collection</span>
            </div>

            <div className="mt-auto">
              <span className={`block text-xs font-black uppercase tracking-wide ${activeChoice === 'collection' ? 'text-[#0E4A93]' : 'text-stone-900'}`}>
                Select From Our Collection
              </span>
              <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                Browse our curated gallery of inspirational, life, love, and happiness quote designs.
              </p>
            </div>
          </button>
        </div>

        {/* Footer Action Buttons */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-[#E8752A] hover:bg-[#d66820] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
