'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { AdminUserListItem } from '@/lib/types/admin-user';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function UsersPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canManage = hasPermission('users.manage');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => apiClient.get<AdminUserListItem[]>('/users'),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/users/${id}/deactivate`),
    onSuccess: () => {
      toast.success('User deactivated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to deactivate user');
    },
  });

  const columns: DataTableColumn<AdminUserListItem>[] = [
    { header: 'Name', cell: (row) => <span className="font-medium">{row.name}</span> },
    { header: 'Email', cell: (row) => row.email },
    { header: 'Role', cell: (row) => row.role.name },
    {
      header: 'Status',
      cell: (row) =>
        row.isActive ? (
          <Badge variant="outline" className="border-0 bg-emerald-100 font-medium text-emerald-800">
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="border-0 bg-muted font-medium">
            Deactivated
          </Badge>
        ),
    },
    { header: 'Joined', cell: (row) => formatDate(row.createdAt) },
    ...(canManage
      ? [
          {
            header: '',
            cell: (row: AdminUserListItem) =>
              row.isActive ? (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deactivateMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    deactivateMutation.mutate(row.id);
                  }}
                >
                  Deactivate
                </Button>
              ) : null,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Users</h1>
          <p className="text-sm text-muted-foreground">People with access to this dashboard.</p>
        </div>
        {canManage && (
          <Link href="/users/new" className={cn(buttonVariants({ variant: 'default' }))}>
            <Plus className="mr-1.5 h-4 w-4" />
            New User
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load users.</p>
      ) : (
        <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} emptyMessage="No admin users yet." />
      )}
    </div>
  );
}
