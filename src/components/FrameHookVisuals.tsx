import React from 'react';

// Small "mitered corner" swatch: a colored/textured outer frame border
// around a lighter inner mat, so each option reads as an actual frame
// rather than a flat color square.
const FRAME_LOOK: Record<string, { frame: string; isLight?: boolean }> = {
  'No Frame': { frame: 'linear-gradient(135deg, #F5F3EE, #E7E2D7)', isLight: true },
  'Black Frame': { frame: 'linear-gradient(135deg, #3a3a3a, #0f0f0f)' },
  'Wooden Frame': { frame: 'linear-gradient(135deg, #C99A62, #6B3F1D)' },
  'White Frame': { frame: 'linear-gradient(135deg, #FFFFFF, #E4E1DA)', isLight: true },
  'Gold Frame': { frame: 'linear-gradient(135deg, #F1D98B, #9C7A1F)' },
};

export const FrameSwatch: React.FC<{ category: string; size?: number }> = ({ category, size = 36 }) => {
  const look = FRAME_LOOK[category] || FRAME_LOOK['No Frame'];
  return (
    <div
      className={`rounded-[3px] shadow-sm ${look.isLight ? 'border border-stone-300' : ''}`}
      style={{ width: size, height: size, padding: category === 'No Frame' ? 2 : 5, background: look.frame }}
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
