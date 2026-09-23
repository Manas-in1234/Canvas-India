import React from 'react';
import {
  X,
  Type,
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  RotateCw,
  ChevronDown
} from 'lucide-react';
import { FONT_OPTIONS, TEXT_COLOR_PRESETS } from '../data/acrylicCustomizerData';

export interface TextElement {
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | '600' | '700';
  color: string;
  alignment: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
  rotation: number;
  x: number;
  y: number;
}

interface AcrylicLiveTextEditorProps {
  activeText: TextElement | null;
  onUpdateText: (updates: Partial<TextElement>) => void;
  onDuplicateText: () => void;
  onDeleteText: () => void;
  onClose: () => void;
}

export const AcrylicLiveTextEditor: React.FC<AcrylicLiveTextEditorProps> = ({
  activeText,
  onUpdateText,
  onDuplicateText,
  onDeleteText,
  onClose
}) => {
  if (!activeText) return null;

  return (
    <div
      className="absolute top-14 right-4 z-40 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl shadow-2xl p-4 w-88 max-w-[calc(100vw-2rem)] select-none animate-in fade-in slide-in-from-top-2 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-stone-200/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0E4A93]/10 text-[#0E4A93] flex items-center justify-center font-bold">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-stone-900 tracking-tight">Live Typography Editor</h3>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Canvas Sync
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onDuplicateText}
            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Duplicate Text"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDeleteText}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Text"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer ml-1"
            title="Close editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        {/* Text Input Content (Immediate Live Update) */}
        <div>
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
            Text / Captions / Lyrics
          </label>
          <textarea
            rows={2}
            value={activeText.text}
            onChange={(e) => onUpdateText({ text: e.target.value })}
            placeholder="Type your text..."
            className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0E4A93]/20 focus:border-[#0E4A93] bg-white transition-all resize-none"
          />
        </div>

        {/* Font Family Selection */}
        <div>
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
            Font Family
          </label>
          <div className="relative">
            <select
              value={activeText.fontFamily}
              onChange={(e) => onUpdateText({ fontFamily: e.target.value })}
              className="w-full px-3 py-2 appearance-none border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 bg-stone-50/50 hover:bg-white focus:outline-none focus:border-[#0E4A93] transition-colors cursor-pointer pr-8"
              style={{ fontFamily: activeText.fontFamily }}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                  {f.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Font Size & Weight */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                Size ({activeText.fontSize}px)
              </label>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="range"
                min={12}
                max={96}
                value={activeText.fontSize}
                onChange={(e) => onUpdateText({ fontSize: Number(e.target.value) })}
                className="w-full accent-[#0E4A93] h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min={10}
                max={120}
                value={activeText.fontSize}
                onChange={(e) => onUpdateText({ fontSize: Math.max(10, Math.min(120, Number(e.target.value))) })}
                className="w-12 px-1.5 py-1 text-center text-xs font-bold border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:border-[#0E4A93]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Weight & Style
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onUpdateText({ fontWeight: activeText.fontWeight === 'bold' ? 'normal' : 'bold' })}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  activeText.fontWeight === 'bold'
                    ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Bold className="w-3.5 h-3.5" />
                <span>Bold</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alignment & Rotation */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Alignment
            </label>
            <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => onUpdateText({ alignment: align })}
                  className={`flex-1 py-1 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                    activeText.alignment === align
                      ? 'bg-white text-[#0E4A93] shadow-xs font-bold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title={`Align ${align}`}
                >
                  {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                  {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                  {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                Rotation ({activeText.rotation || 0}°)
              </label>
              <button
                type="button"
                onClick={() => onUpdateText({ rotation: ((activeText.rotation || 0) + 90) % 360 })}
                className="text-[10px] font-bold text-[#0E4A93] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <RotateCw className="w-2.5 h-2.5" /> +90°
              </button>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              value={activeText.rotation || 0}
              onChange={(e) => onUpdateText({ rotation: Number(e.target.value) })}
              className="w-full accent-[#0E4A93] h-1.5 bg-stone-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Line Height & Letter Spacing */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Line Height ({(activeText.lineHeight || 1.2).toFixed(1)})
            </label>
            <input
              type="range"
              min={0.9}
              max={2.4}
              step={0.1}
              value={activeText.lineHeight || 1.2}
              onChange={(e) => onUpdateText({ lineHeight: Number(e.target.value) })}
              className="w-full accent-[#0E4A93] h-1.5 bg-stone-200 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Letter Spacing ({activeText.letterSpacing || 0}px)
            </label>
            <input
              type="range"
              min={-2}
              max={12}
              step={0.5}
              value={activeText.letterSpacing || 0}
              onChange={(e) => onUpdateText({ letterSpacing: Number(e.target.value) })}
              className="w-full accent-[#0E4A93] h-1.5 bg-stone-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Text Color & Palette */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Text Color
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-stone-600 font-bold uppercase">{activeText.color}</span>
              <input
                type="color"
                value={activeText.color}
                onChange={(e) => onUpdateText({ color: e.target.value })}
                className="w-5 h-5 rounded border-0 p-0 cursor-pointer bg-transparent"
                title="Custom color picker"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEXT_COLOR_PRESETS.map((col) => (
              <button
                key={col.name}
                type="button"
                onClick={() => onUpdateText({ color: col.hex })}
                style={{ backgroundColor: col.hex }}
                title={col.name}
                className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                  activeText.color.toLowerCase() === col.hex.toLowerCase()
                    ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/40 scale-110'
                    : 'border-stone-300 hover:scale-105'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
