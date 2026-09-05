import React, { useEffect, useState } from 'react';
import { Palette, X } from 'lucide-react';

interface AccentOption {
  name: string;
  accent: string;
  hover: string;
  light: string;
  bg: string;
  border: string;
}

const ACCENT_OPTIONS: AccentOption[] = [
  { name: 'Emerald Green', accent: 'var(--accent)', hover: 'var(--accent-hover)', light: 'var(--accent-light)', bg: 'var(--accent-bg)', border: 'var(--accent-border)' },
  { name: 'Saffron Orange', accent: '#E85D04', hover: '#D44E00', light: '#FF8A3D', bg: '#FFF4ED', border: '#FDBA74' },
  { name: 'Navy Blue', accent: '#0F243E', hover: '#0A1A2E', light: '#1A385C', bg: '#EEF2F7', border: '#AFC9E0' },
  { name: 'Ruby Crimson', accent: '#B91C1C', hover: '#991B1B', light: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' },
  { name: 'Royal Purple', accent: '#6D28D9', hover: '#5B21B6', light: '#7C3AED', bg: '#F5F3FF', border: '#C4B5FD' },
  { name: 'Rose Gold', accent: '#C2410C', hover: '#9A3412', light: '#EA580C', bg: '#FFF7ED', border: '#FDBA74' },
  { name: 'Teal', accent: '#0F766E', hover: '#115E59', light: '#14B8A6', bg: '#F0FDFA', border: '#5EEAD4' },
  { name: 'Amber Gold', accent: '#B45309', hover: '#92400E', light: '#D97706', bg: '#FFFBEB', border: '#FCD34D' },
];

const STORAGE_KEY = 'canvasIndiaAccent';

function applyAccent(option: AccentOption) {
  const root = document.documentElement.style;
  root.setProperty('--accent', option.accent);
  root.setProperty('--accent-hover', option.hover);
  root.setProperty('--accent-light', option.light);
  root.setProperty('--accent-bg', option.bg);
  root.setProperty('--accent-border', option.border);
}

export const AccentColorPicker: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(ACCENT_OPTIONS[0].name);
  const [customHex, setCustomHex] = useState('var(--accent)');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: AccentOption = JSON.parse(saved);
        applyAccent(parsed);
        setSelected(parsed.name);
        if (parsed.name === 'Custom') setCustomHex(parsed.accent);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const choose = (option: AccentOption) => {
    applyAccent(option);
    setSelected(option.name);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(option));
    } catch {
      /* ignore */
    }
  };

  const chooseCustom = (hex: string) => {
    setCustomHex(hex);
    const option: AccentOption = {
      name: 'Custom',
      accent: hex,
      hover: hex,
      light: hex,
      bg: '#F5F5F4',
      border: hex,
    };
    choose(option);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] print:hidden">
      {open && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-stone-800">Live Accent Color</span>
            <button
              onClick={() => setOpen(false)}
              className="text-stone-400 hover:text-stone-700 cursor-pointer"
              aria-label="Close color picker"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-4">
            {ACCENT_OPTIONS.map((option) => {
              const isSelected = selected === option.name;
              return (
                <button
                  key={option.name}
                  onClick={() => choose(option)}
                  title={option.name}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <span
                    style={{ backgroundColor: option.accent }}
                    className={`w-9 h-9 rounded-full border transition-all ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-stone-800 border-white scale-110'
                        : 'border-black/10 group-hover:scale-105'
                    }`}
                  />
                  <span className="text-[9px] text-stone-500 leading-tight text-center">
                    {option.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
            <input
              type="color"
              value={customHex}
              onChange={(e) => chooseCustom(e.target.value)}
              className="w-9 h-9 rounded-lg border border-stone-200 cursor-pointer bg-transparent"
              aria-label="Custom accent color"
            />
            <span className="text-xs text-stone-500">Pick a custom color</span>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        style={{ backgroundColor: 'var(--accent)' }}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform border-4 border-white"
        aria-label="Toggle live accent color picker"
        title="Change site accent color"
      >
        {open ? <X className="w-5 h-5" /> : <Palette className="w-5 h-5" />}
      </button>
    </div>
  );
};
