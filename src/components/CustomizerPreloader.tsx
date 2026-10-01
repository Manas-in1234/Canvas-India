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
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-150"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <video
        src="/assets/preloader/customizer-preloader.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-44 h-44 sm:w-56 sm:h-56 object-contain"
      />
    </div>
  );
};
