import React from 'react';

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
 * Full-screen branded loading overlay for the Canvas/Acrylic customizers.
 *
 * The video itself always plays at its native 1x rate (never sped up or
 * slowed down) - it's the `active` flag that is "synced to internet speed":
 * callers keep it true for exactly as long as the real async work (image
 * read/upload, section switch) takes, so on a slow connection the clip
 * simply loops for longer, and on a fast one it's visible only briefly.
 */
export const CustomizerPreloader: React.FC<CustomizerPreloaderProps> = ({ active }) => {
  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center animate-in fade-in duration-150"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* The clip's own background is solid white; multiply-blending it lets
          the page underneath show through instead of covering it, so the
          overlay reads as the logo floating over whatever section is behind
          it rather than a white screen. */}
      <video
        src="/assets/preloader/customizer-preloader.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-64 h-64 sm:w-80 sm:h-80 object-contain mix-blend-multiply drop-shadow-xl"
      />
    </div>
  );
};
