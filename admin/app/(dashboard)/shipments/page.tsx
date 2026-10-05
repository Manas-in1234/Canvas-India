'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, ApiError } from '@/lib/api-client';
import type { ShipmentListItem } from '@/lib/types/shipping';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShipmentsPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['shipments'],
    queryFn: () => apiClient.get<ShipmentListItem[]>('/shipping'),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/shipping/shipments/${id}`),
    onSuccess: () => {
      toast.success('Shipment cancelled');
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to cancel shipment');
    },
  });

  const canCancel = hasPermission('shipping.cancel');
  const cancellableStatuses = new Set(['READY', 'PICKED_UP']);

  const columns: DataTableColumn<ShipmentListItem>[] = [
    { header: 'Order #', cell: (row) => <span className="font-medium">{row.order.orderNumber}</span> },
    { header: 'AWB', cell: (row) => row.awbNumber ?? '—' },
    { header: 'Courier', cell: (row) => row.courierProvider },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Created', cell: (row) => formatDate(row.createdAt) },
    ...(canCancel
      ? [
          {
            header: '',
            cell: (row: ShipmentListItem) =>
              cancellableStatuses.has(row.status) ? (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={cancelMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelMutation.mutate(row.id);
                  }}
                >
                  Cancel
                </Button>
              ) : null,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Shipments</h1>
        <p className="text-sm text-muted-foreground">All shipments dispatched for orders.</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load shipments.</p>
      ) : (
        <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} emptyMessage="No shipments yet." />
      )}
    </div>
  );
}
