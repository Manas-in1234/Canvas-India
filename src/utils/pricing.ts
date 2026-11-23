import { Product } from '../types';

// Pre-designed Print World catalogue art (Devotional Art, Line Art, etc.)
// used to have no real size variants of its own, so it was always priced
// flat, never by size. Admins can (and do) set real sizes on these now, so
// this only still applies when a product genuinely has none of its own —
// same rule as ProductDetailPage.tsx and AcrylicProductDetailPage.tsx, kept
// here too so ProductCard doesn't apply size surcharges to a product that
// was never meant to have them.
const CATALOGUE_DESIGN_SLUGS = [
  'devotional-art',
  'line-art',
  'motivational-posters',
  'scenery-landscape-art',
  'tribal-ethnic-art',
];
export function isCatalogueDesign(product: Product): boolean {
  const matchesSlug = CATALOGUE_DESIGN_SLUGS.includes(product.categorySlug) || CATALOGUE_DESIGN_SLUGS.some((slug) => product.id.includes(slug));
  const hasOwnSizes = (product.availableSizes && product.availableSizes.length > 0) || (product.sizes && product.sizes.length > 0);
  return matchesSlug && !hasOwnSizes;
}

/** Parses a size label like `12x18 inch`, `12" x 18"`, or `24X36` into inches. Returns null if unparseable. */
export function parseSizeInches(size: string | undefined): { width: number; height: number } | null {
  if (!size) return null;
  const match = size.match(/(\d+(?:\.\d+)?)\s*["xX]*\s*x\s*(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
  return { width, height };
}

/**
 * Prices a size relative to the product's own base price and smallest listed
 * size, using the same ₹-per-sq.inch area rate the customizer bills
 * non-rectangular shapes at (see `fetchPricingRates`) — so a canvas/acrylic
 * "buy as-is" product and the full customizer never disagree on what a given
 * size costs. `product.price` anchors the smallest size in `sizes`/`availableSizes`;
 * larger sizes add the area difference at `areaRatePerSqIn`.
 */
export function priceForSize(product: Product, size: string | undefined, areaRatePerSqIn: number): number {
  if (isCatalogueDesign(product)) return product.price;
  const sizes = (product.availableSizes?.length ? product.availableSizes : product.sizes) ?? [];
  const baseSize = sizes[0];
  const target = parseSizeInches(size);
  const base = parseSizeInches(baseSize);
  if (!target || !base) return product.price;
  const targetArea = target.width * target.height;
  const baseArea = base.width * base.height;
  return Math.max(product.price, Math.round(product.price + (targetArea - baseArea) * areaRatePerSqIn));
}

/** The smallest (first) listed size — the one `product.price` is anchored to. */
export function smallestSize(product: Product): string | undefined {
  const sizes = (product.availableSizes?.length ? product.availableSizes : product.sizes) ?? [];
  return sizes[0];
}

/**
 * Acrylic "buy as-is" surcharge table, keyed by parsed width×height rather
 * than the exact label text — the hand-built acrylic product set uses
 * labels like `6" x 6"`, but the generated catalogue (tribal/devotional/etc.
 * re-offered as acrylic) uses labels like `20x30 inch`; matching on the
 * literal substring silently priced every catalogue size at +0, which is
 * what caused the listing/detail mismatch this is fixing. Kept in sync with
 * the identical table in AcrylicProductDetailPage's `unitPrice` memo.
 */
export function acrylicSizeSurcharge(size: string | undefined): number {
  const parsed = parseSizeInches(size);
  if (!parsed) return 0;
  const area = parsed.width * parsed.height;
  if (area <= 16) return 0; // e.g. 4x4
  if (area <= 36) return 200; // 6x6, 5x7, 7x5
  if (area <= 80) return 450; // 8x8, 8x10, 10x8
  if (area <= 144) return 700; // 12x8, 8x12, 12x12
  if (area <= 384) return 1100; // 12x18, 16x24
  if (area <= 864) return 1800; // 20x30, 24x36
  return 2600; // 30x48, 36x60 and larger
}

export function acrylicThicknessSurcharge(thickness: string | undefined): number {
  if (thickness === '5mm') return 150;
  if (thickness === '6mm') return 200;
  if (thickness === '8mm') return 250;
  return 0;
}

export function acrylicBaseSurcharge(base: string | undefined): number {
  if (base === 'Acrylic Base') return 200;
  if (base === 'Solid Wood Base') return 250;
  if (base === 'Chrome Floating Standoffs') return 200;
  return 0;
}

export function acrylicPaperSurcharge(paper: string | undefined): number {
  return paper === 'Metallic Pearl Paper' ? 150 : 0;
}

// Mirrors AcrylicProductDetailPage's own fallback lists exactly — when a
// product has no sizes/papers/bases of its own, that page still shows a
// picker (defaulting to its largest size) instead of hiding one, so the
// card has to assume the same fallback or it'll show a lower price than
// the detail page lands on by default.
const ACRYLIC_FALLBACK_SIZES = [
  '4" x 4"', '6" x 4"', '4" x 6"', '5" x 5"', '5" x 7"', '7" x 5"',
  '6" x 6"', '8" x 8"', '10" x 8"', '8" x 10"', '12" x 8"', '8" x 12"',
];
const ACRYLIC_FALLBACK_PAPERS = ['White Luster Photo Paper', 'Metallic Pearl Paper'];
const ACRYLIC_FALLBACK_BASES = ['Without Base', 'Acrylic Base', 'Solid Wood Base'];

/**
 * The price AcrylicProductDetailPage would show for its default selections
 * (largest size, first thickness/base/paper) — i.e. what the listing card
 * should show too, so the two never mismatch.
 */
export function acrylicDefaultSelectionPrice(product: Product): number {
  // Product pages no longer offer size/thickness pickers (sizing happens in the customizer), so the
  // listing shows the product's own starting price instead of the largest-size price.
  return product.price;
}

function legacyAcrylicDefaultSelectionPrice(product: Product): number {
  if (isCatalogueDesign(product)) return product.price;
  if (product.material !== 'acrylic' && product.categorySlug !== 'acrylic') return product.price;
  const sizes = product.availableSizes?.length ? product.availableSizes : product.sizes?.length ? product.sizes : ACRYLIC_FALLBACK_SIZES;
  const defaultSize = sizes[sizes.length - 1];
  const defaultThickness = product.availableThicknesses?.[0]; // page defaults to '3mm', which carries no surcharge anyway
  const defaultBase = product.availableBases?.length ? product.availableBases[0] : ACRYLIC_FALLBACK_BASES[0];
  const defaultPaper = product.availablePapers?.length ? product.availablePapers[0] : ACRYLIC_FALLBACK_PAPERS[0];
  return (
    product.price +
    acrylicSizeSurcharge(defaultSize) +
    acrylicThicknessSurcharge(defaultThickness) +
    acrylicBaseSurcharge(defaultBase) +
    acrylicPaperSurcharge(defaultPaper)
  );
}
