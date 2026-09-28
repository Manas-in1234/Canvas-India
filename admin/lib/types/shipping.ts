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
  order: { id: string; orderNumber: string; shippingStatus: string };
}

export interface ShipmentDetail extends ShipmentListItem {
  warehouse: { id: string; name: string; code: string };
  items: { id: string; orderItemId: string; quantity: number }[];
  trackingEvents: TrackingEvent[];
}

export interface NdrCase {
  id: string;
  shipmentId: string;
  reason: string;
  attemptNumber: number;
  status: string;
  resolution: string | null;
  createdAt: string;
  shipment: {
    id: string;
    awbNumber: string | null;
    courierProvider: string;
    order: { id: string; orderNumber: string };
  };
}
