import { Product } from '../types';

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
 * Acrylic "buy as-is" surcharge table — kept in sync with the identical
 * switch in AcrylicProductDetailPage's `unitPrice` memo. Pulled out here so
 * ProductCard can show the same total the detail page lands on for its
 * default selections, instead of the bare base price.
 */
export function acrylicSizeSurcharge(size: string | undefined): number {
  if (!size) return 0;
  if (size.includes('6" x 6"') || size.includes('5" x 7"') || size.includes('7" x 5"')) return 200;
  if (size.includes('8" x 8"') || size.includes('8" x 10"') || size.includes('10" x 8"')) return 450;
  if (size.includes('12" x 8"') || size.includes('8" x 12"') || size.includes('12" x 12"')) return 700;
  if (size.includes('12" x 18"') || size.includes('16" x 24"')) return 1100;
  if (size.includes('20" x 30"') || size.includes('24" x 36"') || size.includes('Set of 3')) return 1800;
  if (size.includes('30" x 48"') || size.includes('36" x 60"')) return 2600;
  return 0;
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

/**
 * The price AcrylicProductDetailPage would show for its default selections
 * (largest size, first thickness/base/paper) — i.e. what the listing card
 * should show too, so the two never mismatch.
 */
export function acrylicDefaultSelectionPrice(product: Product): number {
  if (product.material !== 'acrylic' && product.categorySlug !== 'acrylic') return product.price;
  const sizes = product.availableSizes?.length ? product.availableSizes : product.sizes;
  const defaultSize = sizes?.length ? sizes[sizes.length - 1] : undefined;
  const defaultThickness = product.availableThicknesses?.[0];
  const defaultBase = product.availableBases?.[0];
  const defaultPaper = product.availablePapers?.[0];
  return (
    product.price +
    acrylicSizeSurcharge(defaultSize) +
    acrylicThicknessSurcharge(defaultThickness) +
    acrylicBaseSurcharge(defaultBase) +
    acrylicPaperSurcharge(defaultPaper)
  );
}
