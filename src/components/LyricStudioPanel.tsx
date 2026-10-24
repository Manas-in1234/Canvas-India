import React from 'react';
import { Palette, AlignCenter, AlignLeft, AlignRight, RefreshCw, Type, Sparkles, Camera, Upload, Trash2, Layers } from 'lucide-react';
import {
  LyricCanvasConfig,
  LyricCanvasTemplate,
  LyricFontFamily,
  LyricTemplateLayout,
  POPULAR_LYRIC_PRESETS
} from '../data/lyricCanvasData';

interface LyricStudioPanelProps {
  config: LyricCanvasConfig;
  template: LyricCanvasTemplate;
  onChangeConfig: (updater: (prev: LyricCanvasConfig) => LyricCanvasConfig) => void;
  onOpenTemplateModal: () => void;
  photoUrl?: string | null;
  onTriggerUpload?: () => void;
  onRemovePhoto?: () => void;
}

export const LyricStudioPanel: React.FC<LyricStudioPanelProps> = ({
  config,
  template,
  onChangeConfig,
  onOpenTemplateModal,
  photoUrl,
  onTriggerUpload,
  onRemovePhoto
}) => {
  const fontFamilies: { id: LyricFontFamily; label: string; previewStyle: string }[] = [
    { id: 'Playfair Display', label: 'Playfair Serif', previewStyle: 'font-serif' },
    { id: 'Cormorant Garamond', label: 'Cormorant Romantic', previewStyle: 'font-serif italic' },
    { id: 'Dancing Script', label: 'Dancing Script', previewStyle: 'italic font-serif' },
    { id: 'Montserrat', label: 'Montserrat Modern', previewStyle: 'font-sans' },
    { id: 'Cinzel', label: 'Cinzel Classic', previewStyle: 'tracking-wider font-serif' }
  ];

  const layoutOptions: { id: LyricTemplateLayout; label: string }[] = [
    { id: 'photo-lyrics-overlay', label: 'Photo Overlay' },
    { id: 'first-dance-card', label: 'First Dance Card' },
    { id: 'wedding-vows-photo', label: 'Wedding Vows' },
    { id: 'split-side-by-side', label: 'Side by Side' },
    { id: 'bottom-third-lyrics', label: 'Lower Third' },
    { id: 'classic-centered-lyrics', label: 'Classic Centered' },
    { id: 'sheet-music-bg', label: 'Sheet Music' },
    { id: 'quote-solid-bg', label: 'Quote Art' }
  ];

  const colorOptions = [
    { hex: '#FFFFFF', name: 'Crisp White' },
    { hex: '#FDE047', name: 'Bright Gold' },
    { hex: '#FEF08A', name: 'Soft Gold' },
    { hex: '#F5EBE0', name: 'Vintage Cream' },
    { hex: '#1E293B', name: 'Charcoal Navy' },
    { hex: '#854D0E', name: 'Warm Bronze' }
  ];

  const currentLayout = config.layout || template.defaultLayout || 'photo-lyrics-overlay';

  return (
    <div className="space-y-4">
      {/* Background Photograph Status Card */}
      <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0E4A93] flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#0E4A93]" />
            <span>Background Photograph</span>
          </span>
          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${photoUrl ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
            {photoUrl ? 'Active' : 'No Photo'}
          </span>
        </div>

        {photoUrl ? (
          <div className="flex items-center gap-2.5 bg-stone-50 p-2 rounded-lg border border-stone-200">
            <img
              src={photoUrl}
              alt="Uploaded background"
              className="w-12 h-12 rounded-md object-cover border border-stone-200 shrink-0 shadow-2xs"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-black text-stone-900 block truncate">
                Couple Photograph
              </span>
              <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                Covers canvas print area edge-to-edge
              </p>
              <div className="flex items-center gap-2 mt-1">
                {onTriggerUpload && (
                  <button
                    type="button"
                    onClick={onTriggerUpload}
                    className="text-[10px] font-bold text-[#0E4A93] hover:underline cursor-pointer"
                  >
                    Replace Photo
                  </button>
                )}
                {onRemovePhoto && (
                  <>
                    <span className="text-stone-300">•</span>
                    <button
                      type="button"
                      onClick={onRemovePhoto}
                      className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>Remove</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 bg-blue-50/50 p-2.5 rounded-lg border border-dashed border-[#0E4A93]/30">
            <span className="text-[11px] text-stone-600 font-medium">
              Upload a photograph to place behind your lyrics
            </span>
            {onTriggerUpload && (
              <button
                type="button"
                onClick={onTriggerUpload}
                className="px-3 py-1.5 bg-[#0E4A93] hover:bg-[#0b3c77] text-white text-[11px] font-bold rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Upload</span>
              </button>
            )}
          </div>
        )}
      </div>
      {/* Active Template Card */}
      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/90 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0E4A93] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E8752A]" />
            <span>Active Lyric Template</span>
          </span>
          <button
            type="button"
            onClick={onOpenTemplateModal}
            className="text-[11px] font-extrabold text-[#0E4A93] hover:text-[#0b3c77] hover:underline cursor-pointer flex items-center gap-1"
          >
            <Palette className="w-3 h-3 text-[#E8752A]" />
            <span>Change Template</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 bg-white p-2 rounded-lg border border-amber-100 shadow-2xs">
          <img
            src={template.previewImage}
            alt={template.name}
            className="w-12 h-10 rounded-md object-contain border border-stone-200 shrink-0 bg-stone-50"
          />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-black text-stone-900 truncate block">
              {template.name}
            </span>
            <p className="text-[10px] text-stone-500 line-clamp-1 leading-tight mt-0.5">
              Layout: <strong className="capitalize text-stone-700">{template.defaultLayout.replace(/-/g, ' ')}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Popular Song & Vow Presets */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wide">
            Quick Song &amp; Vow Presets
          </label>
          <span className="text-[10px] text-stone-400 font-semibold">Click to apply</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_LYRIC_PRESETS.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => {
                onChangeConfig((prev) => ({
                  ...prev,
                  title: p.title,
                  songTitle: p.title,
                  artistOrSubtitle: p.artist,
                  artistOrNames: p.artist,
                  lyrics: p.lyrics,
                  lyricsText: p.lyrics,
                  compositeImageUrl: null
                }));
              }}
              className="px-2.5 py-1 bg-stone-100 hover:bg-[#0E4A93] hover:text-white rounded-lg text-[10px] font-extrabold text-stone-700 transition-colors cursor-pointer"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Song / Vow Title & Artist / Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
            Song / Vow Title
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => {
              const val = e.target.value;
              onChangeConfig((prev) => ({ ...prev, title: val, songTitle: val, compositeImageUrl: null }));
            }}
            placeholder="e.g. A Thousand Years"
            className="w-full px-2.5 py-1.5 text-xs font-bold border border-stone-300 rounded-lg focus:outline-none focus:border-[#0E4A93] bg-white text-stone-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
            Artist / Couple Names
          </label>
          <input
            type="text"
            value={config.artistOrSubtitle}
            onChange={(e) => {
              const val = e.target.value;
              onChangeConfig((prev) => ({ ...prev, artistOrSubtitle: val, artistOrNames: val, compositeImageUrl: null }));
            }}
            placeholder="e.g. Sarah & David"
            className="w-full px-2.5 py-1.5 text-xs font-bold border border-stone-300 rounded-lg focus:outline-none focus:border-[#0E4A93] bg-white text-stone-900"
          />
        </div>
      </div>

      {/* Optional Date / Inscription */}
      <div>
        <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
          Date / Subtitle / Inscription
        </label>
        <input
          type="text"
          value={config.dateOrNames}
          onChange={(e) => {
            const val = e.target.value;
            onChangeConfig((prev) => ({ ...prev, dateOrNames: val, dateOrInscription: val, compositeImageUrl: null }));
          }}
          placeholder="e.g. October 14, 2024 • Established 2024"
          className="w-full px-2.5 py-1.5 text-xs font-bold border border-stone-300 rounded-lg focus:outline-none focus:border-[#0E4A93] bg-white text-stone-900"
        />
      </div>

      {/* Lyrics / Vows Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-[#0E4A93]" />
            <span>Lyrics / Vows Text</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-stone-400 font-semibold">
              {config.lyrics.length} chars
            </span>
            <button
              type="button"
              onClick={() => {
                onChangeConfig((prev) => ({
                  ...prev,
                  lyrics: '',
                  lyricsText: '',
                  compositeImageUrl: null
                }));
              }}
              className="text-[10px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer flex items-center gap-0.5"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
        <textarea
          rows={6}
          value={config.lyrics}
          onChange={(e) => {
            const val = e.target.value;
            onChangeConfig((prev) => ({ ...prev, lyrics: val, lyricsText: val, compositeImageUrl: null }));
          }}
          placeholder="Paste or type your favorite lyrics, vows, or words here..."
          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#0E4A93] bg-white text-stone-900 resize-y leading-relaxed font-normal"
        />
      </div>

      {/* Lyric Layout Preset Selection */}
      <div className="space-y-1.5 pt-1">
        <label className="block text-[11px] font-bold text-stone-700 uppercase flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#0E4A93]" />
          <span>Artwork &amp; Lyrics Layout</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {layoutOptions.map((lo) => {
            const isSel = currentLayout === lo.id;
            return (
              <button
                key={lo.id}
                type="button"
                onClick={() => onChangeConfig((prev) => ({ ...prev, layout: lo.id }))}
                className={`py-1.5 px-2.5 rounded-lg text-left text-[11px] font-bold transition-all border cursor-pointer truncate ${
                  isSel
                    ? 'bg-[#0E4A93] text-white border-[#0E4A93] shadow-2xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {lo.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Typography Font & Alignment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
            Typography Font
          </label>
          <select
            value={config.fontFamily}
            onChange={(e) => {
              const val = e.target.value as LyricFontFamily;
              onChangeConfig((prev) => ({ ...prev, fontFamily: val }));
            }}
            className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#0E4A93] cursor-pointer"
          >
            {fontFamilies.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
            Alignment
          </label>
          <div className="flex border border-stone-200 rounded-lg p-0.5 bg-stone-100">
            <button
              type="button"
              onClick={() => onChangeConfig((prev) => ({ ...prev, alignment: 'left' }))}
              className={`flex-1 py-1 flex items-center justify-center rounded-md transition-all cursor-pointer ${
                config.alignment === 'left' ? 'bg-white text-[#0E4A93] shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onChangeConfig((prev) => ({ ...prev, alignment: 'center' }))}
              className={`flex-1 py-1 flex items-center justify-center rounded-md transition-all cursor-pointer ${
                config.alignment === 'center' ? 'bg-white text-[#0E4A93] shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onChangeConfig((prev) => ({ ...prev, alignment: 'right' }))}
              className={`flex-1 py-1 flex items-center justify-center rounded-md transition-all cursor-pointer ${
                config.alignment === 'right' ? 'bg-white text-[#0E4A93] shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Text Color Selection */}
      <div className="space-y-1.5 pt-1">
        <label className="block text-[11px] font-bold text-stone-700 uppercase">
          Text Color
        </label>
        <div className="flex gap-2">
          {colorOptions.map((c) => {
            const isSelected = config.textColor === c.hex;
            return (
              <button
                key={c.hex}
                type="button"
                onClick={() => onChangeConfig((prev) => ({ ...prev, textColor: c.hex }))}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-[#0E4A93] scale-110 shadow-md ring-2 ring-[#0E4A93]/30'
                    : 'border-stone-300 hover:scale-105'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Scrim / Overlay Darkness Slider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-stone-700 uppercase">
            Photo Overlay Darkness (Readability)
          </label>
          <span className="text-[10px] font-extrabold text-[#0E4A93]">
            {config.overlayDarkness}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="80"
          step="5"
          value={config.overlayDarkness}
          onChange={(e) => {
            const val = Number(e.target.value);
            onChangeConfig((prev) => ({ ...prev, overlayDarkness: val }));
          }}
          className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#0E4A93]"
        />
        <div className="flex justify-between text-[9px] text-stone-400 font-bold">
          <span>Subtle (0%)</span>
          <span>Medium (40%)</span>
          <span>High Contrast (80%)</span>
        </div>
      </div>
    </div>
  );
};
