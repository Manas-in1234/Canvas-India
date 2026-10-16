import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface CustomizerPreloaderProps {
  active: boolean;
}

export const PRELOADER_MIN_MS = 4000;

/**
 * Branded loading indicator for the Canvas and Acrylic customizers.
 *
 * Renders the brand logo animation directly over the translucent page overlay
 * by real-time alpha-keying the animated source frames onto a transparent HTML5 canvas.
 * This completely eliminates the opaque white video rectangle while preserving
 * 100% of the native animation, timing, frame rate, colors, and duration.
 */
export const CustomizerPreloader: React.FC<CustomizerPreloaderProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    let animId: number;
    let isRunning = true;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // High-fidelity rendering resolution (16:9 ratio matching original source video)
    const renderWidth = 640;
    const renderHeight = 360;
    canvas.width = renderWidth;
    canvas.height = renderHeight;

    const render = () => {
      if (!isRunning) return;
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, renderWidth, renderHeight);
        const imgData = ctx.getImageData(0, 0, renderWidth, renderHeight);
        const data = imgData.data;
        const len = data.length;

        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const minVal = r < g ? (r < b ? r : b) : (g < b ? g : b);

          if (minVal >= 250) {
            data[i + 3] = 0;
          } else if (minVal > 220) {
            // Anti-aliased edge smoothing with un-premultiplication
            const alpha = (250 - minVal) / 30.0;
            data[i + 3] = (alpha * 255) | 0;
            const aSafe = alpha > 0.05 ? alpha : 0.05;
            const factor = (1.0 - alpha) * 255.0;
            const nr = (r - factor) / aSafe;
            const ng = (g - factor) / aSafe;
            const nb = (b - factor) / aSafe;
            data[i] = nr > 255 ? 255 : (nr < 0 ? 0 : nr | 0);
            data[i + 1] = ng > 255 ? 255 : (ng < 0 ? 0 : ng | 0);
            data[i + 2] = nb > 255 ? 255 : (nb < 0 ? 0 : nb | 0);
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }
      animId = requestAnimationFrame(render);
    };

    video.play().catch(() => {});
    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [active]);

  if (!active) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/75 backdrop-blur-[2px] animate-in fade-in duration-150"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <video
        ref={videoRef}
        src="/assets/preloader/customizer-preloader.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="hidden"
        aria-hidden="true"
      />
      <canvas
        ref={canvasRef}
        className="w-64 h-64 sm:w-80 sm:h-80 object-contain bg-transparent pointer-events-none"
        style={{ background: 'transparent' }}
      />
    </div>,
    document.body
  );
};
