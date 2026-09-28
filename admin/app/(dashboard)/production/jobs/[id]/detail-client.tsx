'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { ProductionJobDetail, ProductionJobStage, QcResultInput } from '@/lib/types/production';
import { StatusBadge } from '@/components/status-badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const QC_FIELDS: { key: keyof QcResultInput; label: string }[] = [
  { key: 'printQuality', label: 'Print Quality' },
  { key: 'colorQuality', label: 'Color Quality' },
  { key: 'alignment', label: 'Alignment' },
  { key: 'materialQuality', label: 'Material Quality' },
  { key: 'assemblyQuality', label: 'Assembly Quality' },
  { key: 'packagingQuality', label: 'Packaging Quality' },
];

const defaultQc: QcResultInput = {
  printQuality: 'PASS',
  colorQuality: 'PASS',
  alignment: 'PASS',
  materialQuality: 'PASS',
  assemblyQuality: 'PASS',
  packagingQuality: 'PASS',
};

export function ProductionJobDetailClient({ id }: { id: string }) {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ['production', 'jobs', id],
    queryFn: () => apiClient.get<ProductionJobDetail>(`/production/jobs/${id}`),
  });

  const [qcStageId, setQcStageId] = useState<string | null>(null);
  const [qcResult, setQcResult] = useState<QcResultInput>(defaultQc);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['production', 'jobs', id] });
    queryClient.invalidateQueries({ queryKey: ['production', 'jobs'] });
    queryClient.invalidateQueries({ queryKey: ['production', 'board'] });
  };

  const startMutation = useMutation({
    mutationFn: (stageId: string) => apiClient.post(`/production/stages/${stageId}/start`, {}),
    onSuccess: () => {
      toast.success('Stage started');
      invalidate();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to start stage');
    },
  });

  const completeMutation = useMutation({
    mutationFn: (stageId: string) => apiClient.post(`/production/stages/${stageId}/complete`, {}),
    onSuccess: () => {
      toast.success('Stage completed');
      invalidate();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to complete stage');
    },
  });

  const qcMutation = useMutation({
    mutationFn: () => apiClient.post(`/production/stages/${qcStageId}/qc`, qcResult),
    onSuccess: () => {
      toast.success('QC result recorded');
      setQcStageId(null);
      setQcResult(defaultQc);
      invalidate();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to record QC result');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !job) {
    return <p className="text-sm text-destructive">Failed to load production job.</p>;
  }

  const canAssign = hasPermission('production.assign');
  const canComplete = hasPermission('production.complete');
  const canQc = hasPermission('production.qc');

  const renderStageActions = (stage: ProductionJobStage) => {
    if (stage.status === 'PENDING' && canAssign) {
      return (
        <Button size="sm" disabled={startMutation.isPending} onClick={() => startMutation.mutate(stage.id)}>
          Start
        </Button>
      );
    }
    if (stage.status === 'IN_PROGRESS' && stage.stage === 'QC' && canQc) {
      return (
        <Button size="sm" onClick={() => setQcStageId(stage.id)}>
          Record QC
        </Button>
      );
    }
    if (stage.status === 'IN_PROGRESS' && canComplete) {
      return (
        <Button size="sm" disabled={completeMutation.isPending} onClick={() => completeMutation.mutate(stage.id)}>
          Complete
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/production/jobs"
            className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Production Jobs
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight font-mono">{job.id.slice(0, 8)}</h1>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pipeline Stages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {job.stages.map((stage) => (
            <div key={stage.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stage.stage.replaceAll('_', ' ')}</span>
                  <StatusBadge status={stage.status} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {stage.slaDueAt && <span>Due {formatDate(stage.slaDueAt)} · </span>}
                  {stage.startedAt && <span>Started {formatDate(stage.startedAt)} · </span>}
                  {stage.completedAt && <span>Completed {formatDate(stage.completedAt)}</span>}
                </div>
                {stage.failureReason && (
                  <div className="mt-1 text-xs text-destructive">Failure: {stage.failureReason}</div>
                )}
              </div>
              {renderStageActions(stage)}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {job.events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events recorded.</p>
          ) : (
            <ol className="space-y-3 border-l pl-4">
              {job.events.map((event) => (
                <li key={event.id} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary" />
                  <div className="text-sm font-medium">{event.type.replaceAll('_', ' ')}</div>
                  {event.message && <div className="text-sm text-muted-foreground">{event.message}</div>}
                  <div className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      <Dialog open={qcStageId !== null} onOpenChange={(open) => !open && setQcStageId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record QC Result</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {QC_FIELDS.map((field) => (
              <div key={field.key} className="flex items-center justify-between">
                <span className="text-sm">{field.label}</span>
                <select
                  value={qcResult[field.key]}
                  onChange={(e) =>
                    setQcResult({ ...qcResult, [field.key]: e.target.value as QcResultInput[typeof field.key] })
                  }
                  className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
                >
                  <option value="PASS">Pass</option>
                  <option value="FAIL">Fail</option>
                  <option value="REWORK">Rework</option>
                </select>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button disabled={qcMutation.isPending} onClick={() => qcMutation.mutate()}>
              {qcMutation.isPending ? 'Saving…' : 'Submit QC Result'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
