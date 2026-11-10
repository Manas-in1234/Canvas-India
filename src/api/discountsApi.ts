import { buildApiUrl } from './productsApi';

export interface ValidateDiscountResult {
  isValid: boolean;
  discountId: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: string;
  discountAmount: string;
  eligibleSubtotal: string;
  isExclusive: boolean;
  message?: string;
}

export class DiscountValidationError extends Error {}

/**
 * Validates a coupon code against the real admin-managed Discount records
 * (see admin Discounts screen) — replaces the old hardcoded CANVAS10/
 * FIRSTPRINT check. Guest checkout is supported; customerId is optional and
 * only required for discounts restricted to a customer segment.
 *
 * Throws DiscountValidationError with the backend's real message (expired,
 * inactive, below minimum subtotal, usage limit reached, etc.) on failure —
 * callers should show err.message directly rather than a generic string.
 */
export async function validateDiscountCode(
  code: string,
  subtotal: number,
  customerId?: string,
): Promise<ValidateDiscountResult> {
  const response = await fetch(buildApiUrl('/discounts/validate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, subtotal, customerId }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new DiscountValidationError(data?.message || 'Invalid coupon code.');
  }

  return data as ValidateDiscountResult;
}
