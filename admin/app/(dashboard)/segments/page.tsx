'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { CustomerSegment } from '@/lib/types/growth';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/lib/auth/use-permission';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function SegmentsPage() {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const canManage = hasPermission('segments.manage');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['segments'],
    queryFn: () => apiClient.get<CustomerSegment[]>('/growth/segments'),
  });

  const columns: DataTableColumn<CustomerSegment>[] = [
    { header: 'Name', cell: (row) => <span className="font-medium">{row.name}</span> },
    { header: 'Type', cell: (row) => row.type },
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customer Segments</h1>
          <p className="text-sm text-muted-foreground">Groups of customers used for targeted discounts and campaigns.</p>
        </div>
        {canManage && (
          <Link href="/segments/new" className={cn(buttonVariants({ variant: 'default' }))}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Segment
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load segments.</p>
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          getRowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/segments/${row.id}`)}
          emptyMessage="No segments yet."
        />
      )}
    </div>
  );
}
