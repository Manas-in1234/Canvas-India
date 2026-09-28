'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { SalesAnalytics, CustomerAnalytics } from '@/lib/types/analytics';
import type {
  ProductAnalytics,
  ProductionAnalytics,
  InventoryAnalytics,
  ShippingAnalytics,
  ProfitabilityAnalytics,
} from '@/lib/types/analytics-full';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrencyNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

type ReportKey = 'sales' | 'products' | 'customers' | 'production' | 'inventory' | 'shipping' | 'profitability';

const REPORTS: { key: ReportKey; label: string }[] = [
  { key: 'sales', label: 'Sales' },
  { key: 'products', label: 'Products' },
  { key: 'customers', label: 'Customers' },
  { key: 'production', label: 'Production' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'profitability', label: 'Profitability' },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function MetricGrid({ metrics }: { metrics: { label: string; value: string | number }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">{m.label}</div>
          <div className="text-lg font-semibold">{m.value}</div>
        </div>
      ))}
    </div>
  );
}

function BreakdownTable({ rows, keyLabel }: { rows: { label: string; count: number }[]; keyLabel: string }) {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">No data.</p>;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="pb-2 font-medium">{keyLabel}</th>
          <th className="pb-2 font-medium">Count</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b last:border-0">
            <td className="py-2">{row.label.replaceAll('_', ' ')}</td>
            <td className="py-2">{row.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AnalyticsPage() {
  const [activeReport, setActiveReport] = useState<ReportKey>('sales');
  const [startDate, setStartDate] = useState(daysAgo(30));
  const [endDate, setEndDate] = useState(daysAgo(0));

  const range = `startDate=${new Date(startDate).toISOString()}&endDate=${new Date(
    endDate + 'T23:59:59.999Z',
  ).toISOString()}`;

  const salesQuery = useQuery({
    queryKey: ['analytics', 'sales', startDate, endDate],
    queryFn: () => apiClient.get<SalesAnalytics>(`/analytics/sales?${range}`),
    enabled: activeReport === 'sales',
  });

  const productsQuery = useQuery({
    queryKey: ['analytics', 'products', startDate, endDate],
    queryFn: () => apiClient.get<ProductAnalytics>(`/analytics/products?${range}`),
    enabled: activeReport === 'products',
  });

  const customersQuery = useQuery({
    queryKey: ['analytics', 'customers', startDate, endDate],
    queryFn: () => apiClient.get<CustomerAnalytics>(`/analytics/customers?${range}`),
    enabled: activeReport === 'customers',
  });

  const productionQuery = useQuery({
    queryKey: ['analytics', 'production', startDate, endDate],
    queryFn: () => apiClient.get<ProductionAnalytics>(`/analytics/production?${range}`),
    enabled: activeReport === 'production',
  });

  const inventoryQuery = useQuery({
    queryKey: ['analytics', 'inventory'],
    queryFn: () => apiClient.get<InventoryAnalytics>('/analytics/inventory'),
    enabled: activeReport === 'inventory',
  });

  const shippingQuery = useQuery({
    queryKey: ['analytics', 'shipping', startDate, endDate],
    queryFn: () => apiClient.get<ShippingAnalytics>(`/analytics/shipping?${range}`),
    enabled: activeReport === 'shipping',
  });

  const profitabilityQuery = useQuery({
    queryKey: ['analytics', 'profitability', startDate, endDate],
    queryFn: () => apiClient.get<ProfitabilityAnalytics>(`/analytics/profitability?${range}`),
    enabled: activeReport === 'profitability',
  });

  const activeQuery = {
    sales: salesQuery,
    products: productsQuery,
    customers: customersQuery,
    production: productionQuery,
    inventory: inventoryQuery,
    shipping: shippingQuery,
    profitability: profitabilityQuery,
  }[activeReport];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Business reports across every part of the operation.</p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="startDate" className="text-xs">
            From
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate" className="text-xs">
            To
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b">
        {REPORTS.map((report) => (
          <button
            key={report.key}
            onClick={() => setActiveReport(report.key)}
            className={cn(
              'border-b-2 px-3 py-2 text-sm font-medium transition-colors',
              activeReport === report.key
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {report.label}
          </button>
        ))}
      </div>

      {activeQuery.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : activeQuery.isError ? (
        <p className="text-sm text-destructive">Failed to load this report.</p>
      ) : (
        <div className="space-y-6">
          {activeReport === 'sales' && salesQuery.data && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sales Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricGrid
                  metrics={[
                    { label: 'Total Orders', value: salesQuery.data.summary.totalOrders },
                    { label: 'Units Sold', value: salesQuery.data.summary.totalUnits },
                    { label: 'Gross Sales', value: formatCurrencyNumber(salesQuery.data.summary.grossSales) },
                    { label: 'Net Sales', value: formatCurrencyNumber(salesQuery.data.summary.netSales) },
                    { label: 'Discounts', value: formatCurrencyNumber(salesQuery.data.summary.totalDiscounts) },
                    { label: 'Refunds', value: formatCurrencyNumber(salesQuery.data.summary.totalRefunds) },
                    {
                      label: 'Avg Order Value',
                      value: formatCurrencyNumber(salesQuery.data.summary.averageOrderValue),
                    },
                  ]}
                />
              </CardContent>
            </Card>
          )}

          {activeReport === 'products' && productsQuery.data && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MetricGrid
                  metrics={[
                    { label: 'Products with Sales', value: productsQuery.data.summary.totalProductsWithSales },
                    { label: 'Units Sold', value: productsQuery.data.summary.totalUnitsSold },
                    { label: 'Total Revenue', value: formatCurrencyNumber(productsQuery.data.summary.totalRevenue) },
                  ]}
                />
                {productsQuery.data.products.length > 0 && (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-2 font-medium">Product</th>
                        <th className="pb-2 font-medium">Units</th>
                        <th className="pb-2 font-medium">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsQuery.data.products.slice(0, 15).map((p) => (
                        <tr key={p.productId} className="border-b last:border-0">
                          <td className="py-2">{p.productName}</td>
                          <td className="py-2">{p.unitsSold}</td>
                          <td className="py-2">{formatCurrencyNumber(p.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          )}

          {activeReport === 'customers' && customersQuery.data && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricGrid
                  metrics={[
                    { label: 'Total Customers', value: customersQuery.data.summary.totalCustomers },
                    { label: 'New Customers', value: customersQuery.data.summary.newCustomers },
                    { label: 'Returning Customers', value: customersQuery.data.summary.returningCustomers },
                    { label: 'Active Customers', value: customersQuery.data.summary.activeCustomers },
                    {
                      label: 'Total Revenue',
                      value: formatCurrencyNumber(customersQuery.data.summary.totalCustomerRevenue),
                    },
                    {
                      label: 'Avg Order Value',
                      value: formatCurrencyNumber(customersQuery.data.summary.averageCustomerOrderValue),
                    },
                  ]}
                />
              </CardContent>
            </Card>
          )}

          {activeReport === 'production' && productionQuery.data && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Production Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MetricGrid
                  metrics={[
                    { label: 'Total Jobs', value: productionQuery.data.summary.totalJobs },
                    { label: 'Queued', value: productionQuery.data.summary.queuedJobs },
                    { label: 'Active', value: productionQuery.data.summary.activeJobs },
                    { label: 'Completed', value: productionQuery.data.summary.completedJobs },
                    { label: 'Overdue', value: productionQuery.data.summary.overdueJobs },
                    { label: 'SLA Compliance', value: `${productionQuery.data.summary.slaComplianceRate}%` },
                  ]}
                />
                <BreakdownTable
                  keyLabel="Stage"
                  rows={productionQuery.data.breakdown.byStage.map((s) => ({ label: s.stage, count: s.count }))}
                />
              </CardContent>
            </Card>
          )}

          {activeReport === 'inventory' && inventoryQuery.data && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Inventory Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MetricGrid
                  metrics={[
                    { label: 'Total Stock', value: inventoryQuery.data.summary.totalStock },
                    { label: 'Available', value: inventoryQuery.data.summary.totalAvailable },
                    { label: 'Reserved', value: inventoryQuery.data.summary.totalReserved },
                    { label: 'Damaged', value: inventoryQuery.data.summary.totalDamaged },
                    { label: 'Low Stock Items', value: inventoryQuery.data.summary.lowStockItemsCount },
                  ]}
                />
                <BreakdownTable
                  keyLabel="Movement Type"
                  rows={inventoryQuery.data.movementsBreakdown.map((m) => ({
                    label: m.type,
                    count: m.movementCount,
                  }))}
                />
              </CardContent>
            </Card>
          )}

          {activeReport === 'shipping' && shippingQuery.data && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MetricGrid
                  metrics={[
                    { label: 'Total Shipments', value: shippingQuery.data.summary.totalShipments },
                    { label: 'Delivered', value: shippingQuery.data.summary.deliveredShipments },
                    { label: 'In Transit', value: shippingQuery.data.summary.inTransitShipments },
                    { label: 'NDR Cases', value: shippingQuery.data.summary.ndrCount },
                    { label: 'RTO Cases', value: shippingQuery.data.summary.rtoCount },
                    { label: 'Delivery Success', value: `${shippingQuery.data.summary.deliverySuccessRate}%` },
                  ]}
                />
                <BreakdownTable
                  keyLabel="Courier"
                  rows={shippingQuery.data.breakdown.byCourier.map((c) => ({ label: c.courier, count: c.count }))}
                />
              </CardContent>
            </Card>
          )}

          {activeReport === 'profitability' && profitabilityQuery.data && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profitability Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MetricGrid
                  metrics={[
                    {
                      label: 'Gross Revenue',
                      value: formatCurrencyNumber(profitabilityQuery.data.summary.grossRevenue),
                    },
                    { label: 'Discounts', value: formatCurrencyNumber(profitabilityQuery.data.summary.discounts) },
                    { label: 'Refunds', value: formatCurrencyNumber(profitabilityQuery.data.summary.refunds) },
                    {
                      label: 'Net Revenue',
                      value: formatCurrencyNumber(profitabilityQuery.data.summary.netRevenue),
                    },
                    {
                      label: 'Product Cost',
                      value: formatCurrencyNumber(profitabilityQuery.data.summary.availableProductCost),
                    },
                    {
                      label: 'Gross Profit',
                      value: formatCurrencyNumber(profitabilityQuery.data.summary.grossProfit),
                    },
                    { label: 'Profit Margin', value: `${profitabilityQuery.data.summary.profitMargin}%` },
                  ]}
                />
                {profitabilityQuery.data.unavailableCostComponents.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Not included in this figure (not tracked yet):{' '}
                    {profitabilityQuery.data.unavailableCostComponents.join(', ').replaceAll(/([A-Z])/g, ' $1')}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
