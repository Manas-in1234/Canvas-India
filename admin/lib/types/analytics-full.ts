export interface ProductAnalytics {
  summary: { totalProductsWithSales: number; totalUnitsSold: number; totalRevenue: number };
  products: { productId: string; productName: string; unitsSold: number; revenue: number; orderCount: number }[];
}

export interface ProductionAnalytics {
  summary: {
    totalJobs: number;
    totalUniqueOrderItems: number;
    queuedJobs: number;
    activeJobs: number;
    completedJobs: number;
    failedJobs: number;
    overdueJobs: number;
    slaCompliantJobs: number;
    slaBreachedJobs: number;
    slaComplianceRate: number;
  };
  breakdown: {
    byStage: { stage: string; count: number }[];
    byStatus: { status: string; count: number }[];
  };
}

export interface InventoryAnalytics {
  summary: {
    totalStock: number;
    totalAvailable: number;
    totalReserved: number;
    totalDamaged: number;
    totalStockIn: number;
    totalStockOut: number;
    lowStockItemsCount: number;
  };
  movementsBreakdown: { type: string; totalQuantity: number; movementCount: number }[];
}

export interface ShippingAnalytics {
  summary: {
    totalShipments: number;
    deliveredShipments: number;
    inTransitShipments: number;
    ndrCount: number;
    rtoCount: number;
    deliverySuccessRate: number;
    ndrRate: number;
    rtoRate: number;
  };
  breakdown: {
    byCourier: { courier: string; count: number }[];
    byStatus: { status: string; count: number }[];
  };
}

export interface ProfitabilityAnalytics {
  summary: {
    grossRevenue: number;
    discounts: number;
    refunds: number;
    netRevenue: number;
    availableProductCost: number;
    grossProfit: number;
    profitMargin: number;
  };
  unavailableCostComponents: string[];
}
