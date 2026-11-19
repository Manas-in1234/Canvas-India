export interface TrackingEvent {
  id: string;
  status: string;
  description: string | null;
  location: string | null;
  occurredAt: string;
}

export interface ShipmentListItem {
  id: string;
  orderId: string;
  warehouseId: string;
  courierProvider: string;
  awbNumber: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  order: { id: string; orderNumber: string; shippingStatus: string; paymentStatus: string; total: string };
  _count?: { ndrCases: number };
}

export interface ShipmentAddress {
  id: string;
  type: 'SHIPPING' | 'BILLING';
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  phone: string | null;
}

export interface NdrCase {
  id: string;
  shipmentId: string;
  reason: string;
  attemptNumber: number;
  status: string;
  resolution: string | null;
  createdAt: string;
}

export interface ShipmentDetail extends Omit<ShipmentListItem, 'order'> {
  warehouse: { id: string; name: string; code: string };
  items: { id: string; orderItemId: string; quantity: number; orderItem: { productNameSnapshot: string; quantity: number } }[];
  trackingEvents: TrackingEvent[];
  ndrCases: NdrCase[];
  rtoCases: { id: string; receivedAt: string | null }[];
  order: {
    id: string;
    orderNumber: string;
    orderStatus: string;
    paymentStatus: string;
    shippingStatus: string;
    total: string;
    customer: { name: string; email: string | null; phone: string | null } | null;
    addresses: ShipmentAddress[];
    payments: { provider: string; status: string; amount: string }[];
  };
}

export interface DeliveryConfig {
  configured: boolean;
  mode: 'staging' | 'production';
  pickupLocation: string;
  pickupPincode: string;
  pickupPhone: string;
  pickupAddress: string;
  sellerName: string;
  gstConfigured: boolean;
  hsnCode: string;
  webhookConfigured: boolean;
}

export interface DeliverySummary {
  counts: Record<string, number>;
  toShip: number;
}

export interface ShipmentPreview {
  orderId: string;
  orderNumber: string;
  paymentMode: 'Prepaid' | 'COD';
  codAmount: number;
  ready: boolean;
  problems: string[];
  package: { weightGrams: number; lengthCm: number; widthCm: number; heightCm: number; basis: 'size' | 'default' };
  shippingMode: 'Surface' | 'Express';
  pickupLocation: string;
  mode: 'staging' | 'production';
  address: { name: string; line1: string; line2: string | null; city: string; state: string; postalCode: string; phone: string | null } | null;
  activeShipment: { id: string; awbNumber: string | null; status: string } | null;
}

export interface ShipmentLabel {
  awbNumber: string;
  slip: unknown;
  pickup: DeliveryConfig;
  shipment: ShipmentDetail;
}

export interface PickupRecord {
  id: string;
  createdAt: string;
  date?: string;
  time?: string;
  count?: number;
  pickupId?: string | null;
  location?: string;
}

/** Friendly wording for the shipping statuses. */
export const SHIPMENT_STATUS_LABEL: Record<string, string> = {
  NOT_SHIPPED: 'Not shipped / cancelled',
  READY: 'Booked, waiting for pickup',
  PICKED_UP: 'Picked up',
  IN_TRANSIT: 'In transit',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  NDR: 'Delivery failed: action needed',
  RTO: 'Returning to seller',
};
