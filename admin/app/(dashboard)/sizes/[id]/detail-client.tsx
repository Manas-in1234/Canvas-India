'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { SizePresetListItem } from '@/lib/types/size-preset';
import { usePermission } from '@/lib/auth/use-permission';
import { useRecordId } from '@/lib/use-record-id';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SizeFormState {
  label: string;
  dimensionsSummary: string;
  widthInches: string;
  heightInches: string;
  acrylicPrice: string;
  canvasPrice: string;
  shapeId: string;
  category: string;
}

const EMPTY_FORM: SizeFormState = {
  label: '',
  dimensionsSummary: '',
  widthInches: '',
  heightInches: '',
  acrylicPrice: '0',
  canvasPrice: '0',
  shapeId: '',
  category: '',
};

export function SizesDetailClient({ productTypeId: initialProductTypeId }: { productTypeId: string }) {
  const productTypeId = useRecordId(initialProductTypeId);
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canManage = hasPermission('size_presets.manage');

  const { data: allPresets, isLoading, isError } = useQuery({
    queryKey: ['size-presets', productTypeId],
    enabled: !!productTypeId && productTypeId !== 'placeholder',
    queryFn: () => apiClient.get<SizePresetListItem[]>(`/admin/size-presets?productTypeId=${encodeURIComponent(productTypeId)}`),
  });

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<SizeFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['size-presets', productTypeId] });
    queryClient.invalidateQueries({ queryKey: ['size-presets'] });
  };

  const toPayload = (f: SizeFormState) => ({
    productTypeId,
    label: f.label,
    dimensionsSummary: f.dimensionsSummary,
    widthInches: f.widthInches || '0',
    heightInches: f.heightInches || '0',
    acrylicPrice: f.acrylicPrice || '0',
    canvasPrice: f.canvasPrice || '0',
    shapeId: f.shapeId || undefined,
    category: f.category || undefined,
  });

  const createMutation = useMutation({
    mutationFn: () => apiClient.post('/admin/size-presets', toPayload(form)),
    onSuccess: () => {
      toast.success('Size added');
      invalidate();
      setAddOpen(false);
      setForm(EMPTY_FORM);
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to add size'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReturnType<typeof toPayload> }) =>
      apiClient.patch(`/admin/size-presets/${id}`, payload),
    onSuccess: () => {
      toast.success('Size updated');
      invalidate();
      setEditingId(null);
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to update size'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/size-presets/${id}`),
    onSuccess: () => {
      toast.success('Size deleted');
      invalidate();
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to delete size'),
  });

  const startEdit = (preset: SizePresetListItem) => {
    setEditingId(preset.id);
    setForm({
      label: preset.label,
      dimensionsSummary: preset.dimensionsSummary,
      widthInches: preset.widthInches,
      heightInches: preset.heightInches,
      acrylicPrice: preset.acrylicPrice,
      canvasPrice: preset.canvasPrice,
      shapeId: preset.shapeId ?? '',
      category: preset.category ?? '',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !allPresets) {
    return <p className="text-sm text-destructive">Failed to load sizes.</p>;
  }

  const presets = [...allPresets].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/sizes" className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sizes
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight font-mono">{productTypeId}</h1>
        </div>
        {canManage && (
          <Dialog
            open={addOpen}
            onOpenChange={(open) => {
              setAddOpen(open);
              if (open) setForm(EMPTY_FORM);
            }}
          >
            <DialogTrigger
              render={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Size
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a size to {productTypeId}</DialogTitle>
              </DialogHeader>
              <SizeForm form={form} onChange={setForm} />
              <DialogFooter>
                <Button disabled={!form.label.trim() || createMutation.isPending} onClick={() => createMutation.mutate()}>
                  Add Size
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-3">
        {presets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sizes for this product type yet.</p>
        ) : (
          presets.map((preset) => (
            <Card key={preset.id}>
              <CardContent className="space-y-3 p-4">
                {editingId === preset.id ? (
                  <>
                    <SizeForm form={form} onChange={setForm} />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ id: preset.id, payload: toPayload(form) })}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 font-medium">
                        {preset.label}
                        {preset.shapeId && <Badge variant="outline">{preset.shapeId}</Badge>}
                        {preset.category && <Badge variant="outline">{preset.category}</Badge>}
                        {preset.panelsCount && preset.panelsCount > 1 && <Badge variant="outline">{preset.panelsCount} panels</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">{preset.dimensionsSummary}</div>
                      <div className="text-xs text-muted-foreground">
                        Acrylic Rs.{preset.acrylicPrice} · Canvas Rs.{preset.canvasPrice}
                      </div>
                    </div>
                    {canManage && (
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(preset)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(preset.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function SizeForm({ form, onChange }: { form: SizeFormState; onChange: (f: SizeFormState) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2 space-y-2">
        <Label>Label</Label>
        <Input value={form.label} onChange={(e) => onChange({ ...form, label: e.target.value })} />
      </div>
      <div className="col-span-2 space-y-2">
        <Label>Dimensions Summary</Label>
        <Input
          value={form.dimensionsSummary}
          placeholder='e.g. 10" x 10"'
          onChange={(e) => onChange({ ...form, dimensionsSummary: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Width (inches)</Label>
        <Input type="number" step="0.01" value={form.widthInches} onChange={(e) => onChange({ ...form, widthInches: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Height (inches)</Label>
        <Input type="number" step="0.01" value={form.heightInches} onChange={(e) => onChange({ ...form, heightInches: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Acrylic Price (Rs.)</Label>
        <Input type="number" step="0.01" value={form.acrylicPrice} onChange={(e) => onChange({ ...form, acrylicPrice: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Canvas Price (Rs.)</Label>
        <Input type="number" step="0.01" value={form.canvasPrice} onChange={(e) => onChange({ ...form, canvasPrice: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Shape ID (optional)</Label>
        <Input value={form.shapeId} placeholder="e.g. shape-heart" onChange={(e) => onChange({ ...form, shapeId: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Category (optional)</Label>
        <Input value={form.category} placeholder="e.g. RECOMMENDED" onChange={(e) => onChange({ ...form, category: e.target.value })} />
      </div>
    </div>
  );
}
