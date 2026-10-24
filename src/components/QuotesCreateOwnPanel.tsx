import React, { useState, useEffect } from 'react';
import {
  Palette,
  Image as ImageIcon,
  Type,
  Upload,
  Trash2,
  Check,
  Maximize2,
  SlidersHorizontal,
  Sparkles,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Eye,
  RefreshCw
} from 'lucide-react';

export interface QuotesCreateOwnPanelProps {
  quoteBgColor: string;
  onChangeQuoteBgColor: (color: string) => void;
  quoteBgImage: string | null;
  onSelectQuoteBgImage: (url: string) => void;
  onRemoveQuoteBgImage: () => void;
  uploadedPhotos: string[];
  onTriggerUpload: () => void;
  quoteText: string;
  onChangeQuoteText: (text: string) => void;
  quoteAuthor: string;
  onChangeQuoteAuthor: (author: string) => void;
  fontFamily: string;
  onChangeFontFamily: (font: string) => void;
  textColor: string;
  onChangeTextColor: (color: string) => void;
  textAlignment: 'left' | 'center' | 'right';
  onChangeTextAlignment: (align: 'left' | 'center' | 'right') => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  hasTextContrast: boolean;
  onToggleTextContrast: () => void;
  currentSizeLabel?: string;
  currentPrice?: number;
  onChangeSizeClick?: () => void;
  onChangePreferenceClick?: () => void;
}

const PRESET_SOLID_COLORS = [
  { hex: '#FFFFFF', name: 'Pure White' },
  { hex: '#FBF8F3', name: 'Warm Cream' },
  { hex: '#F3F4F6', name: 'Soft Gray' },
  { hex: '#E7DFD5', name: 'Warm Beige' },
  { hex: '#27272A', name: 'Charcoal' },
  { hex: '#000000', name: 'Pitch Black' },
  { hex: '#0F172A', name: 'Navy Slate' },
  { hex: '#0E4A93', name: 'Canvas Blue' },
  { hex: '#FCE7F3', name: 'Blush Pink' },
  { hex: '#E0E7DA', name: 'Sage Green' },
  { hex: '#064E3B', name: 'Emerald' },
  { hex: '#4C0519', name: 'Deep Wine' }
];

const PRESET_TEXT_COLORS = [
  { hex: '#FFFFFF', name: 'Crisp White' },
  { hex: '#000000', name: 'Solid Black' },
  { hex: '#1C1917', name: 'Charcoal' },
  { hex: '#D97706', name: 'Gold' },
  { hex: '#0E4A93', name: 'Navy Blue' },
  { hex: '#991B1B', name: 'Crimson' }
];

const FONT_OPTIONS = [
  { id: 'Playfair Display', label: 'Playfair Serif', style: 'font-serif' },
  { id: 'Cormorant Garamond', label: 'Cormorant Luxury', style: 'font-serif italic' },
  { id: 'Dancing Script', label: 'Dancing Script', style: 'font-serif italic' },
  { id: 'Montserrat', label: 'Montserrat Modern', style: 'font-sans' },
  { id: 'Cinzel', label: 'Cinzel Classical', style: 'font-serif' },
  { id: 'Oswald', label: 'Oswald Bold', style: 'font-sans font-bold tracking-wide' }
];

const PRESET_QUOTES = [
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Do what you love, and you will never work a day in your life.",
    author: "Confucius"
  },
  {
    text: "Every day is a fresh beginning. Listen to what your soul has to say.",
    author: "Inspirational"
  },
  {
    text: "You are capable of more than you know. Choose courage over fear.",
    author: "Daily Motivation"
  }
];

export const QuotesCreateOwnPanel: React.FC<QuotesCreateOwnPanelProps> = ({
  quoteBgColor,
  onChangeQuoteBgColor,
  quoteBgImage,
  onSelectQuoteBgImage,
  onRemoveQuoteBgImage,
  uploadedPhotos,
  onTriggerUpload,
  quoteText,
  onChangeQuoteText,
  quoteAuthor,
  onChangeQuoteAuthor,
  fontFamily,
  onChangeFontFamily,
  textColor,
  onChangeTextColor,
  textAlignment,
  onChangeTextAlignment,
  fontSize,
  onChangeFontSize,
  hasTextContrast,
  onToggleTextContrast,
  currentSizeLabel = '8" × 8"',
  currentPrice = 999,
  onChangeSizeClick,
  onChangePreferenceClick
}) => {
  const [bgMode, setBgMode] = useState<'solid' | 'photo'>(quoteBgImage ? 'photo' : 'solid');

  // Synchronize bgMode when external quoteBgImage changes
  useEffect(() => {
    if (quoteBgImage) {
      setBgMode('photo');
    }
  }, [quoteBgImage]);

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white select-none">
      {/* 1. Header with Title & Change Preference Button */}
      <div className="p-3.5 pb-2.5 border-b border-stone-200/80 bg-white shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0E4A93]">
              <Sparkles className="w-3 h-3 stroke-[2.2]" />
            </div>
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">
              Create Your Own Quote
            </h3>
          </div>
          {onChangePreferenceClick && (
            <button
              type="button"
              onClick={onChangePreferenceClick}
              className="text-[10px] font-black text-[#0E4A93] hover:text-[#09356A] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1 border border-blue-200/60"
            >
              <SlidersHorizontal className="w-2.5 h-2.5" />
              <span>Change Preference</span>
            </button>
          )}
        </div>
        <p className="text-[11px] text-stone-500">
          Personalize background color, upload photos, and format your custom quote typography.
        </p>
      </div>

      {/* 2. Scrollable Studio Sections */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-4">
        {/* SECTION A: BACKGROUND SELECTION */}
        <div className="p-3 bg-stone-50/70 rounded-xl border border-stone-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#0E4A93]" />
              <span>1. Background Style</span>
            </span>
            <span className="text-[10px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded-full border border-stone-200">
              {bgMode === 'solid' ? 'Solid Color' : (quoteBgImage ? 'Photo Applied' : 'Photo Background')}
            </span>
          </div>

          {/* Toggle Tab: Solid Color vs Uploaded Photo */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-lg border border-stone-200">
            <button
              type="button"
              onClick={() => {
                setBgMode('solid');
                if (quoteBgImage) onRemoveQuoteBgImage();
              }}
              className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                bgMode === 'solid'
                  ? 'bg-[#0E4A93] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Palette className="w-3 h-3" />
              <span>Solid Color</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setBgMode('photo');
              }}
              className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                bgMode === 'photo'
                  ? 'bg-[#0E4A93] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Photo Background</span>
            </button>
          </div>

          {/* Mode 1: Solid Color Palette */}
          {bgMode === 'solid' && (
            <div className="space-y-2.5 pt-1">
              <span className="text-[11px] font-bold text-stone-600 block">Choose Color:</span>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_SOLID_COLORS.map((c) => {
                  const isSelected = quoteBgColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => {
                        setBgMode('solid');
                        if (quoteBgImage) {
                          onRemoveQuoteBgImage();
                        }
                        onChangeQuoteBgColor(c.hex);
                      }}
                      className={`relative aspect-square rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/40 shadow-xs scale-105'
                          : 'border-stone-300 hover:border-stone-500'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {isSelected && (
                        <Check
                          className={`w-3.5 h-3.5 stroke-[3] ${
                            ['#ffffff', '#fbf8f3', '#f3f4f6', '#e7dfd5', '#fce7f3', '#e0e7da'].includes(
                              c.hex.toLowerCase()
                            )
                              ? 'text-stone-800'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Hex Color Picker */}
              <div className="flex items-center gap-2 pt-1 border-t border-stone-200/60">
                <input
                  type="color"
                  value={quoteBgColor.startsWith('#') && quoteBgColor.length === 7 ? quoteBgColor : '#FFFFFF'}
                  onChange={(e) => {
                    setBgMode('solid');
                    if (quoteBgImage) onRemoveQuoteBgImage();
                    onChangeQuoteBgColor(e.target.value);
                  }}
                  className="w-7 h-7 rounded-md border border-stone-300 cursor-pointer p-0.5 bg-white"
                  title="Custom color picker"
                />
                <input
                  type="text"
                  value={quoteBgColor}
                  onChange={(e) => {
                    let val = e.target.value.trim();
                    if (!val.startsWith('#') && val.length > 0) val = '#' + val;
                    setBgMode('solid');
                    if (quoteBgImage) onRemoveQuoteBgImage();
                    onChangeQuoteBgColor(val);
                  }}
                  className="flex-1 py-1 px-2 border border-stone-200 rounded-md text-xs font-mono uppercase bg-white text-stone-800"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          )}

          {/* Mode 2: Photo Background Selection */}
          {bgMode === 'photo' && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-600">
                  {quoteBgImage ? 'Active Background Image:' : 'Select Photo from Uploads:'}
                </span>
                {quoteBgImage && (
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveQuoteBgImage();
                    }}
                    className="text-[10px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => {
                  setBgMode('photo');
                  onTriggerUpload();
                }}
                className="w-full py-2.5 px-3 border-2 border-dashed border-[#0E4A93]/40 hover:border-[#0E4A93] bg-blue-50/40 hover:bg-blue-50 rounded-xl text-xs font-bold text-[#0E4A93] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Upload className="w-4 h-4 stroke-[2.2]" />
                <span>Upload New Photograph</span>
              </button>

              {/* Uploaded Photos Thumbnails Grid */}
              {uploadedPhotos.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 pt-1 max-h-36 overflow-y-auto">
                  {uploadedPhotos.map((url, i) => {
                    const isSelected = quoteBgImage === url;
                    return (
                      <button
                        key={`${url}-${i}`}
                        type="button"
                        onClick={() => {
                          setBgMode('photo');
                          onSelectQuoteBgImage(url);
                        }}
                        className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all cursor-pointer group bg-stone-100 ${
                          isSelected
                            ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/30 shadow-xs'
                            : 'border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Uploaded ${i + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0E4A93] text-white flex items-center justify-center shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-3 text-center text-xs text-stone-400 bg-white rounded-lg border border-stone-200/80">
                  No photos uploaded yet. Click above to upload.
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION B: QUOTE TEXT CONTENT */}
        <div className="p-3 bg-stone-50/70 rounded-xl border border-stone-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#0E4A93]" />
              <span>2. Quote Text & Author</span>
            </span>
          </div>

          {/* Quote Text Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-600 block uppercase tracking-wider">
              Your Quote
            </label>
            <textarea
              rows={3}
              value={quoteText}
              onChange={(e) => onChangeQuoteText(e.target.value)}
              placeholder="Write your custom quote here..."
              className="w-full p-2.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0E4A93]/20 focus:border-[#0E4A93] resize-none"
            />
          </div>

          {/* Author Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-600 block uppercase tracking-wider">
              Author or Citation (Optional)
            </label>
            <input
              type="text"
              value={quoteAuthor}
              onChange={(e) => onChangeQuoteAuthor(e.target.value)}
              placeholder="- Author / Source"
              className="w-full p-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0E4A93]/20 focus:border-[#0E4A93]"
            />
          </div>

          {/* Quick Preset Quotes Chips */}
          <div className="pt-1">
            <span className="text-[10px] font-bold text-stone-500 block mb-1.5">
              Or pick an inspirational starter:
            </span>
            <div className="flex flex-col gap-1.5">
              {PRESET_QUOTES.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChangeQuoteText(q.text);
                    onChangeQuoteAuthor(`- ${q.author}`);
                  }}
                  className="text-left p-1.5 rounded-md bg-white hover:bg-blue-50/40 border border-stone-200/70 hover:border-blue-200 text-[10px] text-stone-700 transition-colors cursor-pointer truncate"
                  title={q.text}
                >
                  <span className="font-bold text-stone-900 truncate block">
                    &ldquo;{q.text.slice(0, 48)}...&rdquo;
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION C: TYPOGRAPHY & CONTRAST */}
        <div className="p-3 bg-stone-50/70 rounded-xl border border-stone-200/80 space-y-3">
          <span className="text-xs font-black text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0E4A93]" />
            <span>3. Typography & Styling</span>
          </span>

          {/* Font Family Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-600 block uppercase tracking-wider">
              Font Family
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {FONT_OPTIONS.map((f) => {
                const isSelected = fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onChangeFontFamily(f.id)}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0E4A93] bg-blue-50/50 shadow-2xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <span className={`block text-xs ${f.style} ${isSelected ? 'text-[#0E4A93] font-bold' : 'text-stone-800'}`}>
                      {f.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Color & Alignment */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Color Swatches */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-600 block uppercase tracking-wider">
                Text Color
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESET_TEXT_COLORS.map((tc) => {
                  const isSel = textColor.toLowerCase() === tc.hex.toLowerCase();
                  return (
                    <button
                      key={tc.hex}
                      type="button"
                      onClick={() => onChangeTextColor(tc.hex)}
                      className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                        isSel ? 'ring-2 ring-[#0E4A93] scale-110 shadow-xs' : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: tc.hex }}
                      title={tc.name}
                    >
                      {isSel && (
                        <Check
                          className={`w-3 h-3 stroke-[3] ${
                            ['#ffffff', '#fde047'].includes(tc.hex.toLowerCase())
                              ? 'text-stone-900'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alignment Controls */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-600 block uppercase tracking-wider">
                Alignment
              </label>
              <div className="flex border border-stone-200 rounded-lg overflow-hidden bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => onChangeTextAlignment('left')}
                  className={`flex-1 py-1 flex items-center justify-center rounded transition-colors cursor-pointer ${
                    textAlignment === 'left' ? 'bg-[#0E4A93] text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTextAlignment('center')}
                  className={`flex-1 py-1 flex items-center justify-center rounded transition-colors cursor-pointer ${
                    textAlignment === 'center' ? 'bg-[#0E4A93] text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTextAlignment('right')}
                  className={`flex-1 py-1 flex items-center justify-center rounded transition-colors cursor-pointer ${
                    textAlignment === 'right' ? 'bg-[#0E4A93] text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Font Size Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] font-bold text-stone-600">
              <span>Text Size</span>
              <span>{fontSize}px</span>
            </div>
            <input
              type="range"
              min={16}
              max={54}
              step={2}
              value={fontSize}
              onChange={(e) => onChangeFontSize(Number(e.target.value))}
              className="w-full accent-[#0E4A93] cursor-pointer"
            />
          </div>

          {/* Text Contrast / Readability Scrim Toggle */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-800">
                Enhance Text Contrast
              </span>
              <span className="text-[10px] text-stone-500">
                Adds readability shadow behind text over photo backgrounds
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleTextContrast}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                hasTextContrast ? 'bg-[#0E4A93]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  hasTextContrast ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Controls: Size & Price Summary */}
      <div className="p-3 border-t border-stone-200 bg-stone-50/80 space-y-2 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-stone-500 font-medium">
            <span>Size:</span>
            <strong className="text-stone-800">{currentSizeLabel}</strong>
          </div>
          <div className="text-xs font-black text-[#0E4A93]">
            ₹{currentPrice.toFixed(2)}
          </div>
        </div>

        {onChangeSizeClick && (
          <button
            type="button"
            onClick={onChangeSizeClick}
            className="w-full py-1.5 px-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#0E4A93]" />
            <span>Change Canvas Size</span>
          </button>
        )}
      </div>
    </div>
  );
};
