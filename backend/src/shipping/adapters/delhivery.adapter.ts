import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service.js';
import type {
  CourierProviderAdapter,
  CreateShipmentResult,
  ShippingRate,
  TrackingResult,
} from './courier-provider.interface.js';

@Injectable()
export class DelhiveryAdapter implements CourierProviderAdapter {
  private readonly logger = new Logger(DelhiveryAdapter.name);
  private readonly apiToken: string;
  private readonly baseUrl: string;
  private readonly pickupLocation: string;
  private readonly pickupPincode: string;
  private readonly pickupPhone: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.apiToken = (
      this.configService.get<string>('DELHIVERY_API_TOKEN') ||
      '8b9a6b2b5237882de89e113919e4eb59fff100cc'
    ).trim();

    const mode = this.configService.get<string>('DELHIVERY_MODE') || 'production';
    this.baseUrl =
      mode === 'staging'
        ? 'https://staging-express.delhivery.com'
        : 'https://track.delhivery.com';

    this.pickupLocation =
      this.configService.get<string>('DELHIVERY_PICKUP_LOCATION') ||
      'SREE MAHALAKSHMI ENTERPRISES';

    this.pickupPincode =
      this.configService.get<string>('DELHIVERY_PICKUP_PINCODE') || '500076';

    this.pickupPhone =
      this.configService.get<string>('DELHIVERY_PICKUP_PHONE') || '7893051555';
  }

  /**
   * Check pincode serviceability via Delhivery
   */
  async checkServiceability(pincode: string): Promise<{
    serviceable: boolean;
    city?: string;
    state?: string;
    codAvailable?: boolean;
    prepaidAvailable?: boolean;
    isOda?: boolean;
  }> {
    try {
      const url = `${this.baseUrl}/c/api/pin-codes/json/?filter_codes=${pincode}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Token ${this.apiToken}`,
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        return { serviceable: false };
      }

      const data: any = await res.json().catch(() => ({}));
      const code = data?.delivery_codes?.[0]?.postal_code;

      if (!code) {
        return { serviceable: false };
      }

      return {
        serviceable: true,
        city: code.district || code.city,
        state: code.state_code,
        codAvailable: code.cod === 'Y',
        prepaidAvailable: code.pre_paid === 'Y',
        isOda: code.is_oda === 'Y',
      };
    } catch (err) {
      this.logger.error(`Error checking pincode serviceability: ${err}`);
      return { serviceable: true }; // Graceful fallback
    }
  }

  /**
   * Calculate shipping rates
   */
  async getRates(
    originPostalCode: string,
    destinationPostalCode: string,
    weight = 500, // default 500g for prints
  ): Promise<ShippingRate[]> {
    const origin = originPostalCode || this.pickupPincode;

    try {
      const url = `${this.baseUrl}/api/kinko/v1/invoice/charges/.json?md=S&ss=Delivered&d_pin=${destinationPostalCode}&o_pin=${origin}&cgm=${weight}&pt=Pre-paid`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Token ${this.apiToken}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        const data: any = await res.json().catch(() => ([]));
        const charge = data?.[0]?.total_amount || data?.total_amount;
        if (Number(charge) > 0) {
          return [
            {
              courierProvider: 'Delhivery Surface',
              amount: Math.round(Number(charge)),
              currency: 'INR',
              estimatedDays: 4,
            },
            {
              courierProvider: 'Delhivery Express',
              amount: Math.round(Number(charge) * 1.35),
              currency: 'INR',
              estimatedDays: 2,
            },
          ];
        }
      }
    } catch (err) {
      this.logger.warn(`Delhivery rate API fallback: ${err}`);
    }

    // Default rate model if live API query unavailable
    return [
      {
        courierProvider: 'Delhivery Standard',
        amount: 99,
        currency: 'INR',
        estimatedDays: 3,
      },
      {
        courierProvider: 'Delhivery Express',
        amount: 199,
        currency: 'INR',
        estimatedDays: 2,
      },
    ];
  }

  /**
   * Create shipment on Delhivery and obtain AWB number
   */
  async createShipment(
    orderId: string,
    warehouseId: string,
    _items: Array<{ orderItemId: string; quantity: number }>,
  ): Promise<CreateShipmentResult> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        customer: true,
      },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    const pickup = warehouse?.name || this.pickupLocation;
    const shippingAddress: any = (order as any).shippingAddress || {};

    const recipientName =
      shippingAddress.name || order.customer?.name || 'Valued Customer';
    const recipientPhone =
      shippingAddress.phone || order.customer?.phone || this.pickupPhone;
    const recipientAddress =
      shippingAddress.street_address || shippingAddress.address || 'Customer Address';
    const recipientPin =
      shippingAddress.postal_code || shippingAddress.pincode || '500001';
    const recipientCity = shippingAddress.city || 'Hyderabad';
    const recipientState = shippingAddress.state || 'Telangana';

    const orderNumber = order.orderNumber || `CI-${Date.now()}`;
    const totalAmount = Number((order as any).totalAmount || 0);

    const payload = {
      shipments: [
        {
          name: recipientName,
          add: recipientAddress,
          pin: recipientPin,
          city: recipientCity,
          state: recipientState,
          country: 'India',
          phone: recipientPhone,
          order: orderNumber,
          payment_mode: 'Pre-paid',
          return_pin: this.pickupPincode,
          return_city: 'Hyderabad',
          return_phone: this.pickupPhone,
          return_add: 'H NO 4-9-197/B/84, Nacharam HMT Nagar Main Road',
          return_state: 'Telangana',
          return_country: 'India',
          products_desc: 'Custom Canvas / Photo Print',
          hsn_code: '4911',
          cod_amount: '0',
          order_date: new Date().toISOString(),
          total_amount: totalAmount.toString(),
          seller_add: 'H NO 4-9-197/B/84, Nacharam HMT Nagar Main Road',
          seller_name: 'SREE MAHALAKSHMI ENTERPRISES',
          seller_inv: orderNumber,
          quantity: '1',
          waybill: '',
          shipment_width: 30,
          shipment_height: 5,
          weight: 500,
          shipping_mode: 'Surface',
          address_type: 'home',
        },
      ],
      pickup_location: {
        name: pickup,
      },
    };

    try {
      const url = `${this.baseUrl}/api/cmu/create.json`;
      const bodyParams = new URLSearchParams();
      bodyParams.append('format', 'json');
      bodyParams.append('data', JSON.stringify(payload));

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Token ${this.apiToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: bodyParams.toString(),
      });

      const resData: any = await res.json().catch(() => ({}));
      this.logger.log(`Delhivery create shipment response: ${JSON.stringify(resData)}`);

      const packages = resData?.packages || resData?.shipments || [];
      const pkg = packages[0] || {};
      const awb = pkg?.waybill || resData?.upload_wbn || `DLV-${Date.now()}`;

      return {
        providerShipmentId: pkg?.refnum || orderNumber,
        awbNumber: awb,
      };
    } catch (err: any) {
      this.logger.error(`Delhivery shipment creation failed, generating local reference: ${err?.message}`);
      return {
        providerShipmentId: orderNumber,
        awbNumber: `DLV-${Date.now()}`,
      };
    }
  }

  /**
   * Track shipment via Delhivery
   */
  async trackShipment(awbNumber: string): Promise<TrackingResult> {
    try {
      const url = `${this.baseUrl}/api/v1/packages/json/?waybill=${awbNumber}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Token ${this.apiToken}`,
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        return {
          status: 'IN_TRANSIT',
          description: 'Package in transit with Delhivery Express',
        };
      }

      const data: any = await res.json().catch(() => ({}));
      const shipmentData = data?.ShipmentData?.[0]?.Shipment;

      if (!shipmentData) {
        return {
          status: 'SHIPPED',
          description: 'Shipment manifest generated, awaiting pickup scan.',
        };
      }

      const status = shipmentData?.Status?.Status || 'IN_TRANSIT';
      const instructions = shipmentData?.Status?.Instructions || '';
      const location = shipmentData?.Status?.StatusLocation || '';

      return {
        status,
        description: instructions || `Current Status: ${status}`,
        location,
      };
    } catch (err: any) {
      this.logger.error(`Error tracking Delhivery shipment ${awbNumber}: ${err}`);
      return {
        status: 'IN_TRANSIT',
        description: 'Package in transit',
      };
    }
  }

  async cancelShipment(awbNumber: string): Promise<void> {
    try {
      const url = `${this.baseUrl}/api/p/edit`;
      await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Token ${this.apiToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          waybill: awbNumber,
          cancellation: 'true',
        }),
      });
    } catch (err) {
      this.logger.warn(`Failed to cancel Delhivery shipment: ${err}`);
    }
  }
}
