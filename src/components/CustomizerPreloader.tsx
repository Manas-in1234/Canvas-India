import React from 'react';
import { createPortal } from 'react-dom';

interface CustomizerPreloaderProps {
  active: boolean;
}

/** Full loop duration of the recreated animation, in ms (draw-in, hold, erase, repeat). */
const LOOP_MS = 2200;

/**
 * Minimum time the preloader stays visible, even if the underlying work
 * finishes instantly - a fast connection means "let the loop play out once,
 * at its normal pace", not "cut it off mid-draw". It only stays up longer
 * than this when the real async work (image read/upload) genuinely takes
 * longer, in which case it just keeps looping.
 */
export const PRELOADER_MIN_MS = LOOP_MS;

/**
 * Branded loading indicator for the Canvas/Acrylic customizers.
 *
 * Fully coded as SVG + CSS, recreating the supplied preloader clip's own
 * animation rather than playing the video file - a plain mp4 has no alpha
 * channel, and every attempt to fake transparency on it (mix-blend-mode,
 * re-encoding to alpha WebM, live canvas chroma-keying) either broke
 * outright or dropped part of the mark along with the white background.
 *
 * Matches the clip's actual motion (checked against sampled frames across
 * the full clip): the "i" sits static, then the navy ring draws itself in
 * as a stroke animation sweeping around to a near-complete circle with a
 * gap at the upper right, holds, then erases and repeats - not a plain
 * continuous spin. Always pixel-sharp at any size, on any background, with
 * no codec/browser dependency.
 *
 * Rendered via a portal straight to document.body so it's genuinely fixed to
 * the viewport (a transformed ancestor anywhere in the customizer tree would
 * otherwise re-anchor `position: fixed`). The live page behind it stays
 * visible, just lightly blurred.
 */
export const CustomizerPreloader: React.FC<CustomizerPreloaderProps> = ({ active }) => {
  if (!active) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm animate-in fade-in duration-150"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <style>{`
        @keyframes ci-preloader-draw {
          0%   { stroke-dashoffset: 258; }
          22%  { stroke-dashoffset: 0; }
          78%  { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 258; }
        }
      `}</style>
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 drop-shadow-xl">
        {/* The "C" - navy ring that draws itself in, holds, then erases and repeats */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="41"
            fill="none"
            stroke="#1A2A4A"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray="204 54"
            strokeDashoffset="258"
            style={{ animation: `ci-preloader-draw ${LOOP_MS}ms ease-in-out infinite` }}
          />
        </svg>

        {/* The "i" - solid orange dot + body, always fully intact */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <span className="w-4 h-4 sm:w-[18px] sm:h-[18px] rounded-full bg-[#E8752A]" />
          <span className="w-3 h-9 sm:w-3.5 sm:h-10 rounded-full bg-[#E8752A]" style={{ transform: 'skewX(-6deg)' }} />
        </div>
      </div>
    </div>,
    document.body
  );
};
