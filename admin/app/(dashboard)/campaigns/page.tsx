'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { Campaign, CampaignStatus } from '@/lib/types/growth';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS: CampaignStatus[] = ['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'];

export default function CampaignsPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canManage = hasPermission('campaigns.manage');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => apiClient.get<Campaign[]>('/growth/campaigns'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CampaignStatus }) =>
      apiClient.post(`/growth/campaigns/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Campaign status updated');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update campaign status');
    },
  });

  const columns: DataTableColumn<Campaign>[] = [
    { header: 'Name', cell: (row) => <span className="font-medium">{row.name}</span> },
    { header: 'Code', cell: (row) => <span className="font-mono text-xs">{row.code}</span> },
    { header: 'Type', cell: (row) => row.type.replaceAll('_', ' ') },
    { header: 'Starts', cell: (row) => formatDate(row.startsAt) },
    ...(canManage
      ? [
          {
            header: 'Status',
            cell: (row: Campaign) => (
              <select
                value={row.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  statusMutation.mutate({ id: row.id, status: e.target.value as CampaignStatus })
                }
                className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ),
          },
        ]
      : [{ header: 'Status', cell: (row: Campaign) => row.status }]),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-sm text-muted-foreground">Marketing campaigns that group discounts and promotions.</p>
        </div>
        {canManage && (
          <Link href="/campaigns/new" className={cn(buttonVariants({ variant: 'default' }))}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Campaign
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load campaigns.</p>
      ) : (
        <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} emptyMessage="No campaigns yet." />
      )}
    </div>
  );
}
