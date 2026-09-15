# Phase 6 — Analytics Documentation

This document provides complete technical specifications and operational guidance for the **Analytics** module in Canvas India / CanvasChamp.

---

## 1. Overview & Architecture

The Analytics module is a consolidated, read-only analytics domain providing business intelligence, operational metrics, and financial reporting across seven distinct operational areas:

1. **Sales Analytics** (`GET /analytics/sales`)
2. **Product Analytics** (`GET /analytics/products`)
3. **Customer Analytics** (`GET /analytics/customers`)
4. **Production Analytics** (`GET /analytics/production`)
5. **Inventory Analytics** (`GET /analytics/inventory`)
6. **Shipping Analytics** (`GET /analytics/shipping`)
7. **Profitability Analytics** (`GET /analytics/profitability`)

### Read-Only Guarantee
All endpoints in the Analytics module perform strictly read-only database queries (`aggregate`, `count`, `groupBy`, and batch `findMany`). No database mutations, state transitions, or side-effects are performed.

---

## 2. Authorization & RBAC

Every analytics endpoint is protected by:
- `JwtAuthGuard`: Enforces a valid, authenticated admin/staff JWT session.
- `PermissionsGuard`: Enforces granular permission verification.
- `@RequirePermissions('analytics.view')`: Requires the `analytics.view` permission.

### Seed Permission
The `analytics.view` permission is seeded into the database in `prisma/seed.ts` and attached to the system Administrator and Manager roles.

---

## 3. Query Filters & Date Semantics

All analytics endpoints accept an optional query payload validated via `AnalyticsFilterDto`:

| Query Parameter | Type | Description |
|---|---|---|
| `startDate` | ISO-8601 String | Inclusive start timestamp (calculated in UTC). |
| `endDate` | ISO-8601 String | Exclusive end timestamp (calculated in UTC). |
| `warehouseId` | String (UUID) | Filters metrics associated with a specific fulfillment warehouse. |
| `productId` | String (UUID) | Filters metrics associated with a specific product. |
| `customerId` | String (UUID) | Filters metrics associated with a specific customer. |
| `status` | String | Optional operational status filter. |

### Date Calculation Semantics
- **UTC Enforcement**: All date calculations are executed in UTC.
- **Inclusive Start / Exclusive End**: Date queries query `[startDate, endDate)`, i.e. `createdAt >= startDate AND createdAt < endDate`.
- **Default Date Window**: When omitted, `endDate` defaults to current UTC time, and `startDate` defaults to exactly 30 days prior (`endDate - 30 days`).
- **Validation**: If `startDate >= endDate`, or if either parameter contains an unparseable timestamp, a `400 Bad Request` (`BadRequestException`) is thrown.

### Sales Warehouse Filtering
The `Order` entity does not contain a direct `warehouseId` column because fulfillment occurs via associated shipments. When `warehouseId` is supplied to sales or product analytics, filtering is performed through the related shipment:
```prisma
ordersWhere.shipments = { some: { warehouseId: filter.warehouseId } };
```
An `EXISTS` subquery at the SQL database layer guarantees that an order is counted at most once, preventing duplicate counting even if multiple shipments are associated with the order.

---

## 4. Endpoints & Response Structures

### 4.1 Sales Analytics
**Route**: `GET /analytics/sales`  
**Description**: Returns order volume, gross sales, discounts, refunds, net sales, tax, shipping revenue, and average order value (AOV). Cancelled orders are excluded from net sales calculations.
```json
{
  "summary": {
    "totalOrders": 120,
    "totalUnits": 350,
    "grossSales": 145000.0,
    "totalDiscounts": 12000.0,
    "totalRefunds": 3500.0,
    "netSales": 129500.0,
    "averageOrderValue": 1079.17,
    "totalTax": 18250.0,
    "totalShippingRevenue": 4500.0
  },
  "breakdown": {
    "byStatus": [
      { "status": "COMPLETED", "count": 100, "revenue": 125000.0 },
      { "status": "PROCESSING", "count": 20, "revenue": 20000.0 }
    ]
  }
}
```

### 4.2 Product Analytics
**Route**: `GET /analytics/products`  
**Description**: Aggregates unit volume and revenue per product with ranking by revenue. Optimized via batch variant lookup to prevent N+1 queries.
```json
{
  "summary": {
    "totalProductsWithSales": 15,
    "totalUnitsSold": 350,
    "totalRevenue": 145000.0
  },
  "products": [
    {
      "productId": "prod-uuid-1",
      "productName": "Canvas Print 12x18",
      "unitsSold": 150,
      "revenue": 75000.0,
      "orderCount": 85
    }
  ]
}
```

### 4.3 Customer Analytics
**Route**: `GET /analytics/customers`  
**Description**: Evaluates customer base growth, new vs. returning customers (> 1 order), total customer spend, average order value, top spenders, and active customer segment breakdown.
```json
{
  "summary": {
    "totalCustomers": 540,
    "newCustomers": 45,
    "returningCustomers": 78,
    "activeCustomers": 110,
    "totalCustomerRevenue": 145000.0,
    "averageCustomerOrderValue": 1208.33
  },
  "topCustomers": [
    {
      "customerId": "cust-uuid-1",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "totalOrders": 5,
      "totalSpend": 12400.0
    }
  ],
  "segmentBreakdown": [
    { "segmentId": "seg-1", "name": "High LTV VIP", "memberCount": 24 }
  ]
}
```

### 4.4 Production Analytics
**Route**: `GET /analytics/production`  
**Description**: Reports pipeline volume across queued, active, completed, failed, and overdue jobs. Accurately accounts for multiple `ProductionJobs` per `OrderItem` (e.g. reprint/replacement requests).
```json
{
  "summary": {
    "totalJobs": 210,
    "totalUniqueOrderItems": 195,
    "queuedJobs": 12,
    "activeJobs": 35,
    "completedJobs": 160,
    "failedJobs": 3,
    "overdueJobs": 2,
    "slaCompliantJobs": 193,
    "slaBreachedJobs": 2,
    "slaComplianceRate": 98.97
  },
  "breakdown": {
    "byStage": [
      { "stage": "PRINTING", "count": 15 },
      { "stage": "QC", "count": 10 }
    ],
    "byStatus": [
      { "status": "COMPLETED", "count": 160 },
      { "status": "IN_PROGRESS", "count": 35 }
    ]
  }
}
```

### 4.5 Inventory Analytics
**Route**: `GET /analytics/inventory`  
**Description**: Audits total available, reserved, and damaged inventory stock balances alongside inbound and outbound stock movement ledger activity.
```json
{
  "summary": {
    "totalStock": 8500,
    "totalAvailable": 7200,
    "totalReserved": 1300,
    "totalDamaged": 45,
    "totalStockIn": 12000,
    "totalStockOut": 3500,
    "lowStockItemsCount": 8
  },
  "movementsBreakdown": [
    { "type": "PURCHASE", "totalQuantity": 10000, "movementCount": 12 },
    { "type": "CONSUMPTION", "totalQuantity": 3200, "movementCount": 140 }
  ]
}
```

### 4.6 Shipping Analytics
**Route**: `GET /analytics/shipping`  
**Description**: Tracks delivery success rates, non-delivery reports (NDR), and return-to-origin (RTO) cases alongside courier partner distribution.
> [!IMPORTANT]
> `Order.shipping` represents the customer shipping revenue/fee, NOT the actual carrier shipping cost. Actual carrier cost is not tracked on `Shipment`. Consequently, carrier shipping cost is explicitly not fabricated and flagged as untracked.
```json
{
  "summary": {
    "totalShipments": 180,
    "deliveredShipments": 158,
    "inTransitShipments": 14,
    "cancelledShipments": 0,
    "ndrCount": 5,
    "rtoCount": 3,
    "deliverySuccessRate": 87.78,
    "ndrRate": 2.78,
    "rtoRate": 1.67,
    "shippingCostTracked": false
  },
  "breakdown": {
    "byCourier": [
      { "courier": "BLUEDART", "count": 110 },
      { "courier": "DELHIVERY", "count": 70 }
    ],
    "byStatus": [
      { "status": "DELIVERED", "count": 158 }
    ]
  },
  "unavailableMetrics": ["carrierActualShippingCost"]
}
```

### 4.7 Profitability Analytics
**Route**: `GET /analytics/profitability`  
**Description**: Computes gross revenue, discounts, refunds, net revenue, available Cost of Goods Sold (COGS), gross profit, and profit margin.
> [!NOTE]
> Available COGS is calculated strictly as `Product.costPrice × OrderItem.quantity` using decimal-safe calculations. Unrecorded cost components (labor, machinery depreciation, packaging materials, and warehouse overhead) are explicitly identified rather than fabricated.
```json
{
  "summary": {
    "grossRevenue": 145000.0,
    "discounts": 12000.0,
    "refunds": 3500.0,
    "netRevenue": 129500.0,
    "costsAvailable": true,
    "availableProductCost": 48500.0,
    "grossProfit": 81000.0,
    "profitMargin": 62.55
  },
  "unavailableCostComponents": [
    "carrierActualShippingCost",
    "productionLaborAndMachineCost",
    "packagingMaterialCost",
    "storageAndWarehousingCost"
  ],
  "profitabilityFormula": "grossProfit = netRevenue - availableProductCost; profitMargin = (grossProfit / netRevenue) * 100"
}
```

---

## 5. Performance & Database Optimization

- **Zero N+1 Queries**: All related entity lookups (products, variants, customer records, stages) use single batch queries (`findMany({ where: { id: { in: ids } } })`).
- **Database Aggregation**: Aggregations (`_sum`, `_count`, `groupBy`) are performed directly within PostgreSQL through Prisma.
- **No In-Memory Bloat**: Massive record sets are never loaded into Node.js application memory.
- **No Redis Overhead**: Kept clean and database-driven without introducing cache-invalidation risks or stale-read issues.

---

## 6. Testing & Validation

Run the test suite:
```bash
npm run test
```
Build the production bundle:
```bash
npm run build
```
Validate Prisma schema:
```bash
npx prisma validate
```
