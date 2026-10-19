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

// Illustrated "back of the print" view — wood stretcher-bar cross typical of
// a framed/stretched canvas, with the selected hook hardware mounted near
// the top, so customers can see exactly what hangs on their wall.
export const BackOfFrameView: React.FC<{ hook: string; className?: string }> = ({ hook, className = '' }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden rounded-sm ${className}`} style={{ background: 'linear-gradient(135deg, #D8B98A, #B6935F)' }}>
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 0 7px rgba(107,63,29,0.75)' }} />
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[12%]" style={{ background: 'rgba(107,63,29,0.8)' }} />
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[9%]" style={{ background: 'rgba(107,63,29,0.8)' }} />

      <div className="absolute left-1/2 -translate-x-1/2 top-[10%] flex flex-col items-center">
        <HookIcon type={hook} active />
      </div>
      {hook === 'Wire Hanger' && (
        <div className="absolute left-[22%] right-[22%] top-[15%] h-px" style={{ background: '#57534e' }} />
      )}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-[#4A2E14]/70 whitespace-nowrap">
        Back View — {hook}
      </div>
    </div>
  );
};
