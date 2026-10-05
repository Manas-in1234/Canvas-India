'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ArtworkListItem } from '@/lib/types/artwork';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { formatDate } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArtworkPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['artwork'],
    queryFn: () => apiClient.get<ArtworkListItem[]>('/customization/artwork'),
  });

  const columns: DataTableColumn<ArtworkListItem>[] = [
    { header: 'ID', cell: (row) => <span className="font-mono text-xs">{row.id.slice(0, 8)}</span> },
    { header: 'Version', cell: (row) => `v${row.designVersion.versionNumber}` },
    {
      header: 'Print Size',
      cell: (row) => `${row.designVersion.targetWidthInches}" × ${row.designVersion.targetHeightInches}"`,
    },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Submitted', cell: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Artwork Review</h1>
        <p className="text-sm text-muted-foreground">Customer designs awaiting pre-flight review.</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load artwork.</p>
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          getRowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/artwork/${row.id}`)}
          emptyMessage="No artwork submitted yet."
        />
      )}
    </div>
  );
}
