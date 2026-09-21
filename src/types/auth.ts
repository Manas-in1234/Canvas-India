export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export type AddressType = 'home' | 'work' | 'other';

export interface Address {
  id?: string;
  user_id?: string;
  name: string;
  phone: string;
  street_address: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: AddressType;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CustomizationDetails {
  productType?: string;
  shape?: string;
  shapeName?: string;
  dimensions?: string;
  widthInches?: number;
  heightInches?: number;
  aspectRatio?: string;
  layout?: string;
  layoutName?: string;
  design?: string;
  designName?: string;
  hardware?: string;
  hardwareName?: string;
  edgeWrap?: string;
  edgeWrapName?: string;
  frame?: string;
  frameName?: string;
  paper?: string;
  paperName?: string;
  textElements?: Array<{
    id?: string;
    text: string;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    alignment?: string;
    isBold?: boolean;
    isItalic?: boolean;
  }>;
  clipartElements?: Array<{
    id?: string;
    url: string;
    label?: string;
  }>;
  [key: string]: any;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
  customization_details?: CustomizationDetails;
  created_at?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  shipping_address: Address;
  shipping_method: 'standard' | 'express';
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  payment?: PaymentRecord;
}

export type PaymentStatus = 'pending' | 'captured' | 'failed' | 'refunded';

export interface PaymentRecord {
  id?: string;
  order_id: string;
  user_id?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_method?: string;
  error_message?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayErrorResponse {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id: string;
    payment_id: string;
  };
}
