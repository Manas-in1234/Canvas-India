import React from 'react';
import { createPortal } from 'react-dom';

interface CustomizerPreloaderProps {
  active: boolean;
}

/**
 * The clip's own natural length (ms). The overlay is never hidden before this
 * elapses, even if the underlying work finishes instantly - a fast
 * connection means "play the standard loop once, at normal speed", not
 * "skip/cut the clip short". It only stays up longer than this when the
 * real async work genuinely takes longer.
 */
export const PRELOADER_MIN_MS = 4000;

/**
 * Branded loading indicator for the Canvas/Acrylic customizers.
 *
 * Rendered via a portal straight to document.body so it's genuinely fixed to
 * the viewport (a transformed ancestor anywhere in the customizer tree would
 * otherwise re-anchor `position: fixed`).
 *
 * The clip's own white background is stretched to fill the entire screen and
 * blurred (a scaled-up copy behind a sharp, normal-size copy of the same
 * clip), instead of a small bordered card - so the "background" people see
 * is the video's own backdrop, full-bleed and soft, not the live page.
 *
 * The video itself always plays at its native 1x rate (never sped up or
 * slowed down) - it's the `active` flag that is "synced to internet speed":
 * callers keep it true for exactly as long as the real async work (image
 * read/upload, section switch) takes, so on a slow connection the clip
 * simply loops for longer, and on a fast one it's visible only briefly.
 */
export const CustomizerPreloader: React.FC<CustomizerPreloaderProps> = ({ active }) => {
  if (!active) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-hidden animate-in fade-in duration-150"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Full-bleed, blurred, scaled-up copy - this is the clip's own white
          background stretched to fill the whole screen */}
      <video
        src="/assets/preloader/customizer-preloader.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl"
      />

      {/* Sharp, normal-size copy of the same clip on top, for the readable logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          src="/assets/preloader/customizer-preloader.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-56 h-56 sm:w-72 sm:h-72 object-contain drop-shadow-xl"
        />
      </div>
    </div>,
    document.body
  );
};
