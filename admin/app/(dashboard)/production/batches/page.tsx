'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { CreateBatchInput, Machine, ProductionBatch, ProductionJobListItem } from '@/lib/types/production';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { usePermission } from '@/lib/auth/use-permission';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const BATCHABLE_STATUSES = new Set(['QUEUED', 'IN_PROGRESS', 'ON_HOLD']);

export default function BatchesPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canManage = hasPermission('production.assign');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['batches'],
    queryFn: () => apiClient.get<ProductionBatch[]>('/production/batches'),
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [machineId, setMachineId] = useState<string>('');
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());

  const { data: jobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => apiClient.get<ProductionJobListItem[]>('/production/jobs'),
    enabled: createOpen,
  });
  const { data: machines } = useQuery({
    queryKey: ['machines'],
    queryFn: () => apiClient.get<Machine[]>('/production/machines'),
    enabled: createOpen,
  });

  const batchableJobs = (jobs ?? []).filter((j) => BATCHABLE_STATUSES.has(j.status));

  const resetForm = () => {
    setName('');
    setMachineId('');
    setSelectedJobIds(new Set());
  };

  const createMutation = useMutation({
    mutationFn: (input: CreateBatchInput) => apiClient.post('/production/batches', input),
    onSuccess: () => {
      toast.success('Batch created');
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      setCreateOpen(false);
      resetForm();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create batch');
    },
  });

  const toggleJob = (jobId: string) => {
    setSelectedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      machineId: machineId || undefined,
      productionJobIds: Array.from(selectedJobIds),
    });
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Production Batches</h1>
          <p className="text-sm text-muted-foreground">
            Jobs grouped for shared production runs (same product, material, or machine).
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Batch
          </Button>
        )}
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

      <Dialog open={createOpen} onOpenChange={(open) => {
        setCreateOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Batch</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batch-name">Name</Label>
              <Input id="batch-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch-machine">Machine (optional)</Label>
              <select
                id="batch-machine"
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">No machine assigned</option>
                {(machines ?? []).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.type})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Jobs to include ({selectedJobIds.size} selected)</Label>
              <div className="max-h-64 space-y-1 overflow-y-auto rounded-md border p-2">
                {batchableJobs.length === 0 ? (
                  <p className="p-2 text-sm text-muted-foreground">No queued, in-progress, or on-hold jobs available.</p>
                ) : (
                  batchableJobs.map((job) => (
                    <label key={job.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={selectedJobIds.has(job.id)}
                        onChange={() => toggleJob(job.id)}
                      />
                      <span className="font-mono text-xs">{job.id.slice(0, 8)}</span>
                      <StatusBadge status={job.status} />
                    </label>
                  ))
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending || selectedJobIds.size === 0}>
                {createMutation.isPending ? 'Creating…' : 'Create Batch'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
