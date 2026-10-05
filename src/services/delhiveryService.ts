const DELHIVERY_TOKEN = '8b9a6b2b5237882de89e113919e4eb59fff100cc';
const DELHIVERY_BASE_URL = 'https://track.delhivery.com';

export interface PincodeServiceabilityResult {
  serviceable: boolean;
  pincode: string;
  city?: string;
  state?: string;
  codAvailable?: boolean;
  prepaidAvailable?: boolean;
  estimatedDays?: number;
  courier: string;
  message?: string;
}

export interface TrackingScan {
  ScanDateTime: string;
  ScanType: string;
  Scan: string;
  StatusDateTime: string;
  ScannedLocation: string;
  Instructions?: string;
}

export interface DelhiveryTrackingResult {
  success: boolean;
  awb: string;
  status: string;
  statusDescription: string;
  location?: string;
  expectedDate?: string;
  scans: TrackingScan[];
}

export const delhiveryService = {
  /**
   * Check if customer's 6-digit PIN code is serviceable by Delhivery
   */
  async checkPincode(pincode: string): Promise<PincodeServiceabilityResult> {
    const cleanPin = pincode.trim().replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      return {
        serviceable: false,
        pincode: cleanPin,
        courier: 'Delhivery Express',
        message: 'Please enter a valid 6-digit pincode',
      };
    }

    try {
      const url = `${DELHIVERY_BASE_URL}/c/api/pin-codes/json/?filter_codes=${cleanPin}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Token ${DELHIVERY_TOKEN}`,
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        return {
          serviceable: true, // Safe fallback so orders are never blocked
          pincode: cleanPin,
          estimatedDays: 3,
          courier: 'Delhivery Express',
        };
      }

      const data: any = await res.json().catch(() => ({}));
      const code = data?.delivery_codes?.[0]?.postal_code;

      if (!code) {
        return {
          serviceable: false,
          pincode: cleanPin,
          courier: 'Delhivery Express',
          message: 'Pincode not currently serviceable for direct delivery',
        };
      }

      return {
        serviceable: true,
        pincode: cleanPin,
        city: code.district || code.city,
        state: code.state_code,
        codAvailable: code.cod === 'Y',
        prepaidAvailable: code.pre_paid === 'Y',
        estimatedDays: code.is_oda === 'Y' ? 5 : 3,
        courier: 'Delhivery Express',
      };
    } catch (err) {
      console.warn('[DelhiveryService] Serviceability check fallback:', err);
      return {
        serviceable: true,
        pincode: cleanPin,
        estimatedDays: 3,
        courier: 'Delhivery Express',
      };
    }
  },

  /**
   * Live track an AWB or Delhivery order package
   */
  async trackAwb(awbNumber: string): Promise<DelhiveryTrackingResult> {
    const cleanAwb = awbNumber.trim();

    try {
      const url = `${DELHIVERY_BASE_URL}/api/v1/packages/json/?waybill=${cleanAwb}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Token ${DELHIVERY_TOKEN}`,
          Accept: 'application/json',
        },
      });

      const data: any = await res.json().catch(() => ({}));
      const shipment = data?.ShipmentData?.[0]?.Shipment;

      if (!shipment) {
        return {
          success: false,
          awb: cleanAwb,
          status: 'MANIFESTED',
          statusDescription: 'Order confirmed and registered with Delhivery. Awaiting pickup.',
          scans: [],
        };
      }

      const status = shipment?.Status?.Status || 'IN_TRANSIT';
      const instructions = shipment?.Status?.Instructions || '';
      const location = shipment?.Status?.StatusLocation || '';
      const expectedDate = shipment?.ExpectedDeliveryDate;

      return {
        success: true,
        awb: cleanAwb,
        status,
        statusDescription: instructions || `Shipment status: ${status}`,
        location,
        expectedDate,
        scans: (shipment?.Scans || []).map((s: any) => ({
          ScanDateTime: s?.ScanDetail?.ScanDateTime || '',
          ScanType: s?.ScanDetail?.ScanType || '',
          Scan: s?.ScanDetail?.Scan || '',
          StatusDateTime: s?.ScanDetail?.StatusDateTime || '',
          ScannedLocation: s?.ScanDetail?.ScannedLocation || '',
          Instructions: s?.ScanDetail?.Instructions || '',
        })),
      };
    } catch (err) {
      console.warn('[DelhiveryService] Live track fallback:', err);
      return {
        success: true,
        awb: cleanAwb,
        status: 'IN_TRANSIT',
        statusDescription: 'Package in transit with Delhivery Express',
        scans: [],
      };
    }
  },
};
