import { buildApiUrl } from './productsApi';

export interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customerName: string;
}

export interface ProductReviews {
  count: number;
  average: number;
  reviews: ProductReview[];
}

const emptyReviews: ProductReviews = { count: 0, average: 0, reviews: [] };

/** Public: approved reviews for a product, shown on its product page. Never blocks the page. */
export async function getProductReviews(productSlug: string): Promise<ProductReviews> {
  if (!productSlug) return emptyReviews;
  try {
    const res = await fetch(buildApiUrl(`products/${encodeURIComponent(productSlug)}/reviews`));
    if (!res.ok) return emptyReviews;
    return res.json();
  } catch {
    return emptyReviews;
  }
}

export interface ReviewableItem {
  orderItemId: string;
  productName: string;
  productSlug: string;
  imageUrl: string | null;
  purchasedAt: string;
}

export interface ReviewEligibility {
  found: boolean;
  delivered?: boolean;
  items?: ReviewableItem[];
}

/** What on this order can be reviewed right now. Same order-number + email proof as returns/order status. */
export async function getReviewEligibility(orderNumber: string, email: string): Promise<ReviewEligibility> {
  const res = await fetch(buildApiUrl('storefront/reviews/eligible'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderNumber, email }),
  });
  if (!res.ok) {
    if (res.status === 404) return { found: false };
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Could not look up that order.');
  }
  const data = await res.json();
  return { found: true, delivered: data.delivered, items: data.items };
}

export async function submitReview(
  orderNumber: string,
  email: string,
  orderItemId: string,
  rating: number,
  comment: string,
): Promise<void> {
  const res = await fetch(buildApiUrl('storefront/reviews'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderNumber, email, orderItemId, rating, comment }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Could not submit your review.');
  }
}
