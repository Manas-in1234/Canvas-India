import { Injectable, NotImplementedException } from '@nestjs/common';
import type {
  CourierProviderAdapter,
  CreateShipmentResult,
  ShippingRate,
  TrackingResult,
} from './courier-provider.interface.js';

/**
 * Stub courier adapter.
 *
 * A real courier account/provider has not been provisioned yet, so these
 * operations intentionally fail rather than silently pretending that a
 * shipment was created or tracked.
 */
@Injectable()
export class StubCourierAdapter implements CourierProviderAdapter {
  createShipment(
    _orderId: string,
    _warehouseId: string,
    _items: Array<{ orderItemId: string; quantity: number }>,
  ): Promise<CreateShipmentResult> {
    throw new NotImplementedException(
      'Courier integration is not yet configured; provision a real courier account before creating shipments',
    );
  }

  getRates(
    _originPostalCode: string,
    _destinationPostalCode: string,
    _weight?: number,
  ): Promise<ShippingRate[]> {
    throw new NotImplementedException(
      'Courier integration is not yet configured; provision a real courier account before requesting rates',
    );
  }

  trackShipment(_awbNumber: string): Promise<TrackingResult> {
    throw new NotImplementedException(
      'Courier integration is not yet configured; provision a real courier account before tracking shipments',
    );
  }

  cancelShipment(_awbNumber: string): Promise<void> {
    throw new NotImplementedException(
      'Courier integration is not yet configured; provision a real courier account before cancelling shipments',
    );
  }
}
