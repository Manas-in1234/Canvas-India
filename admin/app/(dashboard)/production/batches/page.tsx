'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ProductionBatch } from '@/lib/types/production';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';

export default function BatchesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['batches'],
    queryFn: () => apiClient.get<ProductionBatch[]>('/production/batches'),
  });

  const columns: DataTableColumn<ProductionBatch>[] = [
    { header: 'Name', cell: (row) => <span className="font-medium">{row.name}</span> },
    { header: 'Jobs', cell: (row) => row.jobs.length },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant="outline" className="border-0 bg-muted font-medium">
          {row.status}
        </Badge>
      ),
    },
    { header: 'Created', cell: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Production Batches</h1>
        <p className="text-sm text-muted-foreground">
          Jobs grouped for shared production runs (same product, material, or machine).
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load batches.</p>
      ) : (
        <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} emptyMessage="No batches yet." />
      )}
    </div>
  );
}
