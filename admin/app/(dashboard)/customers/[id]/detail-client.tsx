'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { CustomerDetail } from '@/lib/types/customer';
import type { OrderListItem } from '@/lib/types/order';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { usePermission } from '@/lib/auth/use-permission';
import { useRouter } from 'next/navigation';

export function CustomerDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { hasPermission } = usePermission();

  const { data: customer, isLoading, isError } = useQuery({
    queryKey: ['customers', id],
    queryFn: () => apiClient.get<CustomerDetail>(`/customers/${id}`),
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['customers', id, 'orders'],
    queryFn: () => apiClient.get<OrderListItem[]>(`/customers/${id}/orders`),
    enabled: hasPermission('orders.view'),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !customer) {
    return <p className="text-sm text-destructive">Failed to load customer.</p>;
  }

  const orderColumns: DataTableColumn<OrderListItem>[] = [
    { header: 'Order #', cell: (row) => <span className="font-medium">{row.orderNumber}</span> },
    { header: 'Order Status', cell: (row) => <StatusBadge status={row.orderStatus} /> },
    { header: 'Payment', cell: (row) => <StatusBadge status={row.paymentStatus} /> },
    { header: 'Shipping', cell: (row) => <StatusBadge status={row.shippingStatus} /> },
    { header: 'Total', cell: (row) => formatCurrency(row.total) },
    { header: 'Created', cell: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/customers"
            className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Customers
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{customer.name}</h1>
        </div>
        {customer.isGuest ? (
          <Badge variant="outline" className="border-0 bg-muted font-medium">
            Guest
          </Badge>
        ) : (
          <Badge variant="outline" className="border-0 bg-emerald-100 font-medium text-emerald-800">
            Registered
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{customer.email ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span>{customer.phone ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Joined</span>
              <span>{formatDate(customer.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No saved addresses.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {customer.addresses.map((address) => (
                  <div key={address.id} className="rounded-md border p-3 text-sm">
                    <div className="mb-1 flex items-center gap-2 font-medium">
                      {address.label ?? 'Address'}
                      {address.isDefault && (
                        <Badge variant="outline" className="border-0 bg-blue-100 text-[10px] text-blue-800">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      <div>{address.line1}</div>
                      {address.line2 && <div>{address.line2}</div>}
                      <div>
                        {address.city}, {address.state} {address.postalCode}
                      </div>
                      <div>{address.country}</div>
                      {address.phone && <div>{address.phone}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {hasPermission('orders.view') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <DataTable
                columns={orderColumns}
                data={orders ?? []}
                getRowKey={(row) => row.id}
                onRowClick={(row) => router.push(`/orders/${row.id}`)}
                emptyMessage="No orders yet."
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
