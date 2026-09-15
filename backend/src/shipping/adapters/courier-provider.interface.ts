export interface CreateShipmentResult {
  providerShipmentId: string;
  awbNumber?: string;
}

export interface ShippingRate {
  courierProvider: string;
  amount: number;
  currency: string;
  estimatedDays?: number;
}

export interface TrackingResult {
  status: string;
  description?: string;
  location?: string;
}

export interface CourierProviderAdapter {
  createShipment(
    orderId: string,
    warehouseId: string,
    items: Array<{ orderItemId: string; quantity: number }>,
  ): Promise<CreateShipmentResult>;

  getRates(
    originPostalCode: string,
    destinationPostalCode: string,
    weight?: number,
  ): Promise<ShippingRate[]>;

  trackShipment(awbNumber: string): Promise<TrackingResult>;

  cancelShipment(awbNumber: string): Promise<void>;
}
