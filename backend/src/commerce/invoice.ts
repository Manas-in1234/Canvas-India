/**
 * Tax invoice data for one order. Pure functions: the Worker loads the order, this builds the figures.
 *
 * Tax follows what was RECORDED on the order. If the order has a tax amount, that is the tax. If it has none and the
 * shop says its prices include GST, tax is backed out of the total. Otherwise no tax is shown. It never invents tax on
 * top of what the customer paid.
 */
export interface InvoiceEnv {
  BUSINESS_LEGAL_NAME?: string;
  BUSINESS_ADDRESS?: string;
  BUSINESS_STATE?: string;
  BUSINESS_GSTIN?: string;
  BUSINESS_PHONE?: string;
  BUSINESS_EMAIL?: string;
  INVOICE_PREFIX?: string;
  /** "true" if listed prices already include GST. */
  PRICES_INCLUDE_GST?: string;
  GST_RATE?: string;
  INVOICE_HSN_CODE?: string;
}

export interface BusinessProfile {
  legalName: string;
  address: string;
  state: string;
  gstin: string;
  phone: string;
  email: string;
  invoicePrefix: string;
  pricesIncludeGst: boolean;
  gstRate: number;
  hsn: string;
  /** False until the legal name and GSTIN are filled in; the admin shows a warning instead of a legal-looking invoice. */
  complete: boolean;
}

export function loadBusinessProfile(env: InvoiceEnv): BusinessProfile {
  const gstRate = Number(env.GST_RATE);
  const legalName = env.BUSINESS_LEGAL_NAME?.trim() || '';
  const gstin = (env.BUSINESS_GSTIN || '').trim().toUpperCase();
  return {
    legalName: legalName || 'SREE MAHALAKSHMI ENTERPRISES',
    address: env.BUSINESS_ADDRESS?.trim() || 'H NO 4-9-197/B/84, Nacharam HMT Nagar Main Road, Hyderabad, Telangana 500076',
    state: env.BUSINESS_STATE?.trim() || 'Telangana',
    gstin,
    phone: env.BUSINESS_PHONE?.trim() || '',
    email: env.BUSINESS_EMAIL?.trim() || '',
    invoicePrefix: env.INVOICE_PREFIX?.trim() || 'INV-',
    pricesIncludeGst: (env.PRICES_INCLUDE_GST || '').trim().toLowerCase() === 'true',
    gstRate: Number.isFinite(gstRate) && gstRate > 0 && gstRate <= 40 ? gstRate : 18,
    hsn: env.INVOICE_HSN_CODE?.trim() || '4911',
    complete: Boolean(legalName && /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstin)),
  };
}

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function below1000(n: number): string {
  const parts: string[] = [];
  if (n >= 100) {
    parts.push(`${ONES[Math.floor(n / 100)]} Hundred`);
    n %= 100;
  }
  if (n >= 20) {
    parts.push(TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : ''));
  } else if (n > 0) {
    parts.push(ONES[n]);
  }
  return parts.join(' ');
}

/** 1234.5 -> "Rupees One Thousand Two Hundred Thirty Four and Fifty Paise Only" (Indian grouping). */
export function rupeesInWords(amount: number): string {
  const total = Math.round(Math.abs(amount) * 100);
  let rupees = Math.floor(total / 100);
  const paise = total % 100;
  if (rupees === 0 && paise === 0) return 'Rupees Zero Only';
  const groups: Array<[number, string]> = [[10000000, 'Crore'], [100000, 'Lakh'], [1000, 'Thousand']];
  const words: string[] = [];
  for (const [size, name] of groups) {
    if (rupees >= size) {
      words.push(`${below1000(Math.floor(rupees / size))} ${name}`);
      rupees %= size;
    }
  }
  if (rupees > 0) words.push(below1000(rupees));
  const main = words.join(' ');
  const text = main ? `Rupees ${main}` : 'Rupees Zero';
  return `${text}${paise ? ` and ${below1000(paise)} Paise` : ''} Only`;
}

export interface InvoiceOrder {
  id: string;
  orderNumber: string;
  createdAt: Date | string;
  subtotal: unknown;
  discount: unknown;
  tax: unknown;
  shipping: unknown;
  total: unknown;
  customer: { name: string; email: string | null; phone: string | null } | null;
  items: Array<{ productNameSnapshot: string; quantity: number; priceSnapshot: unknown; configurationSnapshot?: unknown }>;
  addresses: Array<{ type: string; name: string; line1: string; line2: string | null; city: string; state: string; postalCode: string; phone: string | null }>;
  payments: Array<{ provider: string; status: string }>;
}

export interface InvoiceLine {
  description: string;
  hsn: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  seller: { name: string; address: string; state: string; gstin: string; phone: string; email: string };
  buyer: { name: string; addressLines: string[]; state: string; phone: string | null; email: string | null };
  placeOfSupply: string;
  interState: boolean;
  lines: InvoiceLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  taxableValue: number;
  taxRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  total: number;
  amountInWords: string;
  paymentMode: 'Cash on Delivery' | 'Paid online';
  taxNote: string;
  profileComplete: boolean;
}

function sizeOf(config: unknown): string {
  const c = (config ?? {}) as Record<string, unknown>;
  const size = c.size ?? c.dimensions;
  return typeof size === 'string' && size.trim() ? ` (${size.trim()})` : '';
}

/** Invoice numbers are at most 16 characters (GST rule); a long order number falls back to a short code. */
export function invoiceNumberFor(order: Pick<InvoiceOrder, 'id' | 'orderNumber'>, prefix: string): string {
  const direct = `${prefix}${order.orderNumber}`;
  if (direct.length <= 16 && /^[A-Za-z0-9/-]+$/.test(direct)) return direct;
  const short = `${prefix}${order.id.replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase()}`;
  return short.slice(0, 16);
}

export function buildInvoice(order: InvoiceOrder, profile: BusinessProfile): InvoiceData {
  const ship = order.addresses.find((a) => a.type === 'SHIPPING') ?? order.addresses[0];
  const buyerState = (ship?.state || profile.state).trim();
  const interState = buyerState.toLowerCase() !== profile.state.trim().toLowerCase();

  const lines: InvoiceLine[] = order.items.map((i) => {
    const unit = Number(i.priceSnapshot) || 0;
    return { description: `${i.productNameSnapshot}${sizeOf(i.configurationSnapshot)}`, hsn: profile.hsn, quantity: i.quantity, unitPrice: round2(unit), amount: round2(unit * i.quantity) };
  });

  const total = round2(Number(order.total) || 0);
  const recordedTax = round2(Number(order.tax) || 0);
  let totalTax = 0;
  let taxNote = '';
  if (recordedTax > 0) {
    totalTax = Math.min(recordedTax, total);
    taxNote = 'Tax as charged on the order.';
  } else if (profile.pricesIncludeGst) {
    totalTax = round2(total - total / (1 + profile.gstRate / 100));
    taxNote = `Prices include GST at ${profile.gstRate}%.`;
  } else {
    taxNote = 'No tax was charged on this order.';
  }
  const taxableValue = round2(total - totalTax);
  const taxRate = taxableValue > 0 && totalTax > 0 ? round2((totalTax / taxableValue) * 100) : 0;
  const cgst = interState ? 0 : round2(Math.floor((totalTax * 100) / 2) / 100);
  const sgst = interState ? 0 : round2(totalTax - cgst);
  const igst = interState ? totalTax : 0;
  const isCod = order.payments.some((p) => p.provider === 'COD');

  return {
    invoiceNumber: invoiceNumberFor(order, profile.invoicePrefix),
    date: new Date(order.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' }),
    seller: { name: profile.legalName, address: profile.address, state: profile.state, gstin: profile.gstin, phone: profile.phone, email: profile.email },
    buyer: {
      name: ship?.name || order.customer?.name || 'Customer',
      addressLines: ship ? [ship.line1, ship.line2, `${ship.city}, ${ship.state} ${ship.postalCode}`].filter((x): x is string => Boolean(x)) : [],
      state: buyerState,
      phone: ship?.phone ?? order.customer?.phone ?? null,
      email: order.customer?.email ?? null,
    },
    placeOfSupply: buyerState,
    interState,
    lines,
    subtotal: round2(Number(order.subtotal) || 0),
    discount: round2(Number(order.discount) || 0),
    shipping: round2(Number(order.shipping) || 0),
    taxableValue,
    taxRate,
    cgst,
    sgst,
    igst,
    totalTax,
    total,
    amountInWords: rupeesInWords(total),
    paymentMode: isCod ? 'Cash on Delivery' : 'Paid online',
    taxNote,
    profileComplete: profile.complete,
  };
}
