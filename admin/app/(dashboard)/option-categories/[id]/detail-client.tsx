'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { OptionCategoryItem, OptionCategoryListItem, OptionPriceMode } from '@/lib/types/option-category';
import { usePermission } from '@/lib/auth/use-permission';
import { useRecordId } from '@/lib/use-record-id';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ItemFormState {
  label: string;
  description: string;
  imageUrl: string;
  priceMode: OptionPriceMode;
  flatPrice: string;
  areaRatePerSqIn: string;
  extraHex: string;
  extraWidthPx: string;
  extraColor: string;
  extraBorderColor: string;
  extraBorderWidth: string;
}

const EMPTY_FORM: ItemFormState = {
  label: '',
  description: '',
  imageUrl: '',
  priceMode: 'FLAT',
  flatPrice: '0',
  areaRatePerSqIn: '',
  extraHex: '#FFFFFF',
  extraWidthPx: '0',
  extraColor: '#000000',
  extraBorderColor: 'transparent',
  extraBorderWidth: '0',
};

/**
 * Which `extras` fields a category's items actually carry, and how to
 * render/edit them — these exact field names are what
 * CanvasCustomizerPage.tsx reads per baseKey: `hex` for border_color and
 * backgrounds' swatches, `widthPx` for border_width's line thickness,
 * `color` for frame's swatch, and `borderColor`+`borderWidth` together for
 * wrap_style's edge preview.
 */
type ExtrasFieldKey = 'extraHex' | 'extraWidthPx' | 'extraColor' | 'extraBorderColor' | 'extraBorderWidth';
const EXTRAS_FIELD_CONFIG: Record<ExtrasFieldKey, { jsonKey: string; label: string; type: 'color' | 'number' }> = {
  extraHex: { jsonKey: 'hex', label: 'Swatch color', type: 'color' },
  extraWidthPx: { jsonKey: 'widthPx', label: 'Width (px)', type: 'number' },
  extraColor: { jsonKey: 'color', label: 'Frame color', type: 'color' },
  extraBorderColor: { jsonKey: 'borderColor', label: 'Edge color', type: 'color' },
  extraBorderWidth: { jsonKey: 'borderWidth', label: 'Edge width (px)', type: 'number' },
};

function extrasFieldsFor(baseKey: string): ExtrasFieldKey[] {
  switch (baseKey) {
    case 'border_color':
    case 'backgrounds':
      return ['extraHex'];
    case 'border_width':
      return ['extraWidthPx'];
    case 'frame':
      return ['extraColor'];
    case 'wrap_style':
      return ['extraBorderColor', 'extraBorderWidth'];
    default:
      return [];
  }
}

/** Small swatch/preview shown in the list and form, mirroring what the
 * storefront customizer actually renders for this item. */
function ExtrasPreview({ baseKey, extras }: { baseKey: string; extras: Record<string, unknown> | null }) {
  if (baseKey === 'border_color' || baseKey === 'backgrounds') {
    const hex = (extras?.hex as string) || '#FFFFFF';
    return (
      <div
        className="h-10 w-10 shrink-0 rounded-full border border-stone-300"
        style={hex === 'transparent' ? { backgroundImage: 'repeating-conic-gradient(#d6d3d1 0% 25%, #f5f5f4 0% 50%)', backgroundSize: '6px 6px' } : { backgroundColor: hex }}
      />
    );
  }
  if (baseKey === 'frame') {
    const color = (extras?.color as string) || '#000000';
    return <div className="h-10 w-10 shrink-0 rounded border-4" style={{ borderColor: color }} />;
  }
  if (baseKey === 'border_width') {
    const widthPx = Number(extras?.widthPx) || 0;
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border bg-muted">
        <div className="bg-foreground/70" style={{ width: Math.max(2, Math.min(widthPx, 16)), height: 20 }} />
      </div>
    );
  }
  if (baseKey === 'wrap_style') {
    const borderColor = (extras?.borderColor as string) || 'transparent';
    const borderWidth = Number(extras?.borderWidth) || 0;
    return (
      <div className="h-10 w-10 shrink-0 rounded border border-stone-300 bg-sky-100 p-1">
        <div className="h-full w-full rounded-sm bg-sky-400" style={{ border: borderWidth > 0 ? `${Math.min(borderWidth / 2, 6)}px solid ${borderColor}` : undefined }} />
      </div>
    );
  }
  return null;
}

export function OptionCategoryDetailClient({ id: initialId }: { id: string }) {
  const id = useRecordId(initialId);
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canManage = hasPermission('option_catalog.manage');

  const { data: category, isLoading, isError } = useQuery({
    queryKey: ['option-categories', id],
    enabled: !!id && id !== 'placeholder',
    queryFn: () => apiClient.get<OptionCategoryListItem>(`/admin/option-categories/${id}`),
  });

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<ItemFormState>(EMPTY_FORM);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['option-categories', id] });
    queryClient.invalidateQueries({ queryKey: ['option-categories'] });
  };

  const toPayload = (f: ItemFormState) => {
    const fields = extrasFieldsFor(category?.baseKey ?? '');
    const extras: Record<string, unknown> | undefined = fields.length
      ? Object.fromEntries(
          fields.map((key) => {
            const { jsonKey, type } = EXTRAS_FIELD_CONFIG[key];
            return [jsonKey, type === 'number' ? Number(f[key]) || 0 : f[key]];
          }),
        )
      : undefined;
    return {
      label: f.label,
      description: f.description || undefined,
      imageUrl: f.imageUrl || undefined,
      priceMode: f.priceMode,
      flatPrice: f.priceMode === 'FLAT' ? (f.flatPrice || '0') : '0',
      areaRatePerSqIn: f.priceMode === 'AREA_RATE' ? (f.areaRatePerSqIn || '0') : undefined,
      ...(extras ? { extras } : {}),
    };
  };

  const createMutation = useMutation({
    mutationFn: () => apiClient.post(`/admin/option-categories/${id}/items`, toPayload(form)),
    onSuccess: () => {
      toast.success('Item added');
      invalidate();
      setAddOpen(false);
      setForm(EMPTY_FORM);
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to add item'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: ReturnType<typeof toPayload> }) =>
      apiClient.patch(`/admin/option-categories/items/${itemId}`, payload),
    onSuccess: () => {
      toast.success('Item updated');
      invalidate();
      setEditingItemId(null);
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to update item'),
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId: string) => apiClient.delete(`/admin/option-categories/items/${itemId}`),
    onSuccess: () => {
      toast.success('Item deleted');
      invalidate();
      setPendingDeleteId(null);
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to delete item'),
  });

  const reorderMutation = useMutation({
    mutationFn: (itemIds: string[]) => apiClient.put(`/admin/option-categories/${id}/items/reorder`, { itemIds }),
    onSuccess: () => invalidate(),
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to reorder items'),
  });

  const moveItem = (index: number, direction: -1 | 1) => {
    if (!category) return;
    const items = [...category.items];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    [items[index], items[targetIndex]] = [items[targetIndex], items[index]];
    reorderMutation.mutate(items.map((i) => i.id));
  };

  const startEdit = (item: OptionCategoryItem) => {
    setEditingItemId(item.id);
    const fields = extrasFieldsFor(category?.baseKey ?? '');
    const extrasOverrides = Object.fromEntries(
      fields.map((key) => {
        const { jsonKey, type } = EXTRAS_FIELD_CONFIG[key];
        const raw = item.extras?.[jsonKey];
        return [key, raw !== undefined ? String(raw) : EMPTY_FORM[key]];
      }),
    ) as Partial<ItemFormState>;
    setForm({
      ...EMPTY_FORM,
      ...extrasOverrides,
      label: item.label,
      description: item.description ?? '',
      imageUrl: item.imageUrl ?? '',
      priceMode: item.priceMode,
      flatPrice: item.flatPrice,
      areaRatePerSqIn: item.areaRatePerSqIn ?? '',
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

  if (isError || !category) {
    return <p className="text-sm text-destructive">Failed to load option category.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/option-categories"
            className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Options
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
        </div>
        <Badge variant="outline">{category.materialScope}</Badge>
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
                Add Item
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add item to {category.name}</DialogTitle>
            </DialogHeader>
            <ItemForm form={form} onChange={setForm} extrasFields={extrasFieldsFor(category.baseKey)} />
            <DialogFooter>
              <Button disabled={!form.label.trim() || createMutation.isPending} onClick={() => createMutation.mutate()}>
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="space-y-3">
        {category.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items in this category yet.</p>
        ) : (
          category.items.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                {editingItemId === item.id ? (
                  <div className="flex-1 space-y-3">
                    <ItemForm form={form} onChange={setForm} extrasFields={extrasFieldsFor(category.baseKey)} />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ itemId: item.id, payload: toPayload(form) })}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingItemId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.label} className="h-10 w-10 rounded object-cover bg-muted" />
                      ) : (
                        <ExtrasPreview baseKey={category.baseKey} extras={item.extras} />
                      )}
                      <div>
                        <div className="font-medium">{item.label}</div>
                        {item.description && <div className="text-sm text-muted-foreground">{item.description}</div>}
                        <div className="text-xs text-muted-foreground">
                          {item.priceMode === 'AREA_RATE'
                            ? `Rs. ${item.areaRatePerSqIn}/sq.in (bounding-box area)`
                            : `Rs. ${item.flatPrice} flat`}
                        </div>
                      </div>
                    </div>
                    {canManage && (
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" disabled={index === 0} onClick={() => moveItem(index, -1)}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={index === category.items.length - 1}
                          onClick={() => moveItem(index, 1)}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => startEdit(item)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setPendingDeleteId(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!pendingDeleteId} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this item?</DialogTitle>
            <DialogDescription>
              {category.items.find((i) => i.id === pendingDeleteId)?.label} will be removed and
              disappear from the storefront customizer immediately. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => pendingDeleteId && deleteMutation.mutate(pendingDeleteId)}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ItemForm({
  form,
  onChange,
  extrasFields = [],
}: {
  form: ItemFormState;
  onChange: (f: ItemFormState) => void;
  extrasFields?: ExtrasFieldKey[];
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Label</Label>
        <Input value={form.label} onChange={(e) => onChange({ ...form, label: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Input value={form.description} onChange={(e) => onChange({ ...form, description: e.target.value })} />
      </div>
      {extrasFields.length > 0 && (
        <div className="flex gap-3 rounded-md border bg-muted/30 p-3">
          {extrasFields.map((key) => {
            const { label, type } = EXTRAS_FIELD_CONFIG[key];
            return (
              <div key={key} className="flex-1 space-y-2">
                <Label>{label}</Label>
                {type === 'color' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={/^#[0-9a-fA-F]{6}$/.test(form[key]) ? form[key] : '#000000'}
                      onChange={(e) => onChange({ ...form, [key]: e.target.value })}
                      className="h-9 w-9 cursor-pointer rounded border"
                    />
                    <Input value={form[key]} onChange={(e) => onChange({ ...form, [key]: e.target.value })} placeholder="#FFFFFF or transparent" />
                  </div>
                ) : (
                  <Input
                    type="number"
                    value={form[key]}
                    onChange={(e) => onChange({ ...form, [key]: e.target.value })}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="space-y-2">
        <Label>Image URL</Label>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
            {form.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.imageUrl}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-[10px] text-muted-foreground">No image</span>
            )}
          </div>
          <Input
            className="flex-1"
            placeholder="https://..."
            value={form.imageUrl}
            onChange={(e) => onChange({ ...form, imageUrl: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={form.priceMode === 'FLAT' ? 'default' : 'outline'}
          onClick={() => onChange({ ...form, priceMode: 'FLAT' })}
        >
          Flat Price
        </Button>
        <Button
          type="button"
          size="sm"
          variant={form.priceMode === 'AREA_RATE' ? 'default' : 'outline'}
          onClick={() => onChange({ ...form, priceMode: 'AREA_RATE' })}
        >
          Area Rate (per sq.in)
        </Button>
      </div>
      {form.priceMode === 'FLAT' ? (
        <div className="space-y-2">
          <Label>Flat Price (Rs.)</Label>
          <Input type="number" step="0.01" value={form.flatPrice} onChange={(e) => onChange({ ...form, flatPrice: e.target.value })} />
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Rate per sq. inch (Rs.)</Label>
          <Input
            type="number"
            step="0.0001"
            value={form.areaRatePerSqIn}
            onChange={(e) => onChange({ ...form, areaRatePerSqIn: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}
