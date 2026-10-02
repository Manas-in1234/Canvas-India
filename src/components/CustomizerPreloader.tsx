import React from 'react';
import { createPortal } from 'react-dom';

interface CustomizerPreloaderProps {
  active: boolean;
}

/**
 * Minimum time the preloader stays visible, even if the underlying work
 * finishes instantly - a fast connection means "show the loading beat once,
 * at a normal pace", not "skip it". It only stays up longer than this when
 * the real async work (image read/upload) genuinely takes longer.
 */
export const PRELOADER_MIN_MS = 1200;

/**
 * Branded loading indicator for the Canvas/Acrylic customizers.
 *
 * Fully coded as SVG + CSS - no video file. Earlier versions used the
 * supplied preloader clip, but a plain mp4 has no alpha channel and every
 * attempt to fake transparency (mix-blend-mode, re-encoding to alpha WebM,
 * live canvas chroma-keying) either broke outright or dropped parts of the
 * mark (the chroma-key pass keyed out some navy pixels along with the
 * white). Recreating the mark directly as SVG sidesteps all of that: the
 * "i" is drawn in solid color, the "C" is a spinning arc (which also reads
 * naturally as a loading indicator), and both are always fully intact and
 * pixel-sharp at any size, on any background.
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
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 drop-shadow-xl">
        {/* The "C" - a spinning navy arc, doubling as the loading indicator */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '1.1s' }}>
          <circle
            cx="50"
            cy="50"
            r="41"
            fill="none"
            stroke="#1A2A4A"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray="180 300"
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
