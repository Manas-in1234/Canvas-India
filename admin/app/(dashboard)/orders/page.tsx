'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { OrderListItem } from '@/lib/types/order';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { formatCurrency, formatDate } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: () => apiClient.get<OrderListItem[]>('/orders'),
  });

  const columns: DataTableColumn<OrderListItem>[] = [
    { header: 'Order #', cell: (row) => <span className="font-medium">{row.orderNumber}</span> },
    { header: 'Customer', cell: (row) => row.customer.name },
    { header: 'Order Status', cell: (row) => <StatusBadge status={row.orderStatus} /> },
    { header: 'Payment', cell: (row) => <StatusBadge status={row.paymentStatus} /> },
    { header: 'Shipping', cell: (row) => <StatusBadge status={row.shippingStatus} /> },
    { header: 'Total', cell: (row) => formatCurrency(row.total) },
    { header: 'Created', cell: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">All orders placed on the storefront.</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load orders.</p>
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          getRowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/orders/${row.id}`)}
          emptyMessage="No orders yet."
        />
      )}
    </div>
  );
}
