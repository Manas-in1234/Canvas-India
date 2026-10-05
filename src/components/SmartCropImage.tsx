import React, { useEffect, useRef, useState } from 'react';

interface SmartCropImageProps {
  src: string;
  alt?: string;
  className?: string;
  // Aspect ratio (width / height) of the box this image is displayed in.
  // Needed to compute exactly how much extra zoom is required so the
  // detected artwork bounding box fills the box edge-to-edge.
  containerAspect?: number;
  onLoad?: () => void;
}

interface CropResult {
  scale: number;
  posX: number; // 0-100, CSS object-position X
  posY: number; // 0-100, CSS object-position Y
}

const SAMPLE = 120; // analyze a small downscaled copy for speed
const BG_TOLERANCE = 16; // per-channel delta from the detected background color

// Loads the image onto an offscreen canvas and finds the tight bounding box
// of actual artwork content, excluding a uniform photographic mat/background
// border around it (common in stock product mockup photography). Returns a
// crop (scale + object-position) that, combined with object-fit: cover, zooms
// in exactly enough to fill the frame with the artwork and nothing else —
// never cropping into the artwork itself, since the box is content-derived.
function detectCrop(img: HTMLImageElement, containerAspect: number): CropResult {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return { scale: 1, posX: 50, posY: 50 };

  const canvas = document.createElement('canvas');
  const sw = ih >= iw ? Math.round(SAMPLE * (iw / ih)) : SAMPLE;
  const sh = iw >= ih ? Math.round(SAMPLE * (ih / iw)) : SAMPLE;
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { scale: 1, posX: 50, posY: 50 };
  ctx.drawImage(img, 0, 0, sw, sh);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, sw, sh).data;
  } catch {
    // Canvas tainted by a cross-origin image without CORS headers — bail out safely.
    return { scale: 1, posX: 50, posY: 50 };
  }

  const at = (x: number, y: number) => {
    const i = (y * sw + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };

  // Sample the four corners to establish the mat/background color.
  const corners = [at(0, 0), at(sw - 1, 0), at(0, sh - 1), at(sw - 1, sh - 1)];
  const bg = [0, 1, 2].map((c) => Math.round(corners.reduce((s, p) => s + p[c], 0) / 4));

  const isBg = (x: number, y: number) => {
    const [r, g, b] = at(x, y);
    return Math.abs(r - bg[0]) <= BG_TOLERANCE && Math.abs(g - bg[1]) <= BG_TOLERANCE && Math.abs(b - bg[2]) <= BG_TOLERANCE;
  };

  let top = 0;
  outerTop: for (; top < sh; top++) {
    for (let x = 0; x < sw; x++) if (!isBg(x, top)) break outerTop;
  }
  let bottom = sh - 1;
  outerBottom: for (; bottom > top; bottom--) {
    for (let x = 0; x < sw; x++) if (!isBg(x, bottom)) break outerBottom;
  }
  let left = 0;
  outerLeft: for (; left < sw; left++) {
    for (let y = 0; y < sh; y++) if (!isBg(left, y)) break outerLeft;
  }
  let right = sw - 1;
  outerRight: for (; right > left; right--) {
    for (let y = 0; y < sh; y++) if (!isBg(right, y)) break outerRight;
  }

  if (right <= left || bottom <= top) return { scale: 1, posX: 50, posY: 50 };

  // A little breathing room so we don't shave the very edge of the artwork.
  const padX = (right - left) * 0.015;
  const padY = (bottom - top) * 0.015;
  const bx0 = Math.max(0, (left - padX) / sw);
  const bx1 = Math.min(1, (right + padX) / sw);
  const by0 = Math.max(0, (top - padY) / sh);
  const by1 = Math.min(1, (bottom + padY) / sh);

  const boxFracW = bx1 - bx0;
  const boxFracH = by1 - by0;

  // Border is negligible — nothing meaningful to crop.
  if (boxFracW > 0.97 && boxFracH > 0.97) return { scale: 1, posX: 50, posY: 50 };

  // With object-fit: contain as the base fit, the image is scaled down
  // until it fully fits the box — its rendered size (normalized to a box
  // height of 1) is:
  const imgAspect = iw / ih;
  const renderedW = Math.min(imgAspect, containerAspect);
  const renderedH = Math.min(1, containerAspect / imgAspect);

  // Zoom needed so the bbox alone (not the whole image) would, under the
  // same contain logic, exactly fill the box in each axis.
  const zoomNeededX = containerAspect / (boxFracW * renderedW);
  const zoomNeededY = 1 / (boxFracH * renderedH);

  // Use the SMALLER of the two (contain-style): this guarantees the entire
  // artwork stays visible — never cropped — even if that means a sliver of
  // the box's own background shows on one axis when the artwork's aspect
  // ratio doesn't exactly match the frame's.
  const scale = Math.min(3, Math.max(1, Math.min(zoomNeededX, zoomNeededY)));
  const posX = ((bx0 + bx1) / 2) * 100;
  const posY = ((by0 + by1) / 2) * 100;

  return { scale, posX, posY };
}

// Drop-in replacement for a plain product image that automatically trims a
// uniform white/flat mat around the artwork (common in stock mockup
// photography or batch-extracted catalogue scans) WITHOUT ever cropping the
// artwork itself. Uses object-fit: contain + a precise zoom to the content's
// own bounding box, so the whole artwork always stays fully visible — on an
// aspect-ratio mismatch it leaves a sliver of box background on one axis
// rather than cutting into the image.
export const SmartCropImage: React.FC<SmartCropImageProps> = ({
  src,
  alt = '',
  className = '',
  containerAspect = 3 / 4,
  onLoad,
}) => {
  const [crop, setCrop] = useState<CropResult>({ scale: 1, posX: 50, posY: 50 });
  const currentSrc = useRef<string>('');

  useEffect(() => {
    if (!src) return;
    currentSrc.current = src;
    setCrop({ scale: 1, posX: 50, posY: 50 });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (currentSrc.current !== src) return; // src changed again before this resolved
      try {
        setCrop(detectCrop(img, containerAspect));
      } catch {
        setCrop({ scale: 1, posX: 50, posY: 50 });
      }
    };
    img.onerror = () => {
      if (currentSrc.current === src) setCrop({ scale: 1, posX: 50, posY: 50 });
    };
    img.src = src;
  }, [src, containerAspect]);

  return (
    <img
      src={src}
      alt={alt}
      onLoad={onLoad}
      className={className}
      style={{
        objectFit: 'contain',
        objectPosition: `${crop.posX}% ${crop.posY}%`,
        transform: `scale(${crop.scale})`,
        transformOrigin: '50% 50%',
        transition: 'transform 0.2s ease-out, object-position 0.2s ease-out',
      }}
    />
  );
};

export default SmartCropImage;
