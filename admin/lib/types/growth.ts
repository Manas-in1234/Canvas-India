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

export type PromotionType = 'AUTOMATIC_DISCOUNT' | 'BUY_X_GET_Y' | 'TIERED_DISCOUNT' | 'FREE_SHIPPING';

export interface Promotion {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  promotionType: PromotionType;
  discountType: DiscountType;
  value: string;
  isActive: boolean;
  isStackable: boolean;
  startsAt: string;
  endsAt: string;
  priority: number;
}

export interface CreatePromotionInput {
  name: string;
  slug: string;
  description?: string;
  promotionType?: PromotionType;
  discountType: DiscountType;
  value: number;
  startsAt: string;
  endsAt: string;
  isActive?: boolean;
}

export type SegmentType = 'MANUAL' | 'DYNAMIC';

export interface CustomerSegment {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: SegmentType;
  isActive: boolean;
  createdAt: string;
}

export interface SegmentMember {
  customer: { id: string; name: string; email: string | null; phone: string | null; isGuest: boolean };
}

export interface CustomerSegmentDetail extends CustomerSegment {
  members: SegmentMember[];
}

export interface CreateSegmentInput {
  name: string;
  slug: string;
  description?: string;
  type?: SegmentType;
  isActive?: boolean;
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
