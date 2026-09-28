'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { Permission, Role } from '@/lib/types/admin-user';
import { usePermission } from '@/lib/auth/use-permission';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Groups permissions by the part before the first "." (e.g. "orders.view" ->
// "orders") so the checklist reads as sections instead of one long flat list.
function groupPermissions(permissions: Permission[]): Record<string, Permission[]> {
  const groups: Record<string, Permission[]> = {};
  for (const permission of permissions) {
    const [group] = permission.key.split('.');
    groups[group] ??= [];
    groups[group].push(permission);
  }
  return groups;
}

export default function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canManage = hasPermission('roles.manage');

  const { data: role, isLoading: roleLoading, isError } = useQuery({
    queryKey: ['roles', id],
    queryFn: () => apiClient.get<Role>(`/roles/${id}`),
  });

  const { data: allPermissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => apiClient.get<Permission[]>('/roles/permissions'),
  });

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (role) {
      setSelectedKeys(new Set(role.permissions.map((p) => p.permission.key)));
    }
  }, [role]);

  const saveMutation = useMutation({
    mutationFn: (permissionKeys: string[]) => apiClient.put(`/roles/${id}/permissions`, { permissionKeys }),
    onSuccess: () => {
      toast.success('Permissions updated');
      queryClient.invalidateQueries({ queryKey: ['roles', id] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update permissions');
    },
  });

  const isLoading = roleLoading || permissionsLoading;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !role) {
    return <p className="text-sm text-destructive">Failed to load role.</p>;
  }

  const toggle = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const groups = groupPermissions(allPermissions ?? []);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/roles" className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Roles
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{role.name}</h1>
        {role.description && <p className="text-sm text-muted-foreground">{role.description}</p>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groups).map(([group, permissions]) => (
              <div key={group} className="space-y-1.5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group}</h3>
                {permissions.map((permission) => (
                  <label key={permission.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedKeys.has(permission.key)}
                      onChange={() => toggle(permission.key)}
                      disabled={!canManage}
                      className="h-4 w-4 rounded border-input"
                    />
                    {permission.key}
                  </label>
                ))}
              </div>
            ))}
          </div>

          {canManage && (
            <Button
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate(Array.from(selectedKeys))}
            >
              {saveMutation.isPending ? 'Saving…' : 'Save Permissions'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
