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
 * Plain full-screen white background matching the clip's own backdrop
 * exactly, with the clip centered on top at its normal size. A second,
 * moderately-scaled and blurred copy sits directly behind it as a soft,
 * contained glow - not stretched to fill the screen (that smeared the logo
 * into color blobs instead of reading as a glow), just enough blur radius
 * to add a bit of depth immediately around the sharp logo.
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white animate-in fade-in duration-150"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative flex items-center justify-center">
        {/* Soft contained glow - same clip, scaled up slightly and blurred,
            sitting directly behind the sharp copy. The blur filter is on this
            wrapping div, not the <video> itself: CSS filter: blur() applied
            directly to a playing video element silently fails to render in
            some browsers (the hardware video-decode compositing path bypasses
            it), but wrapping it in a blurred div works reliably everywhere. */}
        <div className="absolute inset-0 scale-125 blur-xl opacity-60 overflow-hidden">
          <video
            src="/assets/preloader/customizer-preloader.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
          />
        </div>
        <video
          src="/assets/preloader/customizer-preloader.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="relative w-64 h-64 sm:w-80 sm:h-80 object-contain"
        />
      </div>
    </div>,
    document.body
  );
};
