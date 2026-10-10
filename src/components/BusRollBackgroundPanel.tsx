import React, { useState } from 'react';
import {
  Check,
  Palette,
  Sliders,
  Sparkles
} from 'lucide-react';
import {
  BusRollConfig,
  BUS_ROLL_BACKGROUNDS,
  BUS_ROLL_PATTERNS
} from '../data/busRollData';

export interface BusRollBackgroundPanelProps {
  config: BusRollConfig;
  onChangeConfig: (updates: Partial<BusRollConfig>) => void;
}

export const BusRollBackgroundPanel: React.FC<BusRollBackgroundPanelProps> = ({
  config,
  onChangeConfig
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'BACKGROUND' | 'PATTERN'>('PATTERN');

  return (
    <div className="p-4 space-y-4">
      {/* Sub Tabs: BACKGROUND vs PATTERN matching Screenshot 2 */}
      <div className="flex p-1 bg-stone-100 rounded-xl border border-stone-200">
        <button
          type="button"
          onClick={() => setActiveSubTab('BACKGROUND')}
          className={`flex-1 py-2 px-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'BACKGROUND'
              ? 'bg-[#0E4A93] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Background</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('PATTERN')}
          className={`flex-1 py-2 px-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'PATTERN'
              ? 'bg-[#0E4A93] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pattern</span>
        </button>
      </div>

      {/* -------------------- TAB 1: BACKGROUND -------------------- */}
      {activeSubTab === 'BACKGROUND' && (
        <div className="space-y-4">
          <div className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
            Choose Background Tone
          </div>

          {/* Background Colors Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {BUS_ROLL_BACKGROUNDS.map((bg) => {
              const isSelected = config.backgroundColor.toLowerCase() === bg.hex.toLowerCase();
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => onChangeConfig({ backgroundColor: bg.hex })}
                  className={`relative p-2 rounded-xl flex flex-col items-center gap-1.5 border transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-2 border-[#0E4A93] bg-blue-50/20 shadow-xs ring-1 ring-[#0E4A93]/20'
                      : 'border-stone-200 hover:border-stone-400 bg-white shadow-2xs'
                  }`}
                >
                  {/* Swatch preview */}
                  <div
                    className="w-full h-11 rounded-lg border border-black/10 shadow-inner flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: bg.hex }}
                  >
                    {isSelected && (
                      <div className="w-5 h-5 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-stone-800 text-center leading-tight truncate w-full">
                    {bg.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Color Picker */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
            <div className="text-[10px] font-extrabold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#0E4A93]" />
              <span>Custom Canvas Color</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => onChangeConfig({ backgroundColor: e.target.value })}
                className="w-9 h-9 p-0 border border-stone-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={config.backgroundColor}
                onChange={(e) => onChangeConfig({ backgroundColor: e.target.value })}
                className="flex-1 px-3 py-1.5 text-xs font-mono font-bold text-stone-800 bg-white border border-stone-200 rounded-lg uppercase"
                placeholder="#6B2D5C"
              />
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 2: PATTERN -------------------- */}
      {activeSubTab === 'PATTERN' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
              Geometric Pattern Grid (16 Patterns)
            </span>
          </div>

          {/* 4-column Pattern Grid matching Screenshot 2 */}
          <div className="grid grid-cols-4 gap-2">
            {BUS_ROLL_PATTERNS.map((pat) => {
              const isSelected = config.patternId === pat.id;
              return (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() =>
                    onChangeConfig({
                      patternId: pat.id,
                      // Picking a pattern while opacity is at 0% would
                      // otherwise select it but render it fully invisible —
                      // give it a sensible visible default unless the
                      // shopper already dialled in their own opacity.
                      ...(pat.id !== 'solid' && config.patternOpacity <= 0 ? { patternOpacity: 0.22 } : {})
                    })
                  }
                  className={`group relative p-1.5 rounded-xl border flex flex-col items-center justify-between transition-all cursor-pointer aspect-square ${
                    isSelected
                      ? 'border-2 border-[#0E4A93] bg-blue-50/30 shadow-xs ring-1 ring-[#0E4A93]/20'
                      : 'border-stone-200 hover:border-stone-400 bg-white shadow-2xs'
                  }`}
                  title={pat.name}
                >
                  {/* Selected checkmark pill */}
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-xs z-10">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}

                  {/* SVG Pattern Thumbnail */}
                  <div
                    className="w-full h-full rounded-lg bg-stone-900 text-white flex items-center justify-center p-2 overflow-hidden shadow-inner group-hover:scale-102 transition-transform"
                    dangerouslySetInnerHTML={{ __html: pat.previewSvg }}
                  />

                  {/* Pattern Name */}
                  <span className="text-[9px] font-bold text-stone-700 text-center truncate w-full mt-1">
                    {pat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pattern Opacity Slider */}
          {config.patternId !== 'solid' && (
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-stone-700">
                <span className="uppercase tracking-wider">Pattern Visibility</span>
                <span className="text-[#0E4A93] font-mono">{Math.round(config.patternOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.02"
                value={config.patternOpacity}
                onChange={(e) => onChangeConfig({ patternOpacity: parseFloat(e.target.value) })}
                className="w-full accent-[#0E4A93] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-stone-600 font-bold">
                <span>Subtle (10%)</span>
                <span>Balanced (25%)</span>
                <span>Prominent (50%)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
