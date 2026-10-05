'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { CreateRoleInput, Permission } from '@/lib/types/admin-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function groupPermissions(permissions: Permission[]): Record<string, Permission[]> {
  const groups: Record<string, Permission[]> = {};
  for (const permission of permissions) {
    const [group] = permission.key.split('.');
    groups[group] ??= [];
    groups[group].push(permission);
  }
  return groups;
}

export default function NewRolePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const { data: allPermissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => apiClient.get<Permission[]>('/roles/permissions'),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateRoleInput) => apiClient.post('/roles', input),
    onSuccess: () => {
      toast.success('Role created');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      router.push('/roles');
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create role');
    },
  });

  const toggle = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      description: description || undefined,
      permissionKeys: Array.from(selectedKeys),
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
        <h1 className="text-2xl font-semibold tracking-tight">New Role</h1>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Role Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              {permissionsLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(groups).map(([group, permissions]) => (
                    <div key={group} className="space-y-1.5">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {group}
                      </h3>
                      {permissions.map((permission) => (
                        <label key={permission.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedKeys.has(permission.key)}
                            onChange={() => toggle(permission.key)}
                            className="h-4 w-4 rounded border-input"
                          />
                          {permission.key}
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating…' : 'Create Role'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
