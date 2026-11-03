import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import {
  BusRollConfig,
  BusRollFontStyle,
  BUS_ROLL_FONTS,
  BUS_ROLL_FONT_STYLES,
  BUS_ROLL_LINE_SPACINGS,
  BUS_ROLL_MARGINS,
  BUS_ROLL_WIDTHS
} from '../data/busRollData';

export interface BusRollTopToolbarProps {
  config: BusRollConfig;
  onChangeConfig: (updates: Partial<BusRollConfig>) => void;
  onSave: () => void;
  onStartOver: () => void;
}

export const BusRollTopToolbar: React.FC<BusRollTopToolbarProps> = ({
  config,
  onChangeConfig,
  onSave,
  onStartOver
}) => {
  const [showStartOverModal, setShowStartOverModal] = useState(false);

  return (
    <>
      {/* Compact single-row responsive header above preview */}
      <div className="h-11 sm:h-12 bg-white border-b border-stone-200 px-2 sm:px-3 flex items-center justify-between gap-2 shadow-2xs z-20 shrink-0 overflow-x-auto no-scrollbar">
        {/* Left: Global Typography & Dimension Selectors */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 py-1">
          {/* 1. Line Spacing */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 whitespace-nowrap">Spacing</span>
            <select
              value={config.lineSpacing}
              onChange={(e) => onChangeConfig({ lineSpacing: parseFloat(e.target.value) })}
              className="h-7 px-1.5 py-0 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-[11px] font-bold text-stone-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0E4A93]"
            >
              {BUS_ROLL_LINE_SPACINGS.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}"
                </option>
              ))}
            </select>
          </div>

          {/* 2. Margin */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 whitespace-nowrap">Margin</span>
            <select
              value={config.margin}
              onChange={(e) => onChangeConfig({ margin: parseFloat(e.target.value) })}
              className="h-7 px-1.5 py-0 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-[11px] font-bold text-stone-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0E4A93]"
            >
              {BUS_ROLL_MARGINS.map((m) => (
                <option key={m} value={m}>
                  {m}"
                </option>
              ))}
            </select>
          </div>

          {/* 3. Width */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 whitespace-nowrap">Width</span>
            <select
              value={config.widthInches}
              onChange={(e) => onChangeConfig({ widthInches: parseInt(e.target.value, 10) })}
              className="h-7 px-1.5 py-0 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-[11px] font-bold text-stone-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0E4A93]"
            >
              {BUS_ROLL_WIDTHS.map((w) => (
                <option key={w} value={w}>
                  {w}"
                </option>
              ))}
            </select>
          </div>

          {/* 4. Font Style */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 whitespace-nowrap">Style</span>
            <select
              value={config.fontStyle}
              onChange={(e) => onChangeConfig({ fontStyle: e.target.value as BusRollFontStyle })}
              className="h-7 px-1.5 py-0 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-[11px] font-bold text-stone-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0E4A93]"
            >
              {BUS_ROLL_FONT_STYLES.map((fs) => (
                <option key={fs} value={fs}>
                  {fs}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Font Family */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 whitespace-nowrap">Font</span>
            <select
              value={config.fontFamily}
              onChange={(e) => onChangeConfig({ fontFamily: e.target.value })}
              className="h-7 px-1.5 py-0 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-[11px] font-bold text-stone-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0E4A93]"
            >
              {BUS_ROLL_FONTS.map((f) => (
                <option key={f.id} value={f.fontFamily}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Save & Start Over Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onSave}
            className="h-7 px-2.5 flex items-center gap-1 bg-white hover:bg-stone-50 text-[#0E4A93] border border-stone-200 rounded-md font-black text-[11px] transition-colors cursor-pointer shadow-2xs"
            title="Save your current design"
          >
            <Save className="w-3.5 h-3.5 text-[#0E4A93]" />
            <span>SAVE</span>
          </button>

          <button
            type="button"
            onClick={() => setShowStartOverModal(true)}
            className="h-7 px-2.5 flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md font-black text-[11px] transition-colors cursor-pointer shadow-2xs"
            title="Start over and reset design"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>START OVER</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Start Over */}
      {showStartOverModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-stone-900">Start Over?</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  This will reset your Bus Roll typography, background, and pattern back to default.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowStartOverModal(false)}
                className="px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowStartOverModal(false);
                  onStartOver();
                }}
                className="px-4 py-2 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
