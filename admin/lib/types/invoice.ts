export interface InvoiceLine {
  description: string;
  hsn: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

/** Computed by the backend (backend/src/commerce/invoice.ts); the admin only displays and prints it. */
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
  paymentMode: "Cash on Delivery" | "Paid online";
  taxNote: string;
  profileComplete: boolean;
}
