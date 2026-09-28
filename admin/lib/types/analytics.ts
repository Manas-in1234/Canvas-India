// Unlike Order/Product endpoints, analytics summaries return plain numbers
// (the service casts Decimal fields via Number(...) before aggregating) —
// not Decimal-as-string. Money formatting here takes a number, not a string.
export interface SalesSummary {
  totalOrders: number;
  totalUnits: number;
  grossSales: number;
  totalDiscounts: number;
  totalRefunds: number;
  netSales: number;
  averageOrderValue: number;
  totalTax: number;
  totalShippingRevenue: number;
}

export interface SalesAnalytics {
  summary: SalesSummary;
}

export interface CustomerSummary {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  activeCustomers: number;
  totalCustomerRevenue: number;
  averageCustomerOrderValue: number;
}

export interface CustomerAnalytics {
  summary: CustomerSummary;
}
