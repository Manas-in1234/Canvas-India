// iPhones save Camera Roll photos as HEIC/HEIF by default. No major browser
// (including Safari/WebKit on iOS itself) can reliably decode HEIC through
// <img>/<canvas> the way the customizer needs to crop, preview and export a
// photo, so a HEIC upload has to be converted to a JPEG blob first. The
// converter library is loaded from a CDN on first use instead of being
// bundled, since it's only ever needed for the minority of uploads that are
// actually HEIC.

declare global {
  interface Window {
    heic2any?: (options: { blob: Blob; toType?: string; quality?: number }) => Promise<Blob | Blob[]>;
  }
}

let heic2anyLoadPromise: Promise<boolean> | null = null;

function loadHeic2any(): Promise<boolean> {
  if (window.heic2any) return Promise.resolve(true);
  if (heic2anyLoadPromise) return heic2anyLoadPromise;

  heic2anyLoadPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
    script.onload = () => resolve(Boolean(window.heic2any));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
  return heic2anyLoadPromise;
}

export function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase();
  return type === 'image/heic' || type === 'image/heif' || /\.(heic|heif)$/i.test(file.name);
}

/**
 * Converts a HEIC/HEIF file to a JPEG File with the same name (extension
 * swapped) for anything downstream that still reads file.name. Any other
 * file type, or a failed conversion (e.g. the CDN script didn't load), is
 * returned unchanged so the rest of the upload flow can still try its own
 * fallback instead of the upload silently going nowhere.
 */
export async function convertHeicFileIfNeeded(file: File): Promise<File> {
  if (!isHeicFile(file)) return file;

  const loaded = await loadHeic2any();
  if (!loaded || !window.heic2any) return file;

  try {
    const converted = await window.heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
    return new File([blob], newName || 'photo.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  }
}
