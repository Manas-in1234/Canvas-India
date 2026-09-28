// Mirrors backend/src/commerce/orders — statuses are deliberately separate
// fields (scope §9), never merged into one.
export type OrderStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'PARTIALLY_REFUNDED' | 'REFUNDED';

export type ShippingStatus =
  | 'NOT_SHIPPED'
  | 'READY'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'NDR'
  | 'RTO';

export interface OrderListItem {
  id: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  subtotal: string;
  discount: string;
  tax: string;
  shipping: string;
  total: string;
  createdAt: string;
  customer: { id: string; name: string };
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string | null;
  // Immutable snapshots (scope §89/§114) — always render these, never re-fetch
  // live product/variant data for a historical order.
  productNameSnapshot: string;
  variantSnapshot: { sku: string; options: { group: string; value: string }[] };
  priceSnapshot: string;
  configurationSnapshot: Record<string, unknown> | null;
  designVersionSnapshot: Record<string, unknown> | null;
  taxSnapshot: string;
  quantity: number;
  createdAt: string;
}

export interface OrderAddress {
  id: string;
  type: 'BILLING' | 'SHIPPING';
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
}

export interface OrderEvent {
  id: string;
  type: string;
  message: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface OrderNote {
  id: string;
  note: string;
  adminUserId: string | null;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  provider: 'RAZORPAY' | 'UPI' | 'COD';
  status: PaymentStatus;
  amount: string;
  currency: string;
  providerRef: string | null;
  transactions: PaymentTransaction[];
}

export interface OrderCustomerDetail {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

// findOne includes the full customer record, unlike the list endpoint's
// {id, name} projection — so this intentionally does not extend OrderListItem.
export interface OrderDetail
  extends Omit<OrderListItem, 'customer'> {
  customer: OrderCustomerDetail;
  items: OrderItem[];
  addresses: OrderAddress[];
  events: OrderEvent[];
  notes: OrderNote[];
  payments: Payment[];
}
