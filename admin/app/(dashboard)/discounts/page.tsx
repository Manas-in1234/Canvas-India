'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { Discount } from '@/lib/types/growth';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { buttonVariants, Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function DiscountsPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canManage = hasPermission('discounts.manage');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['discounts'],
    queryFn: () => apiClient.get<Discount[]>('/growth/discounts'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch(`/growth/discounts/${id}`, { isActive }),
    onSuccess: () => {
      toast.success('Discount updated');
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update discount');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/growth/discounts/${id}`),
    onSuccess: () => {
      toast.success('Discount deleted');
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete discount');
    },
  });

  const columns: DataTableColumn<Discount>[] = [
    { header: 'Code', cell: (row) => <span className="font-mono font-medium">{row.code}</span> },
    {
      header: 'Value',
      cell: (row) => (row.discountType === 'PERCENTAGE' ? `${row.value}%` : `₹${row.value}`),
    },
    { header: 'Usage', cell: (row) => `${row.usageCount}${row.usageLimit ? ` / ${row.usageLimit}` : ''}` },
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
    { header: 'Expires', cell: (row) => (row.expiresAt ? formatDate(row.expiresAt) : 'Never') },
    ...(canManage
      ? [
          {
            header: '',
            cell: (row: Discount) => (
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
          <h1 className="text-2xl font-semibold tracking-tight">Discounts</h1>
          <p className="text-sm text-muted-foreground">Discount codes customers can apply at checkout.</p>
        </div>
        {canManage && (
          <Link href="/discounts/new" className={cn(buttonVariants({ variant: 'default' }))}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Discount
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load discounts.</p>
      ) : (
        <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} emptyMessage="No discounts yet." />
      )}
    </div>
  );
}
