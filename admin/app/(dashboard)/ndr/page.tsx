'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { NdrCase } from '@/lib/types/shipping';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { formatDate } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';

export default function NdrPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['ndr-cases'],
    queryFn: () => apiClient.get<NdrCase[]>('/shipping/ndr'),
  });

  const columns: DataTableColumn<NdrCase>[] = [
    { header: 'Order #', cell: (row) => <span className="font-medium">{row.shipment.order.orderNumber}</span> },
    { header: 'AWB', cell: (row) => row.shipment.awbNumber ?? '—' },
    { header: 'Reason', cell: (row) => row.reason },
    { header: 'Attempt', cell: (row) => `#${row.attemptNumber}` },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Raised', cell: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">NDR Cases</h1>
        <p className="text-sm text-muted-foreground">Failed delivery attempts needing action.</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load NDR cases.</p>
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          getRowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/ndr/${row.id}`)}
          emptyMessage="No NDR cases."
        />
      )}
    </div>
  );
}
