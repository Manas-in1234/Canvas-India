'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { Role } from '@/lib/types/admin-user';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { usePermission } from '@/lib/auth/use-permission';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function RolesPage() {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const canManage = hasPermission('roles.manage');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['roles'],
    queryFn: () => apiClient.get<Role[]>('/roles'),
  });

  const columns: DataTableColumn<Role>[] = [
    { header: 'Name', cell: (row) => <span className="font-medium">{row.name}</span> },
    { header: 'Description', cell: (row) => row.description ?? '—' },
    { header: 'Permissions', cell: (row) => row.permissions.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
          <p className="text-sm text-muted-foreground">Permission sets assigned to admin users.</p>
        </div>
        {canManage && (
          <Link href="/roles/new" className={cn(buttonVariants({ variant: 'default' }))}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Role
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load roles.</p>
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          getRowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/roles/${row.id}`)}
          emptyMessage="No roles yet."
        />
      )}
    </div>
  );
}
