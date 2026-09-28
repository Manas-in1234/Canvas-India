'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { ArtworkListItem } from '@/lib/types/artwork';
import { StatusBadge } from '@/components/status-badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CHECK_ICONS = {
  PASS: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  WARNING: <AlertTriangle className="h-4 w-4 text-amber-600" />,
  FAIL: <XCircle className="h-4 w-4 text-red-600" />,
};

export function ArtworkDetailClient({ id }: { id: string }) {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();

  const { data: artwork, isLoading, isError } = useQuery({
    queryKey: ['artwork', id],
    queryFn: () => apiClient.get<ArtworkListItem>(`/customization/artwork/${id}`),
  });

  const [reason, setReason] = useState('');

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['artwork', id] });
    queryClient.invalidateQueries({ queryKey: ['artwork'] });
  };

  const approveMutation = useMutation({
    mutationFn: () => apiClient.post(`/customization/artwork/${id}/approve`, { reason: reason || undefined }),
    onSuccess: () => {
      toast.success('Artwork approved');
      invalidate();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to approve artwork');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => apiClient.post(`/customization/artwork/${id}/reject`, { reason: reason || undefined }),
    onSuccess: () => {
      toast.success('Artwork rejected');
      invalidate();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to reject artwork');
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

  if (isError || !artwork) {
    return <p className="text-sm text-destructive">Failed to load artwork.</p>;
  }

  const canReview = hasPermission('artwork.approve') || hasPermission('artwork.reject');
  const isReviewable = artwork.status === 'PREFLIGHT_PASSED' || artwork.status === 'PREFLIGHT_WARNING' || artwork.status === 'PREFLIGHT_FAILED';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/artwork" className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Artwork Review
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight font-mono">{artwork.id.slice(0, 8)}</h1>
        </div>
        <StatusBadge status={artwork.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Design</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span>v{artwork.designVersion.versionNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Canvas Size</span>
            <span>
              {artwork.designVersion.canvasWidth} × {artwork.designVersion.canvasHeight} px
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Print Size</span>
            <span>
              {artwork.designVersion.targetWidthInches}&quot; × {artwork.designVersion.targetHeightInches}&quot;
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Submitted</span>
            <span>{formatDate(artwork.createdAt)}</span>
          </div>
          {artwork.reviewedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reviewed</span>
              <span>{formatDate(artwork.reviewedAt)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {artwork.preflightResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pre-flight Checks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(artwork.preflightResult).map(([check, result]) => (
              <div key={check} className="flex items-center justify-between rounded-md border p-2.5 text-sm">
                <div className="flex items-center gap-2">
                  {CHECK_ICONS[result.status]}
                  <span className="font-medium">{check.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
                {result.message && <span className="text-xs text-muted-foreground">{result.message}</span>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {canReview && isReviewable && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Reason (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex gap-2">
              {hasPermission('artwork.approve') && (
                <Button disabled={approveMutation.isPending} onClick={() => approveMutation.mutate()}>
                  Approve
                </Button>
              )}
              {hasPermission('artwork.reject') && (
                <Button
                  variant="destructive"
                  disabled={rejectMutation.isPending}
                  onClick={() => rejectMutation.mutate()}
                >
                  Reject
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
