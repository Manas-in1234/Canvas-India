'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { CreateWarehouseInput, Warehouse } from '@/lib/types/inventory';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/lib/auth/use-permission';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const emptyForm: CreateWarehouseInput = {
  name: '',
  code: '',
  addressLine1: '',
  city: '',
  state: '',
  postalCode: '',
};

export default function WarehousesPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canManage = hasPermission('warehouses.manage');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => apiClient.get<Warehouse[]>('/warehouses'),
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateWarehouseInput>(emptyForm);

  const createMutation = useMutation({
    mutationFn: (input: CreateWarehouseInput) => apiClient.post('/warehouses', input),
    onSuccess: () => {
      toast.success('Warehouse created');
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      setCreateOpen(false);
      setForm(emptyForm);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create warehouse');
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/warehouses/${id}`),
    onSuccess: () => {
      toast.success('Warehouse deactivated');
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to deactivate warehouse');
    },
  });

  const columns: DataTableColumn<Warehouse>[] = [
    { header: 'Name', cell: (row) => <span className="font-medium">{row.name}</span> },
    { header: 'Code', cell: (row) => <span className="font-mono text-xs">{row.code}</span> },
    { header: 'City', cell: (row) => `${row.city}, ${row.state}` },
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
    ...(canManage
      ? [
          {
            header: '',
            cell: (row: Warehouse) =>
              row.isActive ? (
                <Button
                  variant="outline"
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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Warehouses</h1>
          <p className="text-sm text-muted-foreground">Fulfillment locations orders ship from.</p>
        </div>
        {canManage && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Warehouse
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load warehouses.</p>
      ) : (
        <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} emptyMessage="No warehouses yet." />
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Warehouse</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressLine1">Address</Label>
              <Input
                id="addressLine1"
                value={form.addressLine1}
                onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">PIN Code</Label>
                <Input
                  id="postalCode"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating…' : 'Create Warehouse'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
