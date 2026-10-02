import React, { useEffect, useRef } from 'react';
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

// Internal canvas render resolution. The source clip has no alpha channel
// (plain mp4), so instead of a white background box we draw each frame to a
// canvas and key out the near-white background live - a real cutout of just
// the "i" and the "C" stroke, independent of any video codec's alpha support.
const CANVAS_SIZE = 480;
// Pixel channel value (0-255) above which a pixel counts as "white" and gets
// made fully transparent; below that down to WHITE_FADE_FLOOR it fades out
// smoothly so the logo's edges/shadow don't get a hard cutout ring.
const WHITE_CUTOFF = 235;
const WHITE_FADE_FLOOR = 195;

// The source clip's first ~1s draws the "C" ring in from nothing (just the
// "i" alone at the very start). Since the video restarts from 0 every time
// the preloader mounts, that bare-"i" intro would show at the start of every
// single loading moment. Instead, jump straight past it and loop only the
// "ring fully drawn" portion of the clip, so the full mark is visible for
// the entire time the preloader is up.
const RING_DRAWN_AT = 1.8; // seconds - ring is fully drawn and holding here
const LOOP_RESTART_MARGIN = 0.15; // seconds before the end to jump back

/**
 * Branded loading indicator for the Canvas/Acrylic customizers.
 *
 * Rendered via a portal straight to document.body so it's genuinely fixed to
 * the viewport (a transformed ancestor anywhere in the customizer tree would
 * otherwise re-anchor `position: fixed`). The live page behind the overlay
 * stays visible but lightly blurred, and the logo itself is a real
 * transparent cutout (no white box around it) drawn live onto a canvas.
 *
 * The video itself always plays at its native 1x rate (never sped up or
 * slowed down) - it's the `active` flag that is "synced to internet speed":
 * callers keep it true for exactly as long as the real async work (image
 * read/upload, section switch) takes, so on a slow connection the clip
 * simply loops for longer, and on a fast one it's visible only briefly.
 */
export const CustomizerPreloader: React.FC<CustomizerPreloaderProps> = ({ active }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return undefined;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return undefined;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return undefined;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // Jump straight past the "ring not drawn yet" intro, and loop only the
    // portion where the full mark is visible.
    const seekPastIntro = () => {
      if (video.duration && video.currentTime < RING_DRAWN_AT) {
        video.currentTime = RING_DRAWN_AT;
      }
    };
    const onTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - LOOP_RESTART_MARGIN) {
        video.currentTime = RING_DRAWN_AT;
      }
    };
    // Fallback in case timeupdate's granularity ever misses the restart
    // window and the clip actually reaches its end (no `loop` attribute).
    const onEnded = () => {
      video.currentTime = RING_DRAWN_AT;
      video.play().catch(() => {});
    };
    video.addEventListener('loadedmetadata', seekPastIntro);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    if (video.readyState >= 1) seekPastIntro();

    const draw = () => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        // Letterbox the source into the square canvas, preserving aspect ratio.
        const scale = Math.min(CANVAS_SIZE / video.videoWidth, CANVAS_SIZE / video.videoHeight);
        const w = video.videoWidth * scale;
        const h = video.videoHeight * scale;
        const x = (CANVAS_SIZE - w) / 2;
        const y = (CANVAS_SIZE - h) / 2;

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.drawImage(video, x, y, w, h);

        const frame = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        const d = frame.data;
        for (let i = 0; i < d.length; i += 4) {
          const whiteness = Math.min(d[i], d[i + 1], d[i + 2]);
          if (whiteness >= WHITE_CUTOFF) {
            d[i + 3] = 0;
          } else if (whiteness > WHITE_FADE_FLOOR) {
            const fade = (whiteness - WHITE_FADE_FLOOR) / (WHITE_CUTOFF - WHITE_FADE_FLOOR);
            d[i + 3] = Math.round(d[i + 3] * (1 - fade));
          }
        }
        ctx.putImageData(frame, 0, 0);
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      video.removeEventListener('loadedmetadata', seekPastIntro);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, [active]);

  if (!active) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm animate-in fade-in duration-150"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Hidden source video - only the keyed canvas below is shown */}
      {/* No `loop` attribute - looping is handled manually above, jumping
          back to RING_DRAWN_AT instead of 0, so the native loop-to-start
          behavior doesn't race with it. */}
      <video
        ref={videoRef}
        src="/assets/preloader/customizer-preloader.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        className="w-56 h-56 sm:w-72 sm:h-72 drop-shadow-xl"
      />
    </div>,
    document.body
  );
};
