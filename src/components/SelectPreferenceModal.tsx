import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';

export interface SelectPreferenceModalProps {
  onClose: () => void;
  onSelectCreateOwn: () => void;
  /** When omitted, "Select From Our Collection" shows a Coming Soon state instead. */
  onSelectCollection?: () => void;
  comingSoonText?: string;
}

export const SelectPreferenceModal: React.FC<SelectPreferenceModalProps> = ({
  onClose,
  onSelectCreateOwn,
  onSelectCollection,
  comingSoonText = 'Our curated collection is on its way — check back shortly, or build your own design now.'
}) => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[60] animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-700 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider mb-1">Select Preference</h2>
        <div className="h-px bg-stone-200 mb-6" />

        {!showComingSoon ? (
          <div className="grid grid-cols-2 gap-6">
            {/* Create Your Own */}
            <button type="button" onClick={onSelectCreateOwn} className="group text-center cursor-pointer">
              <div className="relative aspect-square w-full rounded-lg border-2 border-stone-200 group-hover:border-[#0E4A93] bg-white p-2 transition-colors">
                <div className="w-full h-full rounded-md bg-stone-700 flex flex-col items-center justify-center text-white font-black leading-tight gap-0.5">
                  <span className="text-[10px] tracking-widest uppercase">Create</span>
                  <span className="text-xl">Your</span>
                  <span className="text-xl">Own</span>
                </div>
              </div>
              <span className="block mt-3 text-sm font-bold text-[#0E4A93]">Create your Own</span>
            </button>

            {/* Select From Our Collection */}
            <button
              type="button"
              onClick={() => (onSelectCollection ? onSelectCollection() : setShowComingSoon(true))}
              className="group text-center cursor-pointer"
            >
              <div className="relative aspect-square w-full rounded-lg border-2 border-stone-200 group-hover:border-[#0E4A93] bg-white p-2 transition-colors">
                <div className="w-full h-full rounded-md bg-stone-700 flex items-center justify-center text-white font-black leading-tight gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-current shrink-0" />
                  <div className="flex flex-col items-center text-[11px] uppercase tracking-wide">
                    <span>Select</span>
                    <span>From</span>
                  </div>
                  <Heart className="w-3.5 h-3.5 fill-current shrink-0" />
                </div>
              </div>
              <span className="block mt-3 text-sm font-bold text-stone-700">Select From Our Collection</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-3 py-6">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0E4A93]">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider mb-1">Coming Soon</h3>
              <p className="text-[11px] text-stone-500 max-w-xs">{comingSoonText}</p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => setShowComingSoon(false)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onSelectCreateOwn}
                className="px-5 py-2.5 bg-[#0E4A93] hover:bg-[#09356A] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Create Your Own Instead
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
