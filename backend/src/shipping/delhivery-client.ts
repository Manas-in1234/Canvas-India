/**
 * Delhivery (B2C Express) client for the Cloudflare Worker.
 *
 * Written against Delhivery's official API reference (delhivery-express-api-doc.readme.io):
 *  - staging host  https://staging-express.delhivery.com, production host https://track.delhivery.com
 *  - auth header   Authorization: Token <token>   (static per environment)
 *  - create        POST /api/cmu/create.json      body: format=json&data=<json>
 *  - tracking      GET  /api/v1/packages/json/    (up to 30 AWBs per call)
 *  - cancel        POST /api/p/edit               {"waybill":..,"cancellation":"true"}
 *  - packing slip  GET  /api/p/packing_slip?wbns=
 *  - pickup        POST /fm/request/new/
 *  - NDR action    POST /api/p/update             act = RE-ATTEMPT | DEFER_DLV | EDIT_DETAILS
 *
 * Unlike the earlier NestJS adapter, nothing here ever invents a tracking number: if Delhivery
 * rejects or does not answer, the call throws and the caller must not record a shipment.
 */

export type ShippingStatusName =
  | 'NOT_SHIPPED'
  | 'READY'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'NDR'
  | 'RTO';

export interface DelhiveryEnv {
  DELHIVERY_API_TOKEN?: string;
  DELHIVERY_MODE?: string;
  DELHIVERY_PICKUP_LOCATION?: string;
  DELHIVERY_PICKUP_PINCODE?: string;
  DELHIVERY_PICKUP_PHONE?: string;
  DELHIVERY_PICKUP_ADDRESS?: string;
  DELHIVERY_PICKUP_CITY?: string;
  DELHIVERY_PICKUP_STATE?: string;
  DELHIVERY_SELLER_NAME?: string;
  DELHIVERY_SELLER_GST?: string;
  DELHIVERY_HSN_CODE?: string;
  DELHIVERY_WEBHOOK_SECRET?: string;
  DELIVERY_GRAMS_PER_SQ_IN_CANVAS?: string;
  DELIVERY_GRAMS_PER_SQ_IN_ACRYLIC?: string;
}

export interface DelhiveryConfig {
  mode: 'staging' | 'production';
  baseUrl: string;
  token: string;
  pickup: { name: string; pin: string; phone: string; address: string; city: string; state: string };
  seller: { name: string; address: string; gst: string };
  hsn: string;
}

export function loadDelhiveryConfig(env: DelhiveryEnv): DelhiveryConfig {
  const mode = (env.DELHIVERY_MODE || 'production').trim().toLowerCase() === 'staging' ? 'staging' : 'production';
  const address = env.DELHIVERY_PICKUP_ADDRESS?.trim() || 'H NO 4-9-197/B/84, Nacharam HMT Nagar Main Road';
  return {
    mode,
    baseUrl: mode === 'staging' ? 'https://staging-express.delhivery.com' : 'https://track.delhivery.com',
    token: (env.DELHIVERY_API_TOKEN || '').trim(),
    pickup: {
      name: env.DELHIVERY_PICKUP_LOCATION?.trim() || 'SREE MAHALAKSHMI ENTERPRISES',
      pin: env.DELHIVERY_PICKUP_PINCODE?.trim() || '500076',
      phone: env.DELHIVERY_PICKUP_PHONE?.trim() || '7893051555',
      address,
      city: env.DELHIVERY_PICKUP_CITY?.trim() || 'Hyderabad',
      state: env.DELHIVERY_PICKUP_STATE?.trim() || 'Telangana',
    },
    seller: {
      name: env.DELHIVERY_SELLER_NAME?.trim() || 'SREE MAHALAKSHMI ENTERPRISES',
      address,
      gst: env.DELHIVERY_SELLER_GST?.trim() || '',
    },
    hsn: env.DELHIVERY_HSN_CODE?.trim() || '4911',
  };
}

export class DelhiveryError extends Error {
  /** Same value as httpStatus: the Worker's error handler reads .status. */
  readonly status: number;
  constructor(
    message: string,
    /** HTTP status to surface to the admin: 422 = Delhivery rejected the data, 502 = Delhivery unreachable or broken. */
    public readonly httpStatus: 422 | 502 | 503 = 502,
    public readonly detail?: unknown,
  ) {
    super(message);
    this.name = 'DelhiveryError';
    this.status = httpStatus;
  }
}

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

// ---------------------------------------------------------------------------------------------
// Input cleaning. Delhivery rejects & # % ; \ in the payload, and phone/pin must be clean digits.
// ---------------------------------------------------------------------------------------------
export function cleanText(value: unknown, max = 250): string {
  return String(value ?? '')
    .replace(/[&#%;\\]/g, ' ')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function cleanPhone(value: unknown): string | null {
  const digits = String(value ?? '').replace(/\D/g, '');
  const ten = digits.length > 10 ? digits.slice(-10) : digits;
  return /^[6-9]\d{9}$/.test(ten) ? ten : null;
}

export function cleanPin(value: unknown): string | null {
  const pin = String(value ?? '').replace(/\s/g, '');
  return /^[1-9]\d{5}$/.test(pin) ? pin : null;
}

// ---------------------------------------------------------------------------------------------
// Package estimate. Canvas and acrylic prints are made to order, so weight and box size are
// derived from the print size on each order item. The admin can override before booking.
// ---------------------------------------------------------------------------------------------
export interface PackageEstimate {
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  basis: 'size' | 'default';
}

export function parsePrintSize(config: any): { w: number; h: number } | null {
  const text = [config?.size, config?.dimensions, config?.sizeLabel, config?.dimensionsSummary]
    .filter((v) => typeof v === 'string')
    .join(' ');
  const m = /(\d+(?:\.\d+)?)\s*(?:"|in|inch|inches)?\s*(?:x|×|\*|by)\s*(\d+(?:\.\d+)?)/i.exec(text);
  if (!m) return null;
  const w = Number(m[1]);
  const h = Number(m[2]);
  return w > 0 && h > 0 && w <= 120 && h <= 120 ? { w, h } : null;
}

export function estimatePackage(
  items: Array<{ quantity: number; config?: any; name?: string }>,
  env: Pick<DelhiveryEnv, 'DELIVERY_GRAMS_PER_SQ_IN_CANVAS' | 'DELIVERY_GRAMS_PER_SQ_IN_ACRYLIC'> = {},
): PackageEstimate {
  const canvasRate = Number(env.DELIVERY_GRAMS_PER_SQ_IN_CANVAS) > 0 ? Number(env.DELIVERY_GRAMS_PER_SQ_IN_CANVAS) : 2.2;
  const acrylicRate = Number(env.DELIVERY_GRAMS_PER_SQ_IN_ACRYLIC) > 0 ? Number(env.DELIVERY_GRAMS_PER_SQ_IN_ACRYLIC) : 3.2;
  let weight = 0;
  let maxW = 0;
  let maxH = 0;
  let depth = 0;
  let sized = false;
  for (const item of items) {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const size = parsePrintSize(item.config);
    const isAcrylic = /acrylic/i.test(`${item.name ?? ''} ${item.config?.material ?? ''} ${item.config?.type ?? ''}`);
    const w = size?.w ?? 12;
    const h = size?.h ?? 12;
    if (size) sized = true;
    const area = w * h;
    // Print weight + protective packing (corner guards, bubble wrap, carton) per piece.
    weight += qty * (area * (isAcrylic ? acrylicRate : canvasRate) + 220);
    maxW = Math.max(maxW, w);
    maxH = Math.max(maxH, h);
    depth += 5 + (qty - 1) * 4;
  }
  const toCm = (inches: number) => Math.ceil(inches * 2.54 + 4);
  return {
    weightGrams: Math.max(300, Math.round(weight / 10) * 10),
    lengthCm: toCm(Math.max(maxW, maxH)),
    widthCm: toCm(Math.min(maxW, maxH) || maxW),
    heightCm: Math.max(4, Math.ceil(depth)),
    basis: sized ? 'size' : 'default',
  };
}

// ---------------------------------------------------------------------------------------------
// Status mapping (Delhivery Status / StatusType -> our ShippingStatus)
// ---------------------------------------------------------------------------------------------
export interface MappedStatus {
  status: ShippingStatusName | null;
  /** The courier cancelled the shipment (StatusType CN). */
  cancelled: boolean;
  /** The courier reports a failed delivery attempt that needs action. */
  isNdr: boolean;
}

const NDR_TEXT = /(attempt|undeliver|not available|unavailable|refus|incomplete address|wrong address|address (?:issue|not)|customer (?:not|request)|reschedul|door (?:is )?lock|no response|not reachable|consignee)/i;

export function mapDelhiveryStatus(
  statusType: unknown,
  status: unknown,
  instructions?: unknown,
  statusCode?: unknown,
): MappedStatus {
  const ty = String(statusType ?? '').trim().toUpperCase();
  const st = String(status ?? '').trim().toLowerCase();
  const text = String(instructions ?? '');
  const code = String(statusCode ?? '').toUpperCase();
  const none: MappedStatus = { status: null, cancelled: false, isNdr: false };

  if (ty === 'CN' || st === 'canceled' || st === 'cancelled') return { status: null, cancelled: true, isNdr: false };
  if (ty === 'DL') {
    if (st.includes('rto') || st.includes('dto')) return { status: 'RTO', cancelled: false, isNdr: false };
    return { status: 'DELIVERED', cancelled: false, isNdr: false };
  }
  if (ty === 'RT') return { status: 'RTO', cancelled: false, isNdr: false };
  if (st === 'delivered') return { status: 'DELIVERED', cancelled: false, isNdr: false };
  if (st.includes('rto') || st.includes('return')) return { status: 'RTO', cancelled: false, isNdr: false };

  if (st === 'manifested' || st === 'not picked' || st === 'open' || st === 'scheduled') {
    return { status: 'READY', cancelled: false, isNdr: false };
  }
  if (st === 'in transit') {
    return { status: /picked up|pickup done|pick-?up complete/i.test(text) ? 'PICKED_UP' : 'IN_TRANSIT', cancelled: false, isNdr: false };
  }
  if (st === 'dispatched') return { status: 'OUT_FOR_DELIVERY', cancelled: false, isNdr: false };
  if (st === 'pending') {
    const ndr = code.startsWith('EOD-') || code === 'ST-108' || NDR_TEXT.test(text);
    return { status: ndr ? 'NDR' : 'IN_TRANSIT', cancelled: false, isNdr: ndr };
  }
  return none;
}

const RANK: Record<ShippingStatusName, number> = {
  NOT_SHIPPED: 0,
  READY: 1,
  PICKED_UP: 2,
  IN_TRANSIT: 3,
  OUT_FOR_DELIVERY: 4,
  NDR: 4,
  RTO: 8,
  DELIVERED: 9,
};

/** Never move a shipment backwards because of a late or repeated scan. */
export function shouldAdvance(current: ShippingStatusName, incoming: ShippingStatusName): boolean {
  if (current === 'DELIVERED') return false;
  if (current === 'NOT_SHIPPED') return false;
  if (incoming === 'RTO') return true;
  if (current === 'RTO') return false;
  if (incoming === 'DELIVERED') return true;
  if (current === 'NDR') return incoming === 'OUT_FOR_DELIVERY' || incoming === 'IN_TRANSIT' || incoming === 'NDR';
  return RANK[incoming] >= RANK[current];
}

export const ACTIVE_STATUSES: ShippingStatusName[] = ['READY', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'NDR'];

// ---------------------------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------------------------
export interface BookingInput {
  orderRef: string;
  name: string;
  address: string;
  pin: string;
  city: string;
  state: string;
  phone: string;
  paymentMode: 'Prepaid' | 'COD';
  codAmount: number;
  totalAmount: number;
  description: string;
  quantity: number;
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  shippingMode: 'Surface' | 'Express';
}

export interface TrackedScan {
  status: string;
  statusType: string;
  instructions: string;
  location: string;
  at: string;
  code: string;
}

export interface TrackedShipment {
  awb: string;
  status: string;
  statusType: string;
  instructions: string;
  location: string;
  at: string;
  code: string;
  expectedDate: string | null;
  scans: TrackedScan[];
}

export class DelhiveryClient {
  constructor(
    readonly cfg: DelhiveryConfig,
    private readonly fetchFn: FetchLike = (input, init) => fetch(input, init),
    private readonly timeoutMs = 9000,
  ) {}

  get configured() {
    return this.cfg.token.length > 0;
  }

  private requireToken() {
    if (!this.configured) throw new DelhiveryError('Delhivery is not configured: the DELHIVERY_API_TOKEN secret is missing.', 503);
  }

  private async call(path: string, init: RequestInit = {}): Promise<{ res: Response; data: any }> {
    this.requireToken();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await this.fetchFn(`${this.cfg.baseUrl}${path}`, {
        ...init,
        signal: controller.signal,
        headers: { Authorization: `Token ${this.cfg.token}`, Accept: 'application/json', ...(init.headers as Record<string, string> | undefined) },
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { raw: text.slice(0, 400) };
      }
      if (res.status === 401 || res.status === 403) {
        throw new DelhiveryError('Delhivery rejected the API token. Check DELHIVERY_API_TOKEN and DELHIVERY_MODE (staging and production tokens differ).', 502, data);
      }
      return { res, data };
    } catch (err: any) {
      if (err instanceof DelhiveryError) throw err;
      if (err?.name === 'AbortError') throw new DelhiveryError('Delhivery did not respond in time. Try again in a minute.', 502);
      throw new DelhiveryError(`Could not reach Delhivery (${err?.message || 'network error'}).`, 502);
    } finally {
      clearTimeout(timer);
    }
  }

  /** Pincode serviceability. Returns null when the pin is not serviceable. */
  async checkPincode(pin: string): Promise<{ city?: string; state?: string; cod: boolean; prepaid: boolean } | null> {
    const { res, data } = await this.call(`/c/api/pin-codes/json/?filter_codes=${encodeURIComponent(pin)}`);
    if (!res.ok) throw new DelhiveryError(`Delhivery pincode check failed (HTTP ${res.status}).`, 502, data);
    const code = data?.delivery_codes?.[0]?.postal_code;
    if (!code) return null;
    return { city: code.district || code.city, state: code.state_code, cod: code.cod === 'Y', prepaid: code.pre_paid === 'Y' };
  }

  /** Book a shipment. Throws unless Delhivery returns a real waybill. */
  async createShipment(input: BookingInput): Promise<{ waybill: string; uploadId?: string; raw: any }> {
    const shipment: Record<string, unknown> = {
      name: cleanText(input.name, 100),
      add: cleanText(input.address, 250),
      pin: input.pin,
      city: cleanText(input.city, 60),
      state: cleanText(input.state, 60),
      country: 'India',
      phone: input.phone,
      order: cleanText(input.orderRef, 60),
      payment_mode: input.paymentMode,
      cod_amount: input.paymentMode === 'COD' ? input.codAmount.toFixed(2) : '0',
      total_amount: input.totalAmount.toFixed(2),
      products_desc: cleanText(input.description, 200),
      quantity: String(Math.max(1, input.quantity)),
      hsn_code: this.cfg.hsn,
      seller_name: cleanText(this.cfg.seller.name, 100),
      seller_add: cleanText(this.cfg.seller.address, 250),
      ...(this.cfg.seller.gst ? { seller_gst_tin: this.cfg.seller.gst } : {}),
      seller_inv: cleanText(input.orderRef, 60),
      return_pin: this.cfg.pickup.pin,
      return_city: cleanText(this.cfg.pickup.city, 60),
      return_phone: this.cfg.pickup.phone,
      return_add: cleanText(this.cfg.pickup.address, 250),
      return_state: cleanText(this.cfg.pickup.state, 60),
      return_country: 'India',
      weight: input.weightGrams,
      shipment_length: input.lengthCm,
      shipment_width: input.widthCm,
      shipment_height: input.heightCm,
      shipping_mode: input.shippingMode,
      address_type: 'home',
      order_date: new Date().toISOString(),
      waybill: '',
    };
    const payload = { shipments: [shipment], pickup_location: { name: this.cfg.pickup.name } };
    const body = new URLSearchParams();
    body.append('format', 'json');
    body.append('data', JSON.stringify(payload));

    const { res, data } = await this.call('/api/cmu/create.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const pkg = data?.packages?.[0];
    const waybill = typeof pkg?.waybill === 'string' ? pkg.waybill.trim() : '';
    const remarks = [pkg?.remarks, data?.rmk, data?.error]
      .flat()
      .filter((v) => typeof v === 'string' && v.trim())
      .join('; ');
    if (!res.ok || data?.success === false || !waybill || (pkg?.status && String(pkg.status).toLowerCase() === 'fail')) {
      throw new DelhiveryError(
        `Delhivery did not accept this shipment${remarks ? `: ${remarks}` : '.'}`,
        res.status >= 500 ? 502 : 422,
        data,
      );
    }
    return { waybill, uploadId: data?.upload_wbn, raw: data };
  }

  /** Track up to 30 waybills. */
  async track(waybills: string[]): Promise<TrackedShipment[]> {
    const list = [...new Set(waybills.filter(Boolean))].slice(0, 30);
    if (list.length === 0) return [];
    const { res, data } = await this.call(`/api/v1/packages/json/?waybill=${encodeURIComponent(list.join(','))}&verbose=2`);
    if (!res.ok) throw new DelhiveryError(`Delhivery tracking failed (HTTP ${res.status}).`, 502, data);
    const out: TrackedShipment[] = [];
    for (const entry of data?.ShipmentData ?? []) {
      const s = entry?.Shipment;
      if (!s) continue;
      const st = s.Status ?? {};
      const scans: TrackedScan[] = [];
      for (const scan of s.Scans ?? []) {
        const d = scan?.ScanDetail ?? scan;
        if (!d) continue;
        scans.push({
          status: String(d.Scan ?? d.Status ?? ''),
          statusType: String(d.ScanType ?? d.StatusType ?? ''),
          instructions: String(d.Instructions ?? ''),
          location: String(d.ScannedLocation ?? d.ScanLocation ?? d.StatusLocation ?? ''),
          at: String(d.ScanDateTime ?? d.StatusDateTime ?? ''),
          code: String(d.StatusCode ?? ''),
        });
      }
      out.push({
        awb: String(s.AWB ?? ''),
        status: String(st.Status ?? ''),
        statusType: String(st.StatusType ?? ''),
        instructions: String(st.Instructions ?? ''),
        location: String(st.StatusLocation ?? ''),
        at: String(st.StatusDateTime ?? ''),
        code: String(st.StatusCode ?? ''),
        expectedDate: s.ExpectedDeliveryDate ? String(s.ExpectedDeliveryDate) : null,
        scans,
      });
    }
    return out;
  }

  /** Cancel. Throws unless Delhivery confirms; allowed only before pickup completes (Manifested, In Transit, Pending...). */
  async cancel(waybill: string): Promise<void> {
    const { res, data } = await this.call('/api/p/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waybill, cancellation: 'true' }),
    });
    const failed = !res.ok || data?.status === false || data?.success === false || data?.error;
    if (failed) {
      const why = [data?.remark, data?.error, data?.message, data?.rmk].find((v) => typeof v === 'string' && v.trim());
      throw new DelhiveryError(`Delhivery did not cancel this shipment${why ? `: ${why}` : '. It may already be picked up or delivered.'}`, res.status >= 500 ? 502 : 422, data);
    }
  }

  /** Shipping label data (packing slip). Delhivery returns JSON, not a PDF. */
  async packingSlip(waybill: string): Promise<any> {
    const { res, data } = await this.call(`/api/p/packing_slip?wbns=${encodeURIComponent(waybill)}`);
    if (!res.ok) throw new DelhiveryError(`Delhivery label request failed (HTTP ${res.status}).`, 502, data);
    return data;
  }

  /** Ask Delhivery to collect parcels from the registered warehouse. One open pickup per warehouse. */
  async requestPickup(input: { date: string; time: string; count: number }): Promise<{ pickupId: string | null; raw: any }> {
    const { res, data } = await this.call('/fm/request/new/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pickup_time: input.time,
        pickup_date: input.date,
        pickup_location: this.cfg.pickup.name,
        expected_package_count: input.count,
      }),
    });
    if (!res.ok || data?.error || data?.success === false) {
      const why = [data?.error, data?.message, data?.rmk].find((v) => typeof v === 'string' && v.trim());
      throw new DelhiveryError(`Delhivery did not schedule the pickup${why ? `: ${why}` : '.'}`, res.status >= 500 ? 502 : 422, data);
    }
    const id = data?.pickup_id ?? data?.pickup_request_id ?? data?.id ?? null;
    return { pickupId: id === null || id === undefined ? null : String(id), raw: data };
  }

  /** NDR action on an undelivered shipment (asynchronous on Delhivery's side). */
  async ndrAction(waybill: string, act: 'RE-ATTEMPT' | 'DEFER_DLV' | 'EDIT_DETAILS', extra: Record<string, string> = {}): Promise<{ uplId: string | null; raw: any }> {
    const { res, data } = await this.call('/api/p/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [{ waybill, act, ...extra }] }),
    });
    if (!res.ok || data?.error || data?.success === false) {
      const why = [data?.error, data?.message, data?.rmk].find((v) => typeof v === 'string' && v.trim());
      throw new DelhiveryError(`Delhivery did not accept the action${why ? `: ${why}` : '.'}`, res.status >= 500 ? 502 : 422, data);
    }
    return { uplId: data?.upl_id ?? data?.UPL ?? data?.request_id ?? null, raw: data };
  }
}
