import React from 'react';

interface PointingHandProps {
  /** Which side of the target this hand sits on — drives the sleeve cuff
   * color (blue on the left, orange on the right, matching the button's own
   * gradient) and which way the pointing finger faces. */
  side: 'left' | 'right';
  className?: string;
}

const SKIN = '#F0B88F';
const SKIN_SHADOW = '#D89B6E';

// Simple flat-illustration hand with an extended index finger — drawn
// pointing right by default; mirrored for the right-side hand so both
// point inward at whatever sits between them.
export const PointingHand: React.FC<PointingHandProps> = ({ side, className = '' }) => {
  const cuffColor = side === 'left' ? '#0E4A93' : '#E8752A';
  // The bobbing/rotate animation (passed in via `className`) and this
  // mirror need to live on different elements — a CSS animation's
  // `transform` keyframes fully replace an inline `transform` on the SAME
  // element rather than combining with it, which silently un-mirrored the
  // right-hand's point direction once it started animating.
  return (
    <span className={className} style={{ display: 'inline-block' }}>
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        style={side === 'right' ? { transform: 'scaleX(-1)' } : undefined}
        aria-hidden="true"
      >
        {/* Sleeve cuff */}
        <rect x="0" y="22" width="18" height="20" rx="4" fill={cuffColor} />
        {/* Curled fingers (knuckle bumps) */}
        <circle cx="22" cy="21" r="5.5" fill={SKIN} />
        <circle cx="29.5" cy="19" r="5.5" fill={SKIN} />
        <circle cx="37" cy="20.5" r="5" fill={SKIN} />
        {/* Palm / fist */}
        <ellipse cx="26" cy="33" rx="14" ry="13" fill={SKIN} />
        {/* Thumb */}
        <ellipse cx="17" cy="39" rx="6.5" ry="4.5" fill={SKIN} transform="rotate(-25 17 39)" />
        {/* Index finger, extended and pointing right */}
        <rect x="34" y="27" width="27" height="11" rx="5.5" fill={SKIN} />
        <line x1="44" y1="28.5" x2="44" y2="36.5" stroke={SKIN_SHADOW} strokeWidth="1" opacity="0.55" />
        <line x1="52.5" y1="28.5" x2="52.5" y2="36.5" stroke={SKIN_SHADOW} strokeWidth="1" opacity="0.55" />
        {/* Soft shadow under the fist for a little depth */}
        <ellipse cx="26" cy="41" rx="13" ry="3" fill={SKIN_SHADOW} opacity="0.25" />
      </svg>
    </span>
  );
};

export default PointingHand;
