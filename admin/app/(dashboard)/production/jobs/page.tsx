'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ProductionJobListItem } from '@/lib/types/production';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { formatDate } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductionJobsPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['production', 'jobs'],
    queryFn: () => apiClient.get<ProductionJobListItem[]>('/production/jobs'),
  });

  const columns: DataTableColumn<ProductionJobListItem>[] = [
    { header: 'Job ID', cell: (row) => <span className="font-mono text-xs">{row.id.slice(0, 8)}</span> },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Current Stage',
      cell: (row) => {
        const active = row.stages.find((s) => s.status === 'IN_PROGRESS' || s.status === 'PENDING');
        return active ? active.stage.replaceAll('_', ' ') : '—';
      },
    },
    { header: 'Rework Count', cell: (row) => row.reworkCount },
    { header: 'Created', cell: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Production Jobs</h1>
        <p className="text-sm text-muted-foreground">All jobs across the pipeline.</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load production jobs.</p>
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          getRowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/production/jobs/${row.id}`)}
          emptyMessage="No production jobs yet."
        />
      )}
    </div>
  );
}
