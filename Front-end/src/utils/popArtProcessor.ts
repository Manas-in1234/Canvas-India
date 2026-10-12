// ============================================================================
// POP ART IMAGE PROCESSOR
// Client-side HTML5 Canvas transformation engine for Pop Art styles
// ============================================================================

import { PopArtStyleId } from '../data/popArtData';

// Cache processed data URLs to avoid redundant re-computations
const popArtCache = new Map<string, string>();

interface ProcessOptions {
  width?: number;
  height?: number;
  maxDimension?: number;
}

/**
 * Loads an image from a URL or data URI safely with CORS support
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Maps luminance (0..255) to a color gradient with given stops
 */
function mapLuminanceToGradient(
  lum: number,
  stops: Array<{ pos: number; r: number; g: number; b: number }>
): [number, number, number] {
  const norm = Math.max(0, Math.min(255, lum)) / 255;
  if (norm <= stops[0].pos) return [stops[0].r, stops[0].g, stops[0].b];
  if (norm >= stops[stops.length - 1].pos) {
    const last = stops[stops.length - 1];
    return [last.r, last.g, last.b];
  }

  for (let i = 0; i < stops.length - 1; i++) {
    const s1 = stops[i];
    const s2 = stops[i + 1];
    if (norm >= s1.pos && norm <= s2.pos) {
      const t = (norm - s1.pos) / (s2.pos - s1.pos);
      return [
        Math.round(s1.r + (s2.r - s1.r) * t),
        Math.round(s1.g + (s2.g - s1.g) * t),
        Math.round(s1.b + (s2.b - s1.b) * t)
      ];
    }
  }
  return [stops[0].r, stops[0].g, stops[0].b];
}

/**
 * Applies a single-panel color/poster transformation onto a canvas context
 */
function processSinglePanelLuminance(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stops: Array<{ pos: number; r: number; g: number; b: number }>,
  contrast: number = 1.2
) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Luminance calculation
    let lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    // Contrast enhancement
    lum = ((lum / 255 - 0.5) * contrast + 0.5) * 255;
    lum = Math.max(0, Math.min(255, lum));

    const [r, g, b] = mapLuminanceToGradient(lum, stops);
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Transforms an image using the selected Pop Art style
 */
export async function processPopArtImage(
  imageSrc: string,
  styleId: PopArtStyleId,
  options: ProcessOptions = {}
): Promise<string> {
  const maxDim = options.maxDimension || 900;
  const cacheKey = `${imageSrc.slice(0, 100)}_${imageSrc.length}_${styleId}_${maxDim}`;

  if (popArtCache.has(cacheKey)) {
    return popArtCache.get(cacheKey)!;
  }

  try {
    const img = await loadImage(imageSrc);
    const origW = img.naturalWidth || img.width || 800;
    const origH = img.naturalHeight || img.height || 800;

    // Calculate balanced canvas dimensions
    let targetW = origW;
    let targetH = origH;
    if (targetW > maxDim || targetH > maxDim) {
      if (targetW >= targetH) {
        targetH = Math.round((targetH / targetW) * maxDim);
        targetW = maxDim;
      } else {
        targetW = Math.round((targetW / targetH) * maxDim);
        targetH = maxDim;
      }
    }
    targetW = Math.max(200, targetW);
    targetH = Math.max(200, targetH);

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return imageSrc;

    // Dispatch processing by style
    switch (styleId) {
      // -------------------------------------------------------------
      // 1. ANDY-WARHOL: 4-Quadrant Pop Art Grid (2x2)
      // -------------------------------------------------------------
      case 'andy-warhol': {
        const halfW = Math.floor(targetW / 2);
        const halfH = Math.floor(targetH / 2);

        const quadrants = [
          // Q1: Top-Left (Yellow & Cyan/Navy)
          {
            x: 0,
            y: 0,
            stops: [
              { pos: 0.0, r: 15, g: 23, b: 42 }, // #0F172A
              { pos: 0.45, r: 6, g: 182, b: 212 }, // #06B6D4
              { pos: 1.0, r: 250, g: 204, b: 21 } // #FACC15
            ]
          },
          // Q2: Top-Right (Hot Pink & Light Cream)
          {
            x: halfW,
            y: 0,
            stops: [
              { pos: 0.0, r: 76, g: 29, b: 149 }, // #4C1D95
              { pos: 0.5, r: 236, g: 72, b: 153 }, // #EC4899
              { pos: 1.0, r: 253, g: 242, b: 248 } // #FDF2F8
            ]
          },
          // Q3: Bottom-Left (Vermilion Orange & Peach)
          {
            x: 0,
            y: halfH,
            stops: [
              { pos: 0.0, r: 67, g: 20, b: 7 }, // #431407
              { pos: 0.5, r: 249, g: 115, b: 22 }, // #F97316
              { pos: 1.0, r: 254, g: 215, b: 170 } // #FED7AA
            ]
          },
          // Q4: Bottom-Right (Electric Cyan & Lime Green)
          {
            x: halfW,
            y: halfH,
            stops: [
              { pos: 0.0, r: 30, g: 27, b: 75 }, // #1E1B4B
              { pos: 0.48, r: 132, g: 204, b: 22 }, // #84CC16
              { pos: 1.0, r: 6, g: 182, b: 212 } // #06B6D4
            ]
          }
        ];

        quadrants.forEach((q) => {
          // Offscreen buffer for quadrant
          const qCanvas = document.createElement('canvas');
          qCanvas.width = halfW;
          qCanvas.height = halfH;
          const qCtx = qCanvas.getContext('2d', { willReadFrequently: true });
          if (!qCtx) return;

          // Draw scaled image into quadrant
          qCtx.drawImage(img, 0, 0, halfW, halfH);
          processSinglePanelLuminance(qCtx, halfW, halfH, q.stops, 1.35);

          // Stamp into main canvas
          ctx.drawImage(qCanvas, q.x, q.y);
        });

        // 2px sleek grid divider lines
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(halfW - 1, 0, 2, targetH);
        ctx.fillRect(0, halfH - 1, targetW, 2);
        break;
      }

      // -------------------------------------------------------------
      // 2. CHE-ALL-IN-1: 4-Quadrant Revolutionary Grid (2x2)
      // -------------------------------------------------------------
      case 'che-all-in-1': {
        const halfW = Math.floor(targetW / 2);
        const halfH = Math.floor(targetH / 2);

        const quadrants = [
          // Q1: Revolutionary Red & Black
          {
            x: 0,
            y: 0,
            stops: [
              { pos: 0.0, r: 17, g: 24, b: 39 }, // #111827
              { pos: 0.5, r: 220, g: 38, b: 38 }, // #DC2626
              { pos: 1.0, r: 254, g: 226, b: 226 } // #FEE2E2
            ]
          },
          // Q2: Golden Yellow & Forest Green
          {
            x: halfW,
            y: 0,
            stops: [
              { pos: 0.0, r: 20, g: 83, b: 45 }, // #14532D
              { pos: 0.5, r: 234, g: 179, b: 8 }, // #EAB308
              { pos: 1.0, r: 254, g: 240, b: 138 } // #FEF08A
            ]
          },
          // Q3: Cyan & Royal Navy
          {
            x: 0,
            y: halfH,
            stops: [
              { pos: 0.0, r: 30, g: 58, b: 138 }, // #1E3A8A
              { pos: 0.5, r: 6, g: 182, b: 212 }, // #06B6D4
              { pos: 1.0, r: 207, g: 250, b: 254 } // #CFFAFE
            ]
          },
          // Q4: Hot Magenta & Deep Purple
          {
            x: halfW,
            y: halfH,
            stops: [
              { pos: 0.0, r: 88, g: 28, b: 135 }, // #581C87
              { pos: 0.5, r: 217, g: 70, b: 239 }, // #D946EF
              { pos: 1.0, r: 253, g: 242, b: 248 } // #FDF2F8
            ]
          }
        ];

        quadrants.forEach((q) => {
          const qCanvas = document.createElement('canvas');
          qCanvas.width = halfW;
          qCanvas.height = halfH;
          const qCtx = qCanvas.getContext('2d', { willReadFrequently: true });
          if (!qCtx) return;

          qCtx.drawImage(img, 0, 0, halfW, halfH);
          processSinglePanelLuminance(qCtx, halfW, halfH, q.stops, 1.4);
          ctx.drawImage(qCanvas, q.x, q.y);
        });

        ctx.fillStyle = '#000000';
        ctx.fillRect(halfW - 1, 0, 2, targetH);
        ctx.fillRect(0, halfH - 1, targetW, 2);
        break;
      }

      // -------------------------------------------------------------
      // 3. SACHIKO1: 4-Quadrant Pastel Pop Quartet (2x2)
      // -------------------------------------------------------------
      case 'sachiko1': {
        const halfW = Math.floor(targetW / 2);
        const halfH = Math.floor(targetH / 2);

        const quadrants = [
          // Pastel Pink & Plum
          {
            x: 0,
            y: 0,
            stops: [
              { pos: 0.0, r: 112, g: 26, b: 117 }, // #701A75
              { pos: 0.5, r: 244, g: 114, b: 182 }, // #F472B6
              { pos: 1.0, r: 253, g: 242, b: 248 }
            ]
          },
          // Seafoam Mint & Slate Teal
          {
            x: halfW,
            y: 0,
            stops: [
              { pos: 0.0, r: 17, g: 94, b: 89 }, // #115E59
              { pos: 0.5, r: 52, g: 211, b: 153 }, // #34D399
              { pos: 1.0, r: 236, g: 253, b: 245 }
            ]
          },
          // Pastel Peach & Rust
          {
            x: 0,
            y: halfH,
            stops: [
              { pos: 0.0, r: 154, g: 52, b: 18 }, // #9A3412
              { pos: 0.5, r: 251, g: 146, b: 60 }, // #FB923C
              { pos: 1.0, r: 255, g: 247, b: 237 }
            ]
          },
          // Lavender & Cobalt
          {
            x: halfW,
            y: halfH,
            stops: [
              { pos: 0.0, r: 30, g: 27, b: 75 }, // #1E1B4B
              { pos: 0.5, r: 167, g: 139, b: 250 }, // #A78BFA
              { pos: 1.0, r: 245, g: 243, b: 255 }
            ]
          }
        ];

        quadrants.forEach((q) => {
          const qCanvas = document.createElement('canvas');
          qCanvas.width = halfW;
          qCanvas.height = halfH;
          const qCtx = qCanvas.getContext('2d', { willReadFrequently: true });
          if (!qCtx) return;

          qCtx.drawImage(img, 0, 0, halfW, halfH);
          processSinglePanelLuminance(qCtx, halfW, halfH, q.stops, 1.25);
          ctx.drawImage(qCanvas, q.x, q.y);
        });

        ctx.fillStyle = '#1E1B4B';
        ctx.fillRect(halfW - 1, 0, 2, targetH);
        ctx.fillRect(0, halfH - 1, targetW, 2);
        break;
      }

      // -------------------------------------------------------------
      // 4. CHE-ALL-IN-2: 6-Panel Pop Montage (3 cols x 2 rows)
      // -------------------------------------------------------------
      case 'che-all-in-2': {
        const colW = Math.floor(targetW / 3);
        const rowH = Math.floor(targetH / 2);

        const panels = [
          // 1: Red & Black
          {
            x: 0,
            y: 0,
            stops: [
              { pos: 0.0, r: 24, g: 24, b: 27 },
              { pos: 0.5, r: 220, g: 38, b: 38 },
              { pos: 1.0, r: 254, g: 202, b: 202 }
            ]
          },
          // 2: Gold & Purple
          {
            x: colW,
            y: 0,
            stops: [
              { pos: 0.0, r: 88, g: 28, b: 135 },
              { pos: 0.5, r: 245, g: 158, b: 11 },
              { pos: 1.0, r: 254, g: 243, b: 199 }
            ]
          },
          // 3: Green & Orange
          {
            x: colW * 2,
            y: 0,
            stops: [
              { pos: 0.0, r: 194, g: 65, b: 12 },
              { pos: 0.5, r: 16, g: 185, b: 129 },
              { pos: 1.0, r: 209, g: 250, b: 229 }
            ]
          },
          // 4: Pink & Navy
          {
            x: 0,
            y: rowH,
            stops: [
              { pos: 0.0, r: 30, g: 58, b: 138 },
              { pos: 0.5, r: 236, g: 72, b: 153 },
              { pos: 1.0, r: 252, g: 231, b: 243 }
            ]
          },
          // 5: Violet & Amber
          {
            x: colW,
            y: rowH,
            stops: [
              { pos: 0.0, r: 180, g: 83, b: 9 },
              { pos: 0.5, r: 139, g: 92, b: 246 },
              { pos: 1.0, r: 237, g: 233, b: 254 }
            ]
          },
          // 6: Cyan & Magenta
          {
            x: colW * 2,
            y: rowH,
            stops: [
              { pos: 0.0, r: 131, g: 24, b: 67 },
              { pos: 0.5, r: 6, g: 182, b: 212 },
              { pos: 1.0, r: 224, g: 242, b: 254 }
            ]
          }
        ];

        panels.forEach((p) => {
          const pCanvas = document.createElement('canvas');
          pCanvas.width = colW;
          pCanvas.height = rowH;
          const pCtx = pCanvas.getContext('2d', { willReadFrequently: true });
          if (!pCtx) return;

          pCtx.drawImage(img, 0, 0, colW, rowH);
          processSinglePanelLuminance(pCtx, colW, rowH, p.stops, 1.35);
          ctx.drawImage(pCanvas, p.x, p.y);
        });

        ctx.fillStyle = '#000000';
        ctx.fillRect(colW - 1, 0, 2, targetH);
        ctx.fillRect(colW * 2 - 1, 0, 2, targetH);
        ctx.fillRect(0, rowH - 1, targetW, 2);
        break;
      }

      // -------------------------------------------------------------
      // 5. PIXEL PAINTING: Retro 8-bit digital pixel mosaic
      // -------------------------------------------------------------
      case 'pixel-painting': {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;

        // Pixel block size (calibrated to canvas dimension)
        const blockSize = Math.max(8, Math.round(targetW / 48));

        ctx.clearRect(0, 0, targetW, targetH);

        for (let y = 0; y < targetH; y += blockSize) {
          for (let x = 0; x < targetW; x += blockSize) {
            let totalR = 0;
            let totalG = 0;
            let totalB = 0;
            let count = 0;

            const blockW = Math.min(blockSize, targetW - x);
            const blockH = Math.min(blockSize, targetH - y);

            for (let by = 0; by < blockH; by++) {
              for (let bx = 0; bx < blockW; bx++) {
                const idx = ((y + by) * targetW + (x + bx)) * 4;
                totalR += data[idx];
                totalG += data[idx + 1];
                totalB += data[idx + 2];
                count++;
              }
            }

            if (count > 0) {
              let avgR = Math.round(totalR / count);
              let avgG = Math.round(totalG / count);
              let avgB = Math.round(totalB / count);

              // Boost color vibrancy & saturation for pixel pop aesthetic
              const maxC = Math.max(avgR, avgG, avgB);
              const minC = Math.min(avgR, avgG, avgB);
              const delta = maxC - minC;
              if (delta > 20) {
                avgR = Math.min(255, Math.round(avgR * 1.12));
                avgG = Math.min(255, Math.round(avgG * 1.12));
                avgB = Math.min(255, Math.round(avgB * 1.12));
              }

              ctx.fillStyle = `rgb(${avgR}, ${avgG}, ${avgB})`;
              ctx.fillRect(x, y, blockW, blockH);

              // Subtle pixel grid border
              ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
              ctx.lineWidth = 0.5;
              ctx.strokeRect(x, y, blockW, blockH);
            }
          }
        }
        break;
      }

      // -------------------------------------------------------------
      // 6. LICHTENSTEIN: Ben-Day halftone dots & primary comic inking
      // -------------------------------------------------------------
      case 'lichtenstein': {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;

        // Base cream comic background
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(0, 0, targetW, targetH);

        const dotSpacing = Math.max(6, Math.round(targetW / 70));
        const maxRadius = dotSpacing * 0.48;

        for (let y = 0; y < targetH; y += dotSpacing) {
          for (let x = 0; x < targetW; x += dotSpacing) {
            const idx = (y * targetW + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            // Halftone Ben-Day dots in midtones
            if (lum < 230) {
              const radius = maxRadius * (1 - lum / 255);
              ctx.beginPath();
              ctx.arc(x + dotSpacing / 2, y + dotSpacing / 2, radius, 0, Math.PI * 2);

              if (lum < 75) {
                // Shadow ink dots: Dark Blue / Black
                ctx.fillStyle = '#0F172A';
              } else if (r > g && r > b) {
                // Warm region: Comic Magenta / Red
                ctx.fillStyle = '#E11D48';
              } else {
                // Cool region: Comic Cyan / Blue
                ctx.fillStyle = '#0284C7';
              }
              ctx.fill();
            }
          }
        }

        // Overlay comic ink outlines using edge detection
        for (let y = 1; y < targetH - 1; y += 2) {
          for (let x = 1; x < targetW - 1; x += 2) {
            const idx = (y * targetW + x) * 4;
            const rightIdx = (y * targetW + (x + 1)) * 4;
            const downIdx = ((y + 1) * targetW + x) * 4;

            const diff =
              Math.abs(data[idx] - data[rightIdx]) +
              Math.abs(data[idx] - data[downIdx]);

            if (diff > 80) {
              ctx.fillStyle = '#000000';
              ctx.fillRect(x, y, 2, 2);
            }
          }
        }
        break;
      }

      // -------------------------------------------------------------
      // 7. CARICATURES: Cel-shaded cartoon portrait with contour inking
      // -------------------------------------------------------------
      case 'caricatures': {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;

        // Cel shading quantization (4 levels per color channel)
        for (let i = 0; i < data.length; i += 4) {
          // Quantize channels
          data[i] = Math.round(data[i] / 64) * 64;
          data[i + 1] = Math.round(data[i + 1] / 64) * 64;
          data[i + 2] = Math.round(data[i + 2] / 64) * 64;

          // Boost warm facial tones
          data[i] = Math.min(255, Math.round(data[i] * 1.15));
        }

        ctx.putImageData(imgData, 0, 0);

        // Overlay comic caricature inking strokes
        const edgeData = ctx.getImageData(0, 0, targetW, targetH);
        const eData = edgeData.data;

        ctx.fillStyle = '#1E293B';
        for (let y = 1; y < targetH - 1; y++) {
          for (let x = 1; x < targetW - 1; x++) {
            const idx = (y * targetW + x) * 4;
            const rightIdx = (y * targetW + (x + 1)) * 4;
            const downIdx = ((y + 1) * targetW + x) * 4;

            const diff =
              Math.abs(eData[idx] - eData[rightIdx]) +
              Math.abs(eData[idx + 1] - eData[rightIdx + 1]) +
              Math.abs(eData[idx + 2] - eData[rightIdx + 2]);

            if (diff > 70) {
              ctx.fillRect(x, y, 1.5, 1.5);
            }
          }
        }
        break;
      }

      // -------------------------------------------------------------
      // 8. GLO-PORTRAIT: Neon glowing contours & vibrant pop backdrop
      // -------------------------------------------------------------
      case 'glo-portrait': {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        processSinglePanelLuminance(
          ctx,
          targetW,
          targetH,
          [
            { pos: 0.0, r: 30, g: 58, b: 138 }, // #1E3A8A
            { pos: 0.45, r: 236, g: 72, b: 153 }, // #EC4899
            { pos: 1.0, r: 254, g: 240, b: 138 } // #FEF08A
          ],
          1.3
        );

        // Neon outline overlay
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;

        ctx.fillStyle = '#38BDF8'; // Electric neon cyan
        for (let y = 1; y < targetH - 1; y += 2) {
          for (let x = 1; x < targetW - 1; x += 2) {
            const idx = (y * targetW + x) * 4;
            const rightIdx = (y * targetW + (x + 1)) * 4;
            const diff = Math.abs(data[idx] - data[rightIdx]);
            if (diff > 60) {
              ctx.fillRect(x, y, 2, 2);
            }
          }
        }
        break;
      }

      // -------------------------------------------------------------
      // 9. COCA COLA1: Hot pink & electric cyan screenprint
      // -------------------------------------------------------------
      case 'coca-cola1': {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        processSinglePanelLuminance(
          ctx,
          targetW,
          targetH,
          [
            { pos: 0.0, r: 56, g: 18, b: 45 }, // Deep Plum
            { pos: 0.4, r: 219, g: 39, b: 119 }, // Hot Fuchsia #DB2777
            { pos: 0.8, r: 56, g: 189, b: 248 }, // Electric Cyan #38BDF8
            { pos: 1.0, r: 255, g: 255, b: 255 } // Pure White
          ],
          1.45
        );
        break;
      }

      // -------------------------------------------------------------
      // 10. COCA COLA2: Crimson red, parchment cream & navy vintage poster
      // -------------------------------------------------------------
      case 'coca-cola2': {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        processSinglePanelLuminance(
          ctx,
          targetW,
          targetH,
          [
            { pos: 0.0, r: 15, g: 23, b: 42 }, // Midnight Navy #0F172A
            { pos: 0.45, r: 185, g: 28, b: 28 }, // Crimson Red #B91C1C
            { pos: 0.8, r: 254, g: 243, b: 199 }, // Parchment Cream #FEF3C7
            { pos: 1.0, r: 255, g: 255, b: 255 }
          ],
          1.5
        );
        break;
      }

      // -------------------------------------------------------------
      // 11. COUPE5: High-contrast silver gelatin black-and-white
      // -------------------------------------------------------------
      case 'coupe5': {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        processSinglePanelLuminance(
          ctx,
          targetW,
          targetH,
          [
            { pos: 0.0, r: 0, g: 0, b: 0 },
            { pos: 0.35, r: 55, g: 65, b: 81 }, // Charcoal #374151
            { pos: 0.75, r: 209, g: 213, b: 219 }, // Silver #D1D5DB
            { pos: 1.0, r: 255, g: 255, b: 255 }
          ],
          1.6
        );
        break;
      }

      // -------------------------------------------------------------
      // 12. COUPE8: Warm monochrome sepia vintage screenprint
      // -------------------------------------------------------------
      case 'coupe8': {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        processSinglePanelLuminance(
          ctx,
          targetW,
          targetH,
          [
            { pos: 0.0, r: 41, g: 26, b: 16 }, // Deep Espresso #291A10
            { pos: 0.5, r: 120, g: 78, b: 48 }, // Warm Caramel #784E30
            { pos: 1.0, r: 245, g: 235, b: 225 } // Ivory Cream #F5EBE1
          ],
          1.35
        );
        break;
      }

      // -------------------------------------------------------------
      // 13. CHE1: Monochromatic warm amber & vermilion screenprint
      // -------------------------------------------------------------
      case 'che1': {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        processSinglePanelLuminance(
          ctx,
          targetW,
          targetH,
          [
            { pos: 0.0, r: 39, g: 18, b: 6 }, // Deep Burnt Umber
            { pos: 0.45, r: 194, g: 65, b: 12 }, // Fiery Vermilion #C2410C
            { pos: 1.0, r: 253, g: 230, b: 138 } // Golden Amber #FDE68A
          ],
          1.4
        );
        break;
      }

      // -------------------------------------------------------------
      // 14. MARILYN1: Electric turquoise & fuchsia screenprint
      // -------------------------------------------------------------
      case 'marilyn1': {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        processSinglePanelLuminance(
          ctx,
          targetW,
          targetH,
          [
            { pos: 0.0, r: 14, g: 74, b: 94 }, // Deep Marine Teal #0E4A5E
            { pos: 0.48, r: 190, g: 24, b: 93 }, // Hot Fuchsia #BE185D
            { pos: 1.0, r: 56, g: 189, b: 248 } // Luminous Turquoise #38BDF8
          ],
          1.45
        );
        break;
      }

      // -------------------------------------------------------------
      // 15. DOLLAR3: Cobalt blue & mustard yellow pop art
      // -------------------------------------------------------------
      case 'dollar3': {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        processSinglePanelLuminance(
          ctx,
          targetW,
          targetH,
          [
            { pos: 0.0, r: 23, g: 37, b: 84 }, // Midnight Navy #172554
            { pos: 0.45, r: 29, g: 78, b: 216 }, // Cobalt Blue #1D4ED8
            { pos: 1.0, r: 250, g: 204, b: 21 } // Mustard Yellow #FACC15
          ],
          1.4
        );
        break;
      }

      // -------------------------------------------------------------
      // 16. MAO5: Avant-garde crimson, sage green & charcoal silkscreen
      // -------------------------------------------------------------
      case 'mao5': {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        processSinglePanelLuminance(
          ctx,
          targetW,
          targetH,
          [
            { pos: 0.0, r: 24, g: 24, b: 27 }, // Pitch Charcoal #18181B
            { pos: 0.4, r: 153, g: 27, b: 27 }, // Crimson Red #991B1B
            { pos: 0.75, r: 21, g: 128, b: 61 }, // Sage Green #15803D
            { pos: 1.0, r: 254, g: 240, b: 138 } // Light Cream #FEF08A
          ],
          1.45
        );
        break;
      }

      default: {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        break;
      }
    }

    const dataUrl = canvas.toDataURL('image/png', 0.95);
    popArtCache.set(cacheKey, dataUrl);
    return dataUrl;
  } catch (err) {
    console.error('Failed to process pop art image:', err);
    return imageSrc;
  }
}
