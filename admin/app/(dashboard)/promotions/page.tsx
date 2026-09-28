'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { Promotion } from '@/lib/types/growth';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function PromotionsPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canManage = hasPermission('promotions.manage');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['promotions'],
    queryFn: () => apiClient.get<Promotion[]>('/growth/promotions'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch(`/growth/promotions/${id}`, { isActive }),
    onSuccess: () => {
      toast.success('Promotion updated');
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update promotion');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/growth/promotions/${id}`),
    onSuccess: () => {
      toast.success('Promotion deleted');
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete promotion');
    },
  });

  const columns: DataTableColumn<Promotion>[] = [
    { header: 'Name', cell: (row) => <span className="font-medium">{row.name}</span> },
    { header: 'Type', cell: (row) => row.promotionType.replaceAll('_', ' ') },
    {
      header: 'Value',
      cell: (row) => (row.discountType === 'PERCENTAGE' ? `${row.value}%` : `₹${row.value}`),
    },
    {
      header: 'Status',
      cell: (row) =>
        row.isActive ? (
          <Badge variant="outline" className="border-0 bg-emerald-100 font-medium text-emerald-800">
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="border-0 bg-muted font-medium">
            Inactive
          </Badge>
        ),
    },
    { header: 'Ends', cell: (row) => formatDate(row.endsAt) },
    ...(canManage
      ? [
          {
            header: '',
            cell: (row: Promotion) => (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={toggleMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMutation.mutate({ id: row.id, isActive: !row.isActive });
                  }}
                >
                  {row.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(row.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Promotions</h1>
          <p className="text-sm text-muted-foreground">Automatic discounts applied without a code.</p>
        </div>
        {canManage && (
          <Link href="/promotions/new" className={cn(buttonVariants({ variant: 'default' }))}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Promotion
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load promotions.</p>
      ) : (
        <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} emptyMessage="No promotions yet." />
      )}
    </div>
  );
}
