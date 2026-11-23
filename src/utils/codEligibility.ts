import { CartItem } from '../types';
import { isCorkCatalogProduct } from '../context/ShopContext';

const GENERIC_CUSTOM_STYLE_IDS = new Set([
  'canvas-single',
  'canvas-classic',
  'canvas-round',
  'canvas-triangle',
  'canvas-heart',
  'canvas-oval',
  'canvas-wall-art',
  'canvas-collage',
  'canvas-hexagon',
  'canvas-split',
  'canvas-mosaic',
  'canvas-lyric',
  'canvas-digital-painting',
  'canvas-quotes',
  'canvas-bus-roll',
  'canvas-banner',
  'canvas-pop-art',
  'canvas-word-art',
  'acrylic-print',
  'acrylic-single',
  'acrylic-square',
  'acrylic-wall-art',
  'acrylic-collage',
  'acrylic-mosaic',
  'acrylic-panoramic',
  'acrylic-round',
  'acrylic-triangle',
  'acrylic-heart',
  'acrylic-oval',
  'acrylic-hexagon',
  'acrylic-split',
  'single',
  'canvas',
  'acrylic',
]);

const GENERIC_CUSTOM_NAME_PREFIXES = [
  'single print',
  'classic canvas',
  'wall display',
  'round canvas',
  'heart canvas',
  'split canvas',
  'canvas collage',
  'acrylic print',
  'custom print',
];

/**
 * Checks whether a given identifier represents a generic customizer product style
 * (where customer uploads their own photo) rather than a catalogue artwork.
 */
export function isGenericCustomStyleId(idOrSlug?: string | null): boolean {
  if (!idOrSlug) return false;
  const clean = idOrSlug.trim().toLowerCase();
  return GENERIC_CUSTOM_STYLE_IDS.has(clean);
}

/**
 * Determines whether a CartItem is a personalized custom product with user-uploaded photo/content
 * ("products which I customize"), for which Cash on Delivery MUST be disabled.
 *
 * Ready-made customized products (catalogue artworks customized for size, frame, finish, wrap)
 * return false so Cash on Delivery STAYS ENABLED.
 */
export function isUserPersonalizedItem(item: CartItem): boolean {
  if (!item) return false;

  const details = item.customizationDetails;

  // 1. Explicit flags if set by customizer or shop context
  if (details?.hasUserUploadedPhoto === true) return true;
  if (details?.isPersonalized === true) return true;
  if (details?.isReadyMadeCatalogue === true) return false;
  if (details?.hasUserUploadedPhoto === false) return false;

  // 2. Workbench or virtual generated products
  const itemId = String(item.id || '').toLowerCase();
  const productId = String(item.product?.id || '').toLowerCase();
  if (itemId.startsWith('bench-') || productId.startsWith('custom-')) return true;

  // 3. Cork catalogue items are always ready-made
  if (item.product && isCorkCatalogProduct(item.product)) return false;

  // 4. If sourceProductId or sourceProductSlug is present and is a genuine catalogue product
  const sourceId = details?.sourceProductId ? String(details.sourceProductId).toLowerCase() : '';
  const sourceSlug = details?.sourceProductSlug ? String(details.sourceProductSlug).toLowerCase() : '';
  if (sourceId || sourceSlug) {
    const isSourceGeneric = isGenericCustomStyleId(sourceId) || isGenericCustomStyleId(sourceSlug);
    if (!isSourceGeneric) {
      // It is a ready-made catalogue design that was customized for size/frame!
      return false;
    }
  }

  // 5. Items with NO customization details are plain catalogue products
  if (!details) return false;

  // 6. Generic style titles (e.g. "Single Print - 16\" × 16\"", "Classic Canvas", "Round Canvas")
  const productName = String(item.product?.name || '').toLowerCase();
  if (GENERIC_CUSTOM_NAME_PREFIXES.some((prefix) => productName.startsWith(prefix))) {
    return true;
  }
  if (isGenericCustomStyleId(productId)) {
    return true;
  }

  // 7. If it has customization details and does NOT originate from a catalogue design,
  // it is a user-customized photo print.
  if (!sourceId && !sourceSlug) {
    return true;
  }

  return false;
}

/**
 * Checks whether an entire cart is blocked from Cash on Delivery due to containing
 * personalized user-customized photo products.
 */
export function isCartCodBlockedByPersonalization(cartItems: CartItem[]): boolean {
  if (!Array.isArray(cartItems) || cartItems.length === 0) return false;
  return cartItems.some(isUserPersonalizedItem);
}
