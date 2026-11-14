import { describe, expect, it } from 'vitest';
import { buildInvoice, invoiceNumberFor, loadBusinessProfile, rupeesInWords, type InvoiceOrder } from './invoice.js';

const profile = loadBusinessProfile({ BUSINESS_LEGAL_NAME: 'Sree Mahalakshmi Enterprises', BUSINESS_GSTIN: '36ABCDE1234F1Z5', BUSINESS_STATE: 'Telangana' });

const order = (over: Partial<InvoiceOrder> = {}): InvoiceOrder => ({
  id: 'abcd1234-0000-4000-8000-000000000000',
  orderNumber: 'CI-20261114-1234',
  createdAt: '2026-11-14T10:00:00Z',
  subtotal: '1000', discount: '0', tax: '0', shipping: '0', total: '1000',
  customer: { name: 'Asha Rao', email: 'a@b.co', phone: '9876543210' },
  items: [{ productNameSnapshot: 'Canvas Heart', quantity: 2, priceSnapshot: '500', configurationSnapshot: { size: '12" x 18"' } }],
  addresses: [{ type: 'SHIPPING', name: 'Asha Rao', line1: '1 Road', line2: null, city: 'Warangal', state: 'Telangana', postalCode: '506001', phone: '9876543210' }],
  payments: [{ provider: 'RAZORPAY', status: 'PAID' }],
  ...over,
});

describe('amount in words', () => {
  it('uses Indian grouping and paise', () => {
    expect(rupeesInWords(0)).toBe('Rupees Zero Only');
    expect(rupeesInWords(900)).toBe('Rupees Nine Hundred Only');
    expect(rupeesInWords(1234.5)).toBe('Rupees One Thousand Two Hundred Thirty Four and Fifty Paise Only');
    expect(rupeesInWords(100000)).toBe('Rupees One Lakh Only');
    expect(rupeesInWords(12345678)).toBe('Rupees One Crore Twenty Three Lakh Forty Five Thousand Six Hundred Seventy Eight Only');
    expect(rupeesInWords(0.5)).toBe('Rupees Zero and Fifty Paise Only');
  });
});

describe('business profile', () => {
  it('is incomplete until a legal name and a valid GSTIN are set, so a draft invoice is never passed off as legal', () => {
    expect(loadBusinessProfile({}).complete).toBe(false);
    expect(loadBusinessProfile({ BUSINESS_LEGAL_NAME: 'X', BUSINESS_GSTIN: 'bad' }).complete).toBe(false);
    expect(profile.complete).toBe(true);
    expect(loadBusinessProfile({ GST_RATE: '999' }).gstRate).toBe(18);
  });
});

describe('invoice tax', () => {
  it('splits recorded tax into CGST and SGST inside the shop\'s state', () => {
    const inv = buildInvoice(order({ tax: '152.54', total: '1000' }), profile);
    expect(inv.interState).toBe(false);
    expect(inv.totalTax).toBe(152.54);
    expect(inv.cgst + inv.sgst).toBeCloseTo(152.54, 2);
    expect(inv.igst).toBe(0);
    expect(inv.taxableValue).toBeCloseTo(847.46, 2);
    expect(inv.taxRate).toBeCloseTo(18, 0);
  });

  it('uses IGST for a customer in another state', () => {
    const inv = buildInvoice(order({ tax: '180', total: '1180', addresses: [{ ...order().addresses[0], state: 'Karnataka' }] }), profile);
    expect(inv.interState).toBe(true);
    expect(inv.igst).toBe(180);
    expect(inv.cgst + inv.sgst).toBe(0);
    expect(inv.placeOfSupply).toBe('Karnataka');
  });

  it('never loses a paisa when the tax does not split evenly', () => {
    const inv = buildInvoice(order({ tax: '0.15', total: '1.15' }), profile);
    expect(inv.cgst + inv.sgst).toBeCloseTo(0.15, 2);
  });

  it('backs GST out of the total when prices include it and none was recorded', () => {
    const inclusive = loadBusinessProfile({ BUSINESS_LEGAL_NAME: 'X', BUSINESS_GSTIN: '36ABCDE1234F1Z5', PRICES_INCLUDE_GST: 'true', GST_RATE: '18' });
    const inv = buildInvoice(order({ total: '1180' }), inclusive);
    expect(inv.taxableValue).toBe(1000);
    expect(inv.totalTax).toBe(180);
    expect(inv.taxNote).toContain('include GST');
  });

  it('shows no tax when none was charged and prices are not GST-inclusive', () => {
    const inv = buildInvoice(order(), profile);
    expect(inv.totalTax).toBe(0);
    expect(inv.taxableValue).toBe(1000);
    expect(inv.taxNote).toContain('No tax');
  });

  it('prefers the tax recorded on the order over the shop setting', () => {
    const inclusive = loadBusinessProfile({ PRICES_INCLUDE_GST: 'true' });
    expect(buildInvoice(order({ tax: '50', total: '1000' }), inclusive).totalTax).toBe(50);
  });
});

describe('invoice content', () => {
  it('lists items with size, HSN and amounts, and the amount in words', () => {
    const inv = buildInvoice(order(), profile);
    expect(inv.lines[0]).toMatchObject({ description: 'Canvas Heart (12" x 18")', hsn: '4911', quantity: 2, unitPrice: 500, amount: 1000 });
    expect(inv.amountInWords).toBe('Rupees One Thousand Only');
    expect(inv.buyer.addressLines).toEqual(['1 Road', 'Warangal, Telangana 506001']);
    expect(inv.paymentMode).toBe('Paid online');
    expect(buildInvoice(order({ payments: [{ provider: 'COD', status: 'PENDING' }] }), profile).paymentMode).toBe('Cash on Delivery');
  });

  it('keeps invoice numbers within 16 characters', () => {
    expect(invoiceNumberFor({ id: 'x', orderNumber: 'CI-20261114-1234' }, '')).toBe('CI-20261114-1234');
    expect(invoiceNumberFor({ id: 'x', orderNumber: 'CC10001' }, 'INV-')).toBe('INV-CC10001');
    const long = invoiceNumberFor({ id: 'abcd1234-5678-4000-8000-000000000000', orderNumber: 'CC-COD-abcd1234-5678-4000-8000-000000000000' }, 'INV-');
    expect(long).toBe('INV-ABCD1234');
    expect(long.length).toBeLessThanOrEqual(16);
  });

  it('handles an order with no address or customer without crashing', () => {
    const inv = buildInvoice(order({ addresses: [], customer: null }), profile);
    expect(inv.buyer.name).toBe('Customer');
    expect(inv.buyer.addressLines).toEqual([]);
    expect(inv.interState).toBe(false);
  });
});
