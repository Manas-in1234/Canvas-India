'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, ApiError } from '@/lib/api-client';
import type { AbandonedCart } from '@/lib/types/growth';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AbandonedCartsPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canManage = hasPermission('abandoned_carts.manage');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['abandoned-carts'],
    queryFn: () => apiClient.get<AbandonedCart[]>('/growth/abandoned-carts'),
  });

  const notifyMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/growth/abandoned-carts/${id}/notify`, {}),
    onSuccess: () => {
      toast.success('Recovery notification sent');
      queryClient.invalidateQueries({ queryKey: ['abandoned-carts'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to send notification');
    },
  });

  const columns: DataTableColumn<AbandonedCart>[] = [
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Reminders Sent', cell: (row) => row.reminderCount },
    {
      header: 'Last Notified',
      cell: (row) => (row.lastNotificationSentAt ? formatDate(row.lastNotificationSentAt) : 'Never'),
    },
    { header: 'Detected', cell: (row) => formatDate(row.createdAt) },
    ...(canManage
      ? [
          {
            header: '',
            cell: (row: AbandonedCart) =>
              row.status !== 'RECOVERED' && row.status !== 'EXPIRED' ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={notifyMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    notifyMutation.mutate(row.id);
                  }}
                >
                  Send Reminder
                </Button>
              ) : null,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Abandoned Carts</h1>
        <p className="text-sm text-muted-foreground">Carts left without checkout, and recovery reminders sent.</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load abandoned carts.</p>
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          getRowKey={(row) => row.id}
          emptyMessage="No abandoned carts detected."
        />
      )}
    </div>
  );
}
