'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { CustomShapeListItem } from '@/lib/types/shape';
import { StatusBadge } from '@/components/status-badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export function ShapeDetailClient({ id }: { id: string }) {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();

  const { data: shape, isLoading, isError } = useQuery({
    queryKey: ['shapes', id],
    queryFn: () => apiClient.get<CustomShapeListItem>(`/admin/shapes/${id}`),
  });

  const [reason, setReason] = useState('');

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['shapes', id] });
    queryClient.invalidateQueries({ queryKey: ['shapes'] });
  };

  const approveMutation = useMutation({
    mutationFn: () => apiClient.post(`/admin/shapes/${id}/approve`, { reason: reason || undefined }),
    onSuccess: () => {
      toast.success('Shape approved — now selectable in the customizer');
      invalidate();
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to approve shape'),
  });

  const rejectMutation = useMutation({
    mutationFn: () => apiClient.post(`/admin/shapes/${id}/reject`, { reason: reason || undefined }),
    onSuccess: () => {
      toast.success('Shape rejected');
      invalidate();
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to reject shape'),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !shape) {
    return <p className="text-sm text-destructive">Failed to load shape.</p>;
  }

  const canReview = hasPermission('shapes.approve') || hasPermission('shapes.reject');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/shapes" className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Shapes
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{shape.name}</h1>
        </div>
        <StatusBadge status={shape.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Source photo</CardTitle>
          </CardHeader>
          <CardContent>
            {shape.previewAssetId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${API_BASE_URL}/customization/assets/${shape.previewAssetId}/download-url`}
                alt={shape.name}
                className="w-full rounded-md border bg-muted object-contain"
              />
            ) : (
              <p className="text-sm text-muted-foreground">No preview available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Traced outline</CardTitle>
          </CardHeader>
          <CardContent>
            <svg viewBox="0 0 1 1" className="w-full rounded-md border bg-muted">
              <path d={shape.svgPathData} fill="currentColor" className="text-slate-800" />
            </svg>
            <p className="mt-2 text-xs text-muted-foreground">
              This is exactly how the shape will clip the canvas in the customizer — check the silhouette
              before approving.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Uploaded</span>
            <span>{formatDate(shape.createdAt)}</span>
          </div>
          {shape.reviewedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reviewed</span>
              <span>{formatDate(shape.reviewedAt)}</span>
            </div>
          )}
          {shape.rejectionReason && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rejection reason</span>
              <span>{shape.rejectionReason}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {canReview && shape.status === 'PENDING' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
            <div className="flex gap-2">
              {hasPermission('shapes.approve') && (
                <Button disabled={approveMutation.isPending} onClick={() => approveMutation.mutate()}>
                  Approve
                </Button>
              )}
              {hasPermission('shapes.reject') && (
                <Button variant="destructive" disabled={rejectMutation.isPending} onClick={() => rejectMutation.mutate()}>
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
