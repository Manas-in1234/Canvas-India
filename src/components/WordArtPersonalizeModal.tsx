import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, RefreshCw, Palette, Type, Sliders, ArrowLeft, Check } from 'lucide-react';
import {
  type WordArtConfig,
  type WordArtSizeOption,
  WORD_ART_FONT_OPTIONS,
  WORD_ART_SHAPE_OPTIONS,
  WORD_ART_COLOR_SCHEMES,
  DEFAULT_WORD_ART_CONFIG,
  renderWordArtToCanvas
} from '../data/wordArtData';

export interface WordArtPersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSize: WordArtSizeOption;
  initialConfig?: WordArtConfig;
  onChangeSize: () => void;
  onAddToProduct: (dataUrl: string, config: WordArtConfig) => void;
}

export const WordArtPersonalizeModal: React.FC<WordArtPersonalizeModalProps> = ({
  isOpen,
  onClose,
  selectedSize,
  initialConfig = DEFAULT_WORD_ART_CONFIG,
  onChangeSize,
  onAddToProduct
}) => {
  const [config, setConfig] = useState<WordArtConfig>(initialConfig);
  const [otherTextRaw, setOtherTextRaw] = useState<string>(
    initialConfig.otherText.join('\n')
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync state if initialConfig changes
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
      setOtherTextRaw(initialConfig.otherText.join('\n'));
    }
  }, [initialConfig]);

  // Re-render preview canvas whenever config changes
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const baseW = 800;
    const baseH = Math.round(baseW / (selectedSize.aspectRatio || 1));
    renderWordArtToCanvas(canvas, config, baseW, baseH);
  }, [isOpen, config, selectedSize]);

  if (!isOpen) return null;

  // Handle other text lines change
  const handleOtherTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setOtherTextRaw(val);
    const lines = val
      .split('\n')
      .map((l) => l.trim().substring(0, 20))
      .filter((l) => l.length > 0)
      .slice(0, 10);
    setConfig((prev) => ({ ...prev, otherText: lines }));
  };

  // "VIEW YOUR PERSONALIZATION" - updates preview & triggers a new layout seed
  const handleViewPersonalization = () => {
    const lines = otherTextRaw
      .split('\n')
      .map((l) => l.trim().substring(0, 20))
      .filter((l) => l.length > 0)
      .slice(0, 10);

    const nextSeed = Math.floor(Math.random() * 100000) + 1;
    setConfig((prev) => ({
      ...prev,
      otherText: lines.length >= 5 ? lines : prev.otherText,
      seed: nextSeed
    }));
  };

  // "ADD TO PRODUCT" - renders high-res export and applies to product
  const handleApplyToProduct = () => {
    const offscreen = document.createElement('canvas');
    const exportWidth = 1400;
    const exportHeight = Math.round(exportWidth / (selectedSize.aspectRatio || 1));
    renderWordArtToCanvas(offscreen, config, exportWidth, exportHeight);
    const dataUrl = offscreen.toDataURL('image/png', 0.95);
    onAddToProduct(dataUrl, config);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Canvas India Brand Styling */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0E4A93] text-white">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-black tracking-tight">
              {selectedSize.label} Word Art on Canvas
            </h2>
            <span className="hidden sm:inline-block text-[11px] font-bold text-blue-100 bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
              ₹{selectedSize.price.toFixed(2)}
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

        {/* Top Notification Banner matching reference */}
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-xs font-bold text-amber-900">
            To Generate Different WordArt Design / Layout, click on <span className="underline font-black">View Your Personalization</span>
          </p>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Controls Form (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Primary Name */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-stone-800 uppercase tracking-wider">
                  Primary Name (Max 15 Characters)
                </label>
                <span className="text-[11px] text-stone-400 font-bold">
                  {config.primaryName.length}/15
                </span>
              </div>
              <input
                type="text"
                maxLength={15}
                value={config.primaryName}
                onChange={(e) => setConfig((prev) => ({ ...prev, primaryName: e.target.value }))}
                placeholder="e.g. FAMILY, LOVE, ALEX"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 text-sm font-bold focus:ring-2 focus:ring-[#0E4A93] focus:border-[#0E4A93] uppercase outline-none"
              />
            </div>

            {/* 2. Color Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                  Font Color
                </label>
                <div className="flex items-center gap-2 p-1.5 rounded-xl border border-stone-300 bg-stone-50">
                  <input
                    type="color"
                    value={config.fontColor}
                    onChange={(e) => setConfig((prev) => ({ ...prev, fontColor: e.target.value }))}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-xs font-mono font-bold text-stone-700">
                    {config.fontColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                  Background
                </label>
                <div className="flex items-center gap-2 p-1.5 rounded-xl border border-stone-300 bg-stone-50">
                  <input
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) => setConfig((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-xs font-mono font-bold text-stone-700">
                    {config.backgroundColor}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Font Family Selector */}
            <div>
              <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                Select Font
              </label>
              <select
                value={config.fontFamily}
                onChange={(e) => setConfig((prev) => ({ ...prev, fontFamily: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 text-sm font-bold bg-white focus:ring-2 focus:ring-[#0E4A93] focus:border-[#0E4A93] outline-none cursor-pointer"
              >
                {WORD_ART_FONT_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Other Text */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-stone-800 uppercase tracking-wider">
                  Other Text (Min 5 - Max 10 Lines)
                </label>
                <span className="text-[11px] text-stone-400 font-bold">
                  {otherTextRaw.split('\n').filter((l) => l.trim().length > 0).length} lines
                </span>
              </div>
              <textarea
                rows={4}
                value={otherTextRaw}
                onChange={handleOtherTextChange}
                placeholder="Enter words (one per line)..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 text-xs font-semibold focus:ring-2 focus:ring-[#0E4A93] focus:border-[#0E4A93] outline-none resize-none leading-relaxed"
              />
            </div>

            {/* 5. Shape Selector */}
            <div>
              <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                Select Shape
              </label>
              <select
                value={config.shape}
                onChange={(e) => setConfig((prev) => ({ ...prev, shape: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 text-sm font-bold bg-white focus:ring-2 focus:ring-[#0E4A93] focus:border-[#0E4A93] outline-none cursor-pointer"
              >
                {WORD_ART_SHAPE_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Color Scheme */}
            <div>
              <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                Color Scheme
              </label>
              <select
                value={config.colorScheme}
                onChange={(e) => setConfig((prev) => ({ ...prev, colorScheme: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 text-sm font-bold bg-white focus:ring-2 focus:ring-[#0E4A93] focus:border-[#0E4A93] outline-none cursor-pointer"
              >
                {WORD_ART_COLOR_SCHEMES.map((cs) => (
                  <option key={cs.id} value={cs.id}>
                    {cs.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 7. Text Direction */}
            <div>
              <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                Text Direction
              </label>
              <select
                value={config.textDirection}
                onChange={(e) => setConfig((prev) => ({ ...prev, textDirection: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 text-sm font-bold bg-white focus:ring-2 focus:ring-[#0E4A93] focus:border-[#0E4A93] outline-none cursor-pointer"
              >
                <option value="horizontal">Horizontal Only</option>
                <option value="mixed">Mixed (Horizontal &amp; Vertical)</option>
              </select>
            </div>

            {/* "VIEW YOUR PERSONALIZATION" Button */}
            <button
              type="button"
              onClick={handleViewPersonalization}
              className="w-full py-3 rounded-xl bg-[#0E4A93] hover:bg-[#0a3770] text-white text-xs font-black uppercase tracking-wider shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <RefreshCw className="w-4 h-4" />
              VIEW YOUR PERSONALIZATION
            </button>
          </div>

          {/* RIGHT COLUMN: Live Interactive Preview (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center h-full space-y-3">
            <div className="w-full flex items-center justify-between text-xs text-stone-500 font-bold px-1">
              <span>Live Word Art Preview</span>
              <span className="text-stone-400">Ratio: {selectedSize.ratioTab}</span>
            </div>

            {/* Preview Frame Box */}
            <div className="relative w-full max-h-[460px] flex items-center justify-center p-3 rounded-2xl bg-stone-100 border border-stone-200 shadow-inner overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[420px] object-contain rounded-lg shadow-md border border-stone-300/60"
              />
            </div>

            <p className="text-[11px] text-stone-400 text-center">
              The preview reflects the typography, colors, and layout that will be transferred directly to your canvas workspace and 3D / 360 views.
            </p>
          </div>
        </div>

        {/* Footer Bar: CHANGE SIZE + ADD TO PRODUCT */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onChangeSize}
            className="px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            CHANGE SIZE
          </button>

          <button
            type="button"
            onClick={handleApplyToProduct}
            className="px-8 py-3 rounded-xl bg-[#0E4A93] hover:bg-[#0a3770] text-white text-sm font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 active:scale-98"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            ADD TO PRODUCT
          </button>
        </div>
      </div>
    </div>
  );
};
