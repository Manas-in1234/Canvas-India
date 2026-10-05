import { Product } from '../types';
import { ALL_PRODUCTS } from '../data/productsData';

// Local category artwork used when backend products do not specify images.
// Keeping these local makes API-powered cards work offline and avoids depending
// on third-party image URLs that may be unavailable or rate-limited.
const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  canvas: '/products/placeholders/canvas-placeholder.svg',
  'canvas-prints': '/products/placeholders/canvas-placeholder.svg',
  acrylic: '/products/placeholders/acrylic-placeholder.svg',
  'acrylic-prints': '/products/placeholders/acrylic-placeholder.svg',
  cork: '/products/placeholders/cork-placeholder.svg',
  'cork-prints': '/products/placeholders/cork-placeholder.svg',
  posters: '/products/placeholders/poster-placeholder.svg',
  'wall-art': '/products/placeholders/poster-placeholder.svg',
  'photo-frames': '/products/placeholders/default-placeholder.svg',
  'custom-prints': '/products/placeholders/custom-placeholder.svg',
  gifts: '/products/placeholders/gift-placeholder.svg',
  'yoga-fitness': '/products/placeholders/yoga-placeholder.svg',
  'home-decor': '/products/placeholders/home-decor-placeholder.svg',
  'corporate-orders': '/products/placeholders/corporate-placeholder.svg',
  'bulk-order': '/products/placeholders/bulk-placeholder.svg',
};

const DEFAULT_IMAGE = '/products/placeholders/default-placeholder.svg';

/**
 * Returns the sanitized base URL from environment variables.
 */
export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) return '';
  return String(envUrl).trim().replace(/\/+$/, '');
}

/**
 * Builds a full API URL given an endpoint, preventing duplicate /api/v1 prefixes.
 */
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return '';

  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const baseHasApiV1 = baseUrl.endsWith('/api/v1');
  const endpointHasApiV1 = cleanEndpoint.startsWith('api/v1/');

  if (baseHasApiV1 && endpointHasApiV1) {
    return `${baseUrl}/${cleanEndpoint.slice('api/v1/'.length)}`;
  }
  if (!baseHasApiV1 && !endpointHasApiV1) {
    return `${baseUrl}/api/v1/${cleanEndpoint}`;
  }
  return `${baseUrl}/${cleanEndpoint}`;
}

/**
 * Maps a raw backend product entity to the rich frontend Product interface.
 * Preserves existing rich mockup data when matching slug or ID exists, and
 * guarantees safe fallback values for all frontend-specific properties.
 */
export function mapBackendProductToFrontend(raw: any, fallbackCatalog: Product[] = ALL_PRODUCTS): Product {
  // Check if there is an existing product in the catalog matching slug or id
  const existing = fallbackCatalog.find(
    (p) => (raw.slug && p.slug === raw.slug) || p.id === raw.id
  );

  // Extract category from backend categories relation or productType
  const primaryCat = raw.categories?.[0]?.category;
  const rawCatName = primaryCat?.name || raw.category || raw.productType?.name;
  const rawCatSlug = primaryCat?.slug || raw.categorySlug || (rawCatName ? rawCatName.toLowerCase().replace(/\s+/g, '-') : undefined);

  const categoryName = rawCatName || existing?.category || 'Canvas';
  const categorySlug = rawCatSlug || existing?.categorySlug || 'canvas';
  const subcategory = raw.subcategory || raw.categories?.[1]?.category?.name || existing?.subcategory;

  // Pricing
  const rawBasePrice = raw.basePrice ?? raw.price;
  const price = rawBasePrice !== undefined && rawBasePrice !== null && !isNaN(Number(rawBasePrice))
    ? Math.round(Number(rawBasePrice))
    : (existing?.price ?? 999);

  const rawOriginalPrice = raw.originalPrice ?? raw.compareAtPrice;
  const originalPrice = rawOriginalPrice !== undefined && rawOriginalPrice !== null && !isNaN(Number(rawOriginalPrice))
    ? Math.round(Number(rawOriginalPrice))
    : (existing?.originalPrice ?? Math.round(price * 1.33));

  const compareAtPrice = raw.compareAtPrice !== undefined && !isNaN(Number(raw.compareAtPrice))
    ? Number(raw.compareAtPrice)
    : (existing?.compareAtPrice ?? originalPrice);

  const discountPercent = raw.discountPercent !== undefined && !isNaN(Number(raw.discountPercent))
    ? Number(raw.discountPercent)
    : (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 25);

  // Extract sizes from backend options or variants if present
  let extractedSizes: string[] = [];
  if (Array.isArray(raw.options)) {
    const sizeOpt = raw.options.find(
      (o: any) => o.optionGroup?.name?.toUpperCase() === 'SIZE'
    );
    if (sizeOpt?.optionGroup?.values?.length) {
      extractedSizes = sizeOpt.optionGroup.values.map((v: any) => v.value);
    }
  }

  // Extract finishes from backend options if present
  let extractedFinishes: string[] = [];
  if (Array.isArray(raw.options)) {
    const finishOpt = raw.options.find((o: any) =>
      ['FRAME', 'FINISH', 'WRAP'].includes(o.optionGroup?.name?.toUpperCase())
    );
    if (finishOpt?.optionGroup?.values?.length) {
      extractedFinishes = finishOpt.optionGroup.values.map((v: any) => v.value);
    }
  }

  const sizes = (Array.isArray(raw.sizes) && raw.sizes.length > 0)
    ? raw.sizes
    : extractedSizes.length > 0
    ? extractedSizes
    : existing?.sizes || ['8x10 inch', '12x18 inch', '16x24 inch', '24x36 inch'];

  const finishes = (Array.isArray(raw.finishes) && raw.finishes.length > 0)
    ? raw.finishes
    : extractedFinishes.length > 0
    ? extractedFinishes
    : existing?.finishes || ['Matte Gallery Wrap', 'Satin Lustre', 'Floating Frame'];

  // Images
  const fallbackImage = DEFAULT_CATEGORY_IMAGES[categorySlug] || DEFAULT_IMAGE;
  const image = raw.image || (Array.isArray(raw.images) && raw.images[0]) || existing?.image || fallbackImage;
  const images = (Array.isArray(raw.images) && raw.images.length > 0)
    ? raw.images
    : existing?.images || [image];

  return {
    ...(existing || {}),
    id: String(raw.id),
    name: raw.name || existing?.name || 'Custom Print',
    slug: raw.slug || existing?.slug || String(raw.id),
    category: categoryName,
    categorySlug: categorySlug,
    subcategory: subcategory,
    image,
    images,
    price,
    originalPrice,
    compareAtPrice,
    discountPercent,
    rating: raw.rating !== undefined ? raw.rating : (existing?.rating ?? null),
    reviewsCount: raw.reviewsCount ?? raw.reviewCount ?? existing?.reviewsCount ?? 0,
    reviewCount: raw.reviewCount ?? raw.reviewsCount ?? existing?.reviewCount ?? 0,
    badge: raw.badge || existing?.badge || 'New',
    description: raw.description || existing?.description || 'Premium custom crafted wall art with vivid colors and archival materials.',
    shortDescription: raw.shortDescription || existing?.shortDescription || (raw.description ? raw.description.slice(0, 140) : 'Custom crafted print with premium finishes.'),
    material: raw.material || existing?.material || (categorySlug === 'acrylic' ? '5mm Ultra-Clear Cast Acrylic Glass' : '380 GSM Archival Cotton Canvas'),
    tags: Array.isArray(raw.tags) && raw.tags.length > 0 ? raw.tags : existing?.tags || [categorySlug, 'custom', 'wall art'],
    occasions: raw.occasions || existing?.occasions,
    sizes,
    availableSizes: raw.availableSizes || existing?.availableSizes || sizes,
    finishes,
    availableFinishes: raw.availableFinishes || existing?.availableFinishes || finishes,
    availableThicknesses: raw.availableThicknesses || existing?.availableThicknesses,
    availableStyles: raw.availableStyles || existing?.availableStyles,
    availableBases: raw.availableBases || existing?.availableBases,
    availablePapers: raw.availablePapers || existing?.availablePapers,
    customizable: raw.customizable ?? existing?.customizable ?? true,
    customizationAvailable: raw.customizationAvailable ?? existing?.customizationAvailable ?? true,
    uploadRequired: raw.uploadRequired ?? existing?.uploadRequired ?? true,
    features: Array.isArray(raw.features) && raw.features.length > 0 ? raw.features : existing?.features || [
      'High-definition fade-resistant pigment printing',
      'Archival-grade museum quality materials',
      'Pre-installed hanging hardware included'
    ],
    stockStatus: raw.stockStatus || (raw.status === 'ARCHIVED' ? 'Out of Stock' : 'In Stock'),
    status: raw.status || existing?.status || 'ACTIVE',
    applications: raw.applications || existing?.applications,
    createdAt: raw.createdAt || existing?.createdAt,
    isDemoData: false,
  };
}

// In-flight promise cache to prevent duplicate concurrent network requests
let inFlightProductsPromise: Promise<Product[]> | null = null;

/**
 * Fetches products from GET /api/v1/products.
 * If backend is unavailable or not configured, throws so callers can fall back.
 */
export async function fetchProductsFromApi(): Promise<Product[]> {
  const url = buildApiUrl('products');
  if (!url) {
    throw new Error('VITE_API_BASE_URL is not configured');
  }

  // Deduplicate concurrent requests
  if (inFlightProductsPromise) {
    return inFlightProductsPromise;
  }

  inFlightProductsPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      const rawList = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.products)
        ? json.products
        : [];

      return rawList.map((item: any) => mapBackendProductToFrontend(item));
    } finally {
      inFlightProductsPromise = null;
    }
  })();

  return inFlightProductsPromise;
}

/**
 * Fetches a single product from GET /api/v1/products/:id.
 */
export async function fetchProductByIdFromApi(id: string): Promise<Product | null> {
  const url = buildApiUrl(`products/${encodeURIComponent(id)}`);
  if (!url) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const raw = await response.json();
    const data = raw?.data || raw;
    if (!data || !data.id) return null;

    return mapBackendProductToFrontend(data);
  } catch (err) {
    console.warn(`[productsApi] Failed to fetch product ${id} from backend:`, err);
    return null;
  }
}
