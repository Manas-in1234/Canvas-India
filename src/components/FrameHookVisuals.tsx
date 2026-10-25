import React from 'react';

// Small "mitered corner" swatch and full-size frame visual styles:
// a colored/textured outer frame border around a lighter inner mat,
// so each option reads as an actual frame and applies realistically
// onto product preview images.
export type FrameCategory = 'No Frame' | 'Black Frame' | 'Wooden Frame' | 'White Frame' | 'Gold Frame';

export interface FrameLookConfig {
  frame: string;
  isLight?: boolean;
  borderColor: string;
  boxShadow: string;
  innerShadow: string;
}

export const FRAME_LOOK: Record<FrameCategory, FrameLookConfig> = {
  'No Frame': {
    frame: 'transparent',
    isLight: true,
    borderColor: 'transparent',
    boxShadow: 'none',
    innerShadow: 'none',
  },
  'Black Frame': {
    frame: 'linear-gradient(135deg, #383838 0%, #1a1a1a 45%, #0d0d0d 100%)',
    borderColor: '#111111',
    boxShadow: '0 16px 36px -8px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.18)',
    innerShadow: 'inset 0 3px 8px rgba(0,0,0,0.6), inset 0 0 2px rgba(0,0,0,0.4)',
  },
  'Wooden Frame': {
    frame: 'linear-gradient(135deg, #C28D56 0%, #8F5724 45%, #663812 100%)',
    borderColor: '#542E0D',
    boxShadow: '0 16px 36px -8px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.3)',
    innerShadow: 'inset 0 3px 8px rgba(0,0,0,0.5), inset 0 0 2px rgba(0,0,0,0.3)',
  },
  'White Frame': {
    frame: 'linear-gradient(135deg, #FFFFFF 0%, #F5F3ED 50%, #E7E3D8 100%)',
    isLight: true,
    borderColor: '#D4CFBE',
    boxShadow: '0 16px 36px -8px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.9)',
    innerShadow: 'inset 0 2px 6px rgba(0,0,0,0.22), inset 0 0 2px rgba(0,0,0,0.12)',
  },
  'Gold Frame': {
    frame: 'linear-gradient(135deg, #F7DC88 0%, #CD9E30 45%, #9E7216 100%)',
    borderColor: '#825E0F',
    boxShadow: '0 16px 36px -8px rgba(0,0,0,0.38), 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.55)',
    innerShadow: 'inset 0 3px 8px rgba(0,0,0,0.45), inset 0 0 2px rgba(0,0,0,0.25)',
  },
};

/**
 * Accurately determines the frame category from any product finish string.
 * Ensures Black Wood Frame matches Black Frame, Teak/Oak Wood Frame matches Wooden Frame, etc.
 */
export function getFrameCategory(finish?: string): FrameCategory {
  if (!finish) return 'No Frame';
  const l = finish.toLowerCase();
  if (/black/.test(l)) return 'Black Frame';
  if (/white/.test(l)) return 'White Frame';
  if (/gold/.test(l)) return 'Gold Frame';
  if (/teak|oak|walnut|brown|natural|rustic/.test(l) || (/wood/.test(l) && !/black|white|gold/.test(l))) return 'Wooden Frame';
  return 'No Frame';
}

export const FrameSwatch: React.FC<{ category: string; size?: number }> = ({ category, size = 36 }) => {
  const look = FRAME_LOOK[category] || FRAME_LOOK['No Frame'];
  const swatchBg = category === 'No Frame' ? 'linear-gradient(135deg, #F5F3EE, #E7E2D7)' : look.frame;
  return (
    <div
      className={`rounded-[3px] shadow-sm ${look.isLight ? 'border border-stone-300' : ''}`}
      style={{ width: size, height: size, padding: category === 'No Frame' ? 2 : 5, background: swatchBg }}
    >
      <div className="w-full h-full rounded-[1px] bg-gradient-to-br from-stone-200 to-stone-300" />
    </div>
  );
};

export type HookType = 'Sawtooth Hanger' | 'D-Ring Hanger' | 'Wire Hanger' | 'No Hook (Self Mount)';

export const HOOK_OPTIONS: HookType[] = ['Sawtooth Hanger', 'D-Ring Hanger', 'Wire Hanger', 'No Hook (Self Mount)'];

export const HookIcon: React.FC<{ type: string; active?: boolean }> = ({ type, active }) => {
  const color = active ? '#0E4A93' : '#78716C';
  const common = { width: 28, height: 28, viewBox: '0 0 28 28', fill: 'none' as const };

  if (type === 'Sawtooth Hanger') {
    return (
      <svg {...common}>
        <rect x="4" y="13" width="20" height="5" rx="1" fill={color} />
        <path d="M5 13 L8.5 8 L12 13 L15.5 8 L19 13 L22.5 8" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'D-Ring Hanger') {
    return (
      <svg {...common}>
        <rect x="2.5" y="17" width="7" height="4" rx="1" fill={color} />
        <rect x="18.5" y="17" width="7" height="4" rx="1" fill={color} />
        <circle cx="6" cy="12" r="3.5" stroke={color} strokeWidth="1.6" fill="none" />
        <circle cx="22" cy="12" r="3.5" stroke={color} strokeWidth="1.6" fill="none" />
      </svg>
    );
  }
  if (type === 'Wire Hanger') {
    return (
      <svg {...common}>
        <circle cx="6" cy="8" r="2.5" fill="none" stroke={color} strokeWidth="1.6" />
        <circle cx="22" cy="8" r="2.5" fill="none" stroke={color} strokeWidth="1.6" />
        <path d="M6 10.3 Q14 21 22 10.3" stroke={color} strokeWidth="1.6" fill="none" />
      </svg>
    );
  }
  // No Hook (Self Mount)
  return (
    <svg {...common}>
      <rect x="5" y="5" width="18" height="18" rx="2.5" stroke={color} strokeWidth="1.6" fill="none" />
      <line x1="6" y1="6" x2="22" y2="22" stroke={color} strokeWidth="1.6" />
    </svg>
  );
};

// Illustrated "back of the print" view — a stretched canvas's real wooden
// stretcher-bar frame (border bars + center brace), with the selected
// hook's actual hardware mounted where it's really fitted (on the top bar,
// or at the top corners for rings/wire), plus a small product label sticker
// like real prints ship with — so this reads as a real canvas back, not a
// flat brown box.
export const BackOfFrameView: React.FC<{ hook: string; className?: string }> = ({ hook, className = '' }) => {
  const uid = React.useId().replace(/[:]/g, '');
  const woodGradId = `bof-wood-${uid}`;
  const barGradId = `bof-bar-${uid}`;
  const metalGradId = `bof-metal-${uid}`;

  // Top-bar mount positions for ring-style hardware (D-Ring / Wire).
  const RING_L = 55;
  const RING_R = 145;
  const RING_Y = 30;

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-sm bg-stone-100 ${className}`}>
      <svg viewBox="0 0 200 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={woodGradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E2C397" />
            <stop offset="55%" stopColor="#C89A63" />
            <stop offset="100%" stopColor="#AD8150" />
          </linearGradient>
          <linearGradient id={barGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8C5A2E" />
            <stop offset="50%" stopColor="#6E4420" />
            <stop offset="100%" stopColor="#5A3618" />
          </linearGradient>
          <linearGradient id={metalGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A8ADB4" />
            <stop offset="100%" stopColor="#5E636B" />
          </linearGradient>
        </defs>

        {/* Canvas back panel */}
        <rect x="6" y="6" width="188" height="228" rx="6" fill={`url(#${woodGradId})`} />
        {/* Subtle fabric/wood grain texture */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={i}
            x1="6"
            y1={16 + i * 16}
            x2="194"
            y2={6 + i * 16}
            stroke="#00000012"
            strokeWidth="1"
          />
        ))}

        {/* Wooden stretcher-bar frame: border bars + center cross brace */}
        <rect x="6" y="6" width="188" height="22" fill={`url(#${barGradId})`} />
        <rect x="6" y="212" width="188" height="22" fill={`url(#${barGradId})`} />
        <rect x="6" y="6" width="22" height="228" fill={`url(#${barGradId})`} />
        <rect x="172" y="6" width="22" height="228" fill={`url(#${barGradId})`} />
        <rect x="6" y="110" width="188" height="20" fill={`url(#${barGradId})`} opacity="0.92" />
        <rect x="90" y="6" width="20" height="228" fill={`url(#${barGradId})`} opacity="0.92" />
        {/* Rounded outer edge so the frame bars don't overhang the panel corners */}
        <rect x="6" y="6" width="188" height="228" rx="6" fill="none" stroke="#4A2E14" strokeWidth="2" opacity="0.4" />

        {/* Hook hardware, mounted on the top bar */}
        {hook === 'Sawtooth Hanger' && (
          <g>
            <rect x="85" y="10" width="30" height="11" rx="1.5" fill={`url(#${metalGradId})`} />
            <path d="M87 10 L92 4 L97 10 L102 4 L107 10 L112 4" stroke="#3a3a3a" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
          </g>
        )}
        {(hook === 'D-Ring Hanger' || hook === 'Wire Hanger') && (
          <g>
            {hook === 'Wire Hanger' && (
              <path d={`M${RING_L} ${RING_Y} Q100 ${RING_Y + 26} ${RING_R} ${RING_Y}`} stroke="#9CA3AF" strokeWidth="1.8" fill="none" />
            )}
            {[RING_L, RING_R].map((cx) => (
              <g key={cx}>
                <rect x={cx - 8} y="8" width="16" height="13" rx="2" fill={`url(#${metalGradId})`} />
                <circle cx={cx} cy={RING_Y} r="5.5" fill="none" stroke="#4B5563" strokeWidth="2.2" />
              </g>
            ))}
          </g>
        )}
        {hook === 'No Hook (Self Mount)' && (
          <g>
            {[32, 168].map((cx) => (
              <g key={cx}>
                <rect x={cx - 11} y="9" width="22" height="12" rx="2" fill="#F4E8C1" stroke="#C9B37A" strokeWidth="1" />
                <path d={`M${cx + 6} 9 L${cx + 11} 9 L${cx + 11} 14 Z`} fill="#E8D9A0" />
              </g>
            ))}
          </g>
        )}

        {/* Product label sticker */}
        <rect x="18" y="186" width="92" height="30" rx="3" fill="#FAF7EF" stroke="#D8CDB0" strokeWidth="1" />
        <text x="24" y="198" fontSize="8" fontWeight="700" fill="#1f2937" fontFamily="Arial, sans-serif">CANVAS INDIA</text>
        <text x="24" y="209" fontSize="6" fill="#6b7280" fontFamily="Arial, sans-serif">Handcrafted Print</text>
      </svg>

      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-stone-700 shadow-sm">
        Back View
      </div>
    </div>
  );
};
