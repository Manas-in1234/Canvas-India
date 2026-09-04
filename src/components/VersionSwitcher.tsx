import React, { useState } from 'react';
import { Sparkles, Layers, Info, Check, ArrowRight, X } from 'lucide-react';

export type VersionType = 'v1-materials' | 'v2-studio' | 'v3-commercial';

interface VersionSwitcherProps {
  currentVersion: VersionType;
  onSelectVersion: (version: VersionType) => void;
}

export const VersionSwitcher: React.FC<VersionSwitcherProps> = ({
  currentVersion,
  onSelectVersion,
}) => {
  const [showRationaleModal, setShowRationaleModal] = useState(false);

  const versions = [
    {
      id: 'v1-materials' as VersionType,
      number: '01',
      title: 'Canvas India Signature',
      badge: 'Premium Indian E-Commerce',
      tagline: 'Clean, Polished, High-Conversion Indian Retail',
      palette: 'White • Light Grey • Charcoal • Canvas India Orange',
      typography: 'Plus Jakarta Sans • Clean Display Hierarchy',
      archetype: 'Flagship Indian printing store inspired by CanvasChamp & PrintWorld',
    },
    {
      id: 'v2-studio' as VersionType,
      number: '02',
      title: 'Canvas India Editorial',
      badge: 'Luxury Art & Interior Design',
      tagline: 'Art Made for Your Space • Quiet Architectural Luxury',
      palette: 'Warm White (#FAF9F6) • Ivory • Soft Beige • Muted Saffron • Charcoal',
      typography: 'Cormorant Garamond (Editorial Serif) • Manrope Body',
      archetype: 'Contemporary Indian art studio & luxury interior design atelier',
    },
    {
      id: 'v3-commercial' as VersionType,
      number: '03',
      title: 'Canvas India Orange Commerce',
      badge: 'High-Conversion Marketplace',
      tagline: 'Turn Your Photos Into Wall Art • Up to 40% OFF',
      palette: 'Vibrant Saffron Orange (#E85D04) • Crisp White • Deep Navy',
      typography: 'Bold High-Impact Sans-Serif • High Density Offers',
      archetype: 'Aggressive, product-heavy Indian e-commerce marketplace',
    },
  ];

  return (
    <>
      {/* Bottom Right Floating Switcher Bar */}
      <div className="fixed bottom-4 right-4 z-40 max-w-4xl w-auto">
        <div className="bg-stone-900/95 backdrop-blur-xl border border-stone-700/80 rounded-2xl p-1.5 shadow-2xl shadow-black/30 flex items-center gap-1 sm:gap-2">
          
          {/* Brand badge */}
          <div className="hidden lg:flex items-center gap-2 pl-3 pr-2 border-r border-stone-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">Design Editions</span>
          </div>

          {/* 3 Version Switch Tabs */}
          <div className="flex items-center gap-1 flex-1 sm:flex-initial overflow-x-auto no-scrollbar">
            {versions.map((v) => {
              const isActive = currentVersion === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => onSelectVersion(v.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--accent)] to-amber-600 text-white shadow-md shadow-[var(--accent)]/25 ring-1 ring-[var(--accent-light)]'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                  }`}
                >
                  <span className={`text-[10px] font-mono px-1 py-0.2 rounded-md ${
                    isActive ? 'bg-black/30 text-[var(--accent-border)]' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {v.number}
                  </span>
                  <span>{v.title}</span>
                  <span className="hidden sm:inline-block text-[9px] opacity-75 font-normal">
                    ({v.badge.split('•')[0].trim()})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Info / Rationale button */}
          <button
            onClick={() => setShowRationaleModal(true)}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors ml-1"
            title="Design Rationale & Strategy"
            aria-label="View Design Rationale"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Strategy / Rationale Modal */}
      {showRationaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setShowRationaleModal(false)}
          />

          <div className="relative bg-stone-900 border border-stone-700 text-stone-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 space-y-6 my-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/20 text-[var(--accent-light)] flex items-center justify-center font-bold text-xs">
                  CI
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Canvas India Homepage Strategies</h3>
                  <p className="text-xs text-stone-400">Three distinct executions of the official visual identity</p>
                </div>
              </div>
              <button
                onClick={() => setShowRationaleModal(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {versions.map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    onSelectVersion(v.id);
                    setShowRationaleModal(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    currentVersion === v.id
                      ? 'bg-[var(--accent-hover)]/30 border-[var(--accent)]/80 ring-1 ring-[var(--accent)]/40'
                      : 'bg-stone-800/50 border-stone-700/60 hover:bg-stone-800 hover:border-stone-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--accent-light)]">{v.number}</span>
                      <h4 className="font-bold text-white text-sm">{v.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-700 text-stone-300">
                        {v.badge}
                      </span>
                    </div>
                    {currentVersion === v.id && (
                      <span className="text-xs font-semibold text-[var(--accent-light)] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-300 mb-2">{v.tagline}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-400 pt-2 border-t border-stone-800">
                    <div><strong className="text-stone-300">Palette:</strong> {v.palette}</div>
                    <div><strong className="text-stone-300">Typography:</strong> {v.typography}</div>
                  </div>
                  <div className="text-[11px] text-[var(--accent-border)]/80 mt-1.5">
                    <strong className="text-stone-300">Focus:</strong> {v.archetype}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 text-xs text-stone-300 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[var(--accent-light)] shrink-0" />
              <span>
                All 3 versions use the official <strong>Canvas India</strong> vector logo, verified product data, and transparent material specifications.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
