'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { CustomShapeListItem, ShapePriceMode } from '@/lib/types/shape';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

function ShapePreview({ shape }: { shape: CustomShapeListItem }) {
  if (shape.clipPathType === 'SVG_PATH') {
    return (
      <svg viewBox="0 0 1 1" className="w-full rounded-md border bg-muted">
        <path d={shape.clipPathValue} fill="currentColor" className="text-slate-800" />
      </svg>
    );
  }
  // CSS_FUNCTION shapes (inset()/circle()/polygon()/ellipse()) can't be
  // rendered as an SVG <path> — apply them as an actual CSS clip-path on a
  // filled block instead, which renders identically to how the storefront does it.
  return <div className="aspect-square w-full rounded-md border bg-slate-800" style={{ clipPath: shape.clipPathValue }} />;
}

export function ShapeDetailClient({ id }: { id: string }) {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canManage = hasPermission('shapes.create');

  const { data: shape, isLoading, isError } = useQuery({
    queryKey: ['shapes', id],
    queryFn: () => apiClient.get<CustomShapeListItem>(`/admin/shapes/${id}`),
  });

  const [reason, setReason] = useState('');
  const [name, setName] = useState('');
  const [priceMode, setPriceMode] = useState<ShapePriceMode>('FLAT');
  const [flatPrice, setFlatPrice] = useState('0');
  const [areaRatePerSqIn, setAreaRatePerSqIn] = useState('');

  useEffect(() => {
    if (!shape) return;
    setName(shape.name);
    setPriceMode(shape.priceMode);
    setFlatPrice(shape.flatPrice);
    setAreaRatePerSqIn(shape.areaRatePerSqIn ?? '');
  }, [shape]);

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

  const updateMetadataMutation = useMutation({
    mutationFn: () =>
      apiClient.patch(`/admin/shapes/${id}`, {
        name,
        priceMode,
        flatPrice: priceMode === 'FLAT' ? flatPrice : '0',
        areaRatePerSqIn: priceMode === 'AREA_RATE' ? areaRatePerSqIn : undefined,
      }),
    onSuccess: () => {
      toast.success('Shape updated');
      invalidate();
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to update shape'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: () => apiClient.patch(`/admin/shapes/${id}`, { status: shape?.status === 'REJECTED' ? 'APPROVED' : 'REJECTED' }),
    onSuccess: () => {
      toast.success(shape?.status === 'REJECTED' ? 'Shape re-enabled' : 'Shape disabled');
      invalidate();
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to update shape'),
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

  const isBuiltIn = shape.origin === 'BUILT_IN';

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
        <div className="flex items-center gap-2">
          <Badge variant="outline">{isBuiltIn ? 'Built-in' : 'Uploaded'}</Badge>
          <StatusBadge status={shape.status} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {!isBuiltIn && (
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
        )}

        <Card className={isBuiltIn ? 'md:col-span-2' : ''}>
          <CardHeader>
            <CardTitle className="text-base">Shape Outline</CardTitle>
          </CardHeader>
          <CardContent>
            <ShapePreview shape={shape} />
            <p className="mt-2 text-xs text-muted-foreground">
              This is exactly how the shape will clip the canvas in the customizer.
            </p>
          </CardContent>
        </Card>
      </div>

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Edit Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant={priceMode === 'FLAT' ? 'default' : 'outline'} onClick={() => setPriceMode('FLAT')}>
                Flat Price
              </Button>
              <Button
                type="button"
                size="sm"
                variant={priceMode === 'AREA_RATE' ? 'default' : 'outline'}
                onClick={() => setPriceMode('AREA_RATE')}
              >
                Area Rate (per sq.in)
              </Button>
            </div>
            {priceMode === 'FLAT' ? (
              <div className="space-y-2">
                <Label>Flat Price (Rs.)</Label>
                <Input type="number" step="0.01" value={flatPrice} onChange={(e) => setFlatPrice(e.target.value)} />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Rate per sq. inch (Rs.)</Label>
                <Input type="number" step="0.0001" value={areaRatePerSqIn} onChange={(e) => setAreaRatePerSqIn(e.target.value)} />
              </div>
            )}
            <div className="flex gap-2">
              <Button disabled={updateMetadataMutation.isPending} onClick={() => updateMetadataMutation.mutate()}>
                Save
              </Button>
              {shape.status !== 'PENDING' && (
                <Button variant="outline" disabled={toggleActiveMutation.isPending} onClick={() => toggleActiveMutation.mutate()}>
                  {shape.status === 'REJECTED' ? 'Re-enable Shape' : 'Disable Shape'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{isBuiltIn ? 'Added' : 'Uploaded'}</span>
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

      {!isBuiltIn && shape.status === 'PENDING' && (hasPermission('shapes.approve') || hasPermission('shapes.reject')) && (
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
