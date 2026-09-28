export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Discount {
  id: string;
  code: string;
  description: string | null;
  discountType: DiscountType;
  value: string;
  maxDiscountAmount: string | null;
  minOrderSubtotal: string | null;
  usageLimit: number | null;
  usageCount: number;
  perCustomerLimit: number | null;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  isExclusive: boolean;
  createdAt: string;
}

export interface CreateDiscountInput {
  code: string;
  description?: string;
  discountType: DiscountType;
  value: number;
  maxDiscountAmount?: number;
  minOrderSubtotal?: number;
  usageLimit?: number;
  perCustomerLimit?: number;
  startsAt?: string;
  expiresAt?: string;
  isActive?: boolean;
}

export type CampaignType = 'SEASONAL' | 'PRODUCT_LAUNCH' | 'ABANDONED_CART' | 'RETENTION' | 'SPECIAL_PROMO';
export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface Campaign {
  id: string;
  name: string;
  code: string;
  description: string | null;
  type: CampaignType;
  status: CampaignStatus;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
}

export interface CreateCampaignInput {
  name: string;
  code: string;
  description?: string;
  type: CampaignType;
  startsAt: string;
  endsAt?: string;
}

export interface AbandonedCart {
  id: string;
  cartId: string;
  customerId: string | null;
  status: string;
  reminderCount: number;
  lastNotificationSentAt: string | null;
  recoveredAt: string | null;
  createdAt: string;
}
