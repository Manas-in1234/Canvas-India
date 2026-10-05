'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { SalesAnalytics, CustomerAnalytics } from '@/lib/types/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrencyNumber } from '@/lib/format';
import { usePermission } from '@/lib/auth/use-permission';

function todayRangeParams(): string {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return `startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
}

export default function DashboardHomePage() {
  const { hasPermission } = usePermission();
  const canView = hasPermission('analytics.view');
  const range = todayRangeParams();

  const { data: sales, isLoading: salesLoading } = useQuery({
    queryKey: ['analytics', 'sales', 'today'],
    queryFn: () => apiClient.get<SalesAnalytics>(`/analytics/sales?${range}`),
    enabled: canView,
  });

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['analytics', 'customers', 'today'],
    queryFn: () => apiClient.get<CustomerAnalytics>(`/analytics/customers?${range}`),
    enabled: canView,
  });

  const isLoading = salesLoading || customersLoading;

  const cards = [
    {
      label: "Today's Revenue",
      value: sales ? formatCurrencyNumber(sales.summary.netSales) : null,
    },
    {
      label: "Today's Orders",
      value: sales ? String(sales.summary.totalOrders) : null,
    },
    {
      label: 'Average Order Value',
      value: sales ? formatCurrencyNumber(sales.summary.averageOrderValue) : null,
    },
    {
      label: 'New Customers',
      value: customers ? String(customers.summary.newCustomers) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Business overview for today.</p>
      </div>

      {!canView ? (
        <p className="text-sm text-muted-foreground">
          You don&rsquo;t have permission to view analytics.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Card key={card.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading || card.value === null ? (
                    <span className="text-muted-foreground/50">&mdash;</span>
                  ) : (
                    card.value
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
