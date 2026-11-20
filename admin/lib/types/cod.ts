export type CodCollectionStatus = 'PENDING' | 'COLLECTED';
export type CodRemittanceStatus = 'PENDING' | 'INITIATED' | 'CREDITED';

export interface CodSummary {
  totalCodOrders: number;
  totalCodAmount: number;
  collectedOrders: number;
  collectedAmount: number;
  pendingCollectionOrders: number;
  pendingCollectionAmount: number;
  remittedAmount: number;
  remittancePendingAmount: number;
  bankCreditedAmount: number;
  remittanceByStatus: Record<CodRemittanceStatus, { amount: number; count: number }>;
}

export interface PendingCollectionPayment {
  id: string;
  orderId: string;
  amount: string;
  createdAt: string;
  order: {
    id: string;
    orderNumber: string;
    shippingStatus: string;
    total: string;
    shipments: { awbNumber: string | null; status: string }[];
  };
}

export interface CollectedUnremittedPayment {
  id: string;
  orderId: string;
  amount: string;
  codCollectedAmount: string | null;
  codCollectedAt: string | null;
  order: { id: string; orderNumber: string };
}

export interface CodRemittanceItem {
  id: string;
  paymentId: string;
  amount: string;
  payment: { id: string; orderId: string; order: { orderNumber: string } };
}

export interface CodRemittance {
  id: string;
  amount: string;
  remittanceDate: string;
  status: CodRemittanceStatus;
  bankReference: string | null;
  bankCreditedAt: string | null;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  items: CodRemittanceItem[];
}

export const COD_REMITTANCE_STATUS_LABEL: Record<CodRemittanceStatus, string> = {
  PENDING: 'Pending',
  INITIATED: 'Initiated',
  CREDITED: 'Credited to bank',
};
