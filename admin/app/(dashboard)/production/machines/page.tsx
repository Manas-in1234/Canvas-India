'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { CreateMachineInput, Machine, MachineStatus } from '@/lib/types/production';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
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

const emptyForm: CreateMachineInput = { name: '', type: '' };
const MACHINE_STATUSES: MachineStatus[] = ['AVAILABLE', 'RUNNING', 'MAINTENANCE', 'OFFLINE'];

export default function MachinesPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canManage = hasPermission('machines.manage');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['machines'],
    queryFn: () => apiClient.get<Machine[]>('/production/machines'),
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateMachineInput>(emptyForm);

  const createMutation = useMutation({
    mutationFn: (input: CreateMachineInput) => apiClient.post('/production/machines', input),
    onSuccess: () => {
      toast.success('Machine created');
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      setCreateOpen(false);
      setForm(emptyForm);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create machine');
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MachineStatus }) =>
      apiClient.patch(`/production/machines/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Machine status updated');
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update machine status');
    },
  });

  const columns: DataTableColumn<Machine>[] = [
    { header: 'Name', cell: (row) => <span className="font-medium">{row.name}</span> },
    { header: 'Type', cell: (row) => row.type },
    { header: 'Capacity', cell: (row) => row.capacity ?? '—' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    ...(canManage
      ? [
          {
            header: '',
            cell: (row: Machine) => (
              <select
                value={row.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  statusMutation.mutate({ id: row.id, status: e.target.value as MachineStatus })
                }
                className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
              >
                {MACHINE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ),
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
          <h1 className="text-2xl font-semibold tracking-tight">Machines</h1>
          <p className="text-sm text-muted-foreground">Production equipment and their status.</p>
        </div>
        {canManage && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Machine
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load machines.</p>
      ) : (
        <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} emptyMessage="No machines yet." />
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Machine</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
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
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                placeholder="e.g. Printer, Framing Station"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (units/hour, optional)</Label>
              <Input
                id="capacity"
                type="number"
                min="0"
                value={form.capacity ?? ''}
                onChange={(e) =>
                  setForm({ ...form, capacity: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating…' : 'Create Machine'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
