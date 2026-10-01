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
 * otherwise re-anchor `position: fixed`). It only dims the page slightly and
 * shows a small card - the page underneath (e.g. the Upload panel) stays
 * fully visible around it, instead of being covered.
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 animate-in fade-in duration-150"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center justify-center">
        <video
          src="/assets/preloader/customizer-preloader.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
        />
      </div>
    </div>,
    document.body
  );
};
