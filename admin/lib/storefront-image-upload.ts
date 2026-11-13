import { HERO_IMAGE_MAX_BYTES } from './hero-image-slots';

export const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
export const maxSourceBytes = 25 * 1024 * 1024;

export async function prepareImage(file: File) {
  if (file.size <= 1024 * 1024) return file;

  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 2200 / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not prepare this image. Try a smaller JPEG or WebP.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', 0.86));
    if (blob?.type === 'image/webp' && blob.size <= HERO_IMAGE_MAX_BYTES && blob.size < file.size) {
      return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: blob.type });
    }
    if (file.size <= HERO_IMAGE_MAX_BYTES) return file;
    throw new Error('This image is still too large after resizing. Try a smaller image.');
  } finally {
    bitmap.close();
  }
}
