import { CartItem } from '../types';
import { buildApiUrl } from './productsApi';

const CUSTOMER_TOKEN_KEY = 'ci_customer_token';

export interface StorefrontAddress {
  type: 'BILLING' | 'SHIPPING';
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  phone?: string;
}

export interface CheckoutResult {
  id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  total: string;
}

export class StorefrontApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'StorefrontApiError';
  }
}

function getStoredToken(): string | null {
  try {
    return localStorage.getItem(CUSTOMER_TOKEN_KEY);
  } catch {
    return null;
  }
}

function storeToken(token: string) {
  try {
    localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  } catch {
    // ignore — checkout will just fail to resume across reloads
  }
}

async function request<T>(path: string, options: RequestInit = {}, requiresToken = true): Promise<T> {
  const url = buildApiUrl(`storefront/${path}`);
  if (!url) {
    throw new StorefrontApiError('VITE_API_BASE_URL is not configured');
  }

  const token = getStoredToken();
  if (requiresToken && !token) {
    throw new StorefrontApiError('No customer session — call ensureSession() first');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'X-Customer-Token': token } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new StorefrontApiError(data?.message || `Request failed: ${response.status}`, response.status);
  }

  return data as T;
}

/**
 * Ensures a guest customer session exists, creating one via
 * POST /storefront/session if no token is stored yet. This is the only
 * "login" a shopper needs — no password, just an opaque token persisted in
 * localStorage (mirrors how the cart itself is already stored client-side).
 */
export async function ensureSession(name: string, email?: string, phone?: string): Promise<string> {
  const existing = getStoredToken();
  if (existing) return existing;

  const url = buildApiUrl('storefront/session');
  if (!url) {
    throw new StorefrontApiError('VITE_API_BASE_URL is not configured');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new StorefrontApiError(data?.message || 'Failed to create checkout session', response.status);
  }

  storeToken(data.customerToken);
  return data.customerToken;
}

/**
 * Resolves each local cart item (product + size string) to a real backend
 * variant ID by matching the size label against that product's variants.
 * The local cart never stores variant IDs directly (it predates the backend
 * integration), so this lookup happens once, at checkout time.
 */
async function resolveVariantId(productId: string, size?: string): Promise<string | null> {
  const url = buildApiUrl(`products/${encodeURIComponent(productId)}/variants`);
  if (!url) return null;

  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) return null;

  const variants: Array<{
    id: string;
    options: Array<{ optionValue: { value: string; optionGroup: { name: string } } }>;
  }> = await response.json();

  if (variants.length === 0) return null;

  if (size) {
    const bySize = variants.find((v) =>
      v.options.some(
        (o) => o.optionValue.optionGroup.name.toUpperCase() === 'SIZE' && o.optionValue.value === size,
      ),
    );
    if (bySize) return bySize.id;
  }

  // Fall back to the first available variant rather than failing checkout
  // outright over a size-label mismatch between local and backend data.
  return variants[0].id;
}

export interface CheckoutFailure {
  item: CartItem;
  reason: string;
}

/**
 * Places a real order against the backend for the given local cart items.
 * Returns both the created order and any items that couldn't be resolved to
 * a real backend variant (e.g. a purely local/demo product never synced to
 * the backend) — callers should surface those to the customer rather than
 * silently dropping them.
 */
export async function checkout(
  cartItems: CartItem[],
  customer: { name: string; email?: string; phone?: string },
  shippingAddress: StorefrontAddress,
  billingAddress?: StorefrontAddress,
): Promise<{ order: CheckoutResult | null; failures: CheckoutFailure[] }> {
  await ensureSession(customer.name, customer.email, customer.phone);

  const failures: CheckoutFailure[] = [];

  for (const item of cartItems) {
    const variantId = await resolveVariantId(item.product.id, item.size);
    if (!variantId) {
      failures.push({ item, reason: 'Product is not available for checkout yet' });
      continue;
    }

    try {
      await request('cart/items', {
        method: 'POST',
        body: JSON.stringify({ variantId, quantity: item.quantity }),
      });
    } catch (err) {
      failures.push({
        item,
        reason: err instanceof StorefrontApiError ? err.message : 'Failed to add item to checkout',
      });
    }
  }

  if (failures.length === cartItems.length) {
    // Nothing could be added — don't attempt checkout on an empty cart.
    return { order: null, failures };
  }

  const addresses = billingAddress ? [shippingAddress, billingAddress] : [shippingAddress];
  const order = await request<CheckoutResult>('checkout', {
    method: 'POST',
    body: JSON.stringify({ addresses }),
  });

  return { order, failures };
}
