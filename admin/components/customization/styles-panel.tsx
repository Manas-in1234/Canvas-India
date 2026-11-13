'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { CustomizerMaterial, CustomizerProductType } from '@/lib/types/customizer-product-type';
import type { SizePresetListItem } from '@/lib/types/size-preset';
import { usePermission } from '@/lib/auth/use-permission';
import { imageToIconDataUrl } from '@/lib/customizer-options';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';

const ICON_TYPES = [
  'print', 'panel', 'block', 'wall', 'collage', 'split', 'mosaic', 'round', 'triangle', 'heart',
  'oval', 'hexagon', 'lyric', 'painting', 'quotes', 'bus-roll', 'banner', 'pop-art', 'word-art', 'signage',
];

const SHAPES: Array<{ id: string; label: string }> = [
  { id: 'shape-square', label: 'Square' },
  { id: 'shape-rectangle', label: 'Rectangle' },
  { id: 'shape-landscape', label: 'Landscape' },
  { id: 'shape-portrait', label: 'Portrait' },
  { id: 'shape-circle', label: 'Circle' },
  { id: 'shape-oval', label: 'Oval' },
  { id: 'shape-rounded-rect', label: 'Rounded' },
  { id: 'shape-heart', label: 'Heart' },
  { id: 'shape-hexagon', label: 'Hexagon' },
  { id: 'shape-triangle', label: 'Triangle' },
];

/** The tabs and views a style can switch on or off, worded like the customizer's sidebar. */
const FEATURES: Array<{ key: string; label: string; canvasOnly?: boolean }> = [
  { key: 'upload', label: 'UPLOAD tab' },
  { key: 'sizes', label: 'SELECT SIZE tab' },
  { key: 'layouts', label: 'LAYOUTS & DESIGNS tab' },
  { key: 'wrap', label: 'WRAP & BORDER tab', canvasOnly: true },
  { key: 'hardware', label: 'HARDWARE & FINISH tab' },
  { key: 'options', label: 'OPTIONS tab' },
  { key: 'roomView', label: 'Room view' },
  { key: 'view3D', label: '3D view' },
  { key: 'view360', label: '360° view' },
];

interface FormState {
  slug: string;
  name: string;
  startingPrice: string;
  image: string;
  iconType: string;
  panelsCount: string;
  description: string;
  defaultShapeId: string;
  supportedShapeIds: string[];
  defaultSizeOptionId: string;
  defaultLayoutId: string;
  defaultHardwareId: string;
  defaultThicknessId: string;
  supportedHardwareIds: string[] | null;
  supportedLayoutIds: string[] | null;
  capabilities: Record<string, unknown>;
  isActive: boolean;
}

const BLANK: FormState = {
  slug: '',
  name: '',
  startingPrice: '',
  image: '',
  iconType: 'print',
  panelsCount: '1',
  description: '',
  defaultShapeId: 'shape-square',
  supportedShapeIds: SHAPES.map((s) => s.id),
  defaultSizeOptionId: '',
  defaultLayoutId: '',
  defaultHardwareId: '',
  defaultThicknessId: '',
  supportedHardwareIds: null,
  supportedLayoutIds: null,
  capabilities: {},
  isActive: true,
};

function fromRow(row: CustomizerProductType): FormState {
  return {
    slug: row.slug,
    name: row.name,
    startingPrice: row.startingPrice,
    image: row.image ?? '',
    iconType: row.iconType ?? 'print',
    panelsCount: String(row.panelsCount ?? 1),
    description: row.description ?? '',
    defaultShapeId: row.defaultShapeId ?? 'shape-square',
    supportedShapeIds: row.supportedShapeIds ?? SHAPES.map((s) => s.id),
    defaultSizeOptionId: row.defaultSizeOptionId ?? '',
    defaultLayoutId: row.defaultLayoutId ?? '',
    defaultHardwareId: row.defaultHardwareId ?? '',
    defaultThicknessId: row.defaultThicknessId ?? '',
    supportedHardwareIds: row.supportedHardwareIds,
    supportedLayoutIds: row.supportedLayoutIds,
    capabilities: row.capabilities ?? {},
    isActive: row.isActive,
  };
}

function slugify(material: CustomizerMaterial, name: string) {
  const body = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return body ? `${material.toLowerCase()}-${body}` : '';
}

function toPayload(form: FormState) {
  const text = (value: string) => (value.trim() ? value.trim() : null);
  return {
    name: form.name.trim(),
    startingPrice: Number(form.startingPrice),
    image: text(form.image),
    iconType: text(form.iconType),
    panelsCount: Number(form.panelsCount) || 1,
    description: text(form.description),
    defaultShapeId: text(form.defaultShapeId),
    supportedShapeIds: form.supportedShapeIds,
    defaultSizeOptionId: text(form.defaultSizeOptionId),
    defaultLayoutId: text(form.defaultLayoutId),
    defaultHardwareId: text(form.defaultHardwareId),
    defaultThicknessId: text(form.defaultThicknessId),
    ...(form.supportedHardwareIds ? { supportedHardwareIds: form.supportedHardwareIds } : {}),
    ...(form.supportedLayoutIds ? { supportedLayoutIds: form.supportedLayoutIds } : {}),
    capabilities: form.capabilities,
    isActive: form.isActive,
  };
}

/** Switching 3D or 360 view also has to move the matching flags the customizer reads. */
function setFeature(caps: Record<string, unknown>, key: string, on: boolean): Record<string, unknown> {
  const next = { ...caps, [key]: on };
  if (key === 'view3D') {
    next.supports3DView = on;
    next.showPhysicalEdges = on;
    next.edgeMode = on ? 'image-wrap' : 'none';
    next.physicalThickness = on ? Number(caps.physicalThickness) || 26 : 0;
  }
  if (key === 'view360') next.supports360View = on;
  return next;
}

export function StylesPanel({ material }: { material: CustomizerMaterial }) {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canManage = hasPermission('option_catalog.manage');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CustomizerProductType | null>(null);
  const [form, setForm] = useState<FormState>(BLANK);
  const [slugTouched, setSlugTouched] = useState(false);
  const [templateId, setTemplateId] = useState('');
  const [copySizes, setCopySizes] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<CustomizerProductType | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['customizer-product-types'],
    queryFn: () => apiClient.get<CustomizerProductType[]>('/admin/customizer-product-types'),
  });

  const all = data ?? [];
  const styles = all.filter((s) => s.material === material);
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['customizer-product-types'] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        return apiClient.patch<CustomizerProductType>(`/admin/customizer-product-types/${editing.id}`, toPayload(form));
      }
      const created = await apiClient.post<CustomizerProductType>('/admin/customizer-product-types', {
        material,
        slug: form.slug,
        ...toPayload(form),
      });
      const template = all.find((s) => s.id === templateId);
      if (template && copySizes) {
        const presets = await apiClient.get<SizePresetListItem[]>(
          `/admin/size-presets?productTypeId=${encodeURIComponent(template.slug)}`,
        );
        for (const preset of presets) {
          const { id: _id, createdAt: _c, updatedAt: _u, sortOrder: _s, ...rest } = preset;
          const body = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== null && v !== undefined));
          await apiClient.post('/admin/size-presets', { ...body, productTypeId: created.slug });
        }
      }
      return created;
    },
    onSuccess: () => {
      toast.success(editing ? 'Style updated' : 'Style added');
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['size-presets'] });
      setDialogOpen(false);
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to save style'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/customizer-product-types/${id}`),
    onSuccess: () => {
      toast.success('Style removed from the customizer');
      invalidate();
      setPendingDelete(null);
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to remove style'),
  });

  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) => apiClient.put('/admin/customizer-product-types/reorder', { itemIds: ids, material }),
    onSuccess: () => invalidate(),
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to reorder'),
  });

  const move = (index: number, direction: -1 | 1) => {
    const ids = styles.map((s) => s.id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    reorderMutation.mutate(ids);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...BLANK, capabilities: {} });
    setSlugTouched(false);
    setTemplateId('');
    setCopySizes(true);
    setDialogOpen(true);
  };

  const openEdit = (style: CustomizerProductType) => {
    setEditing(style);
    setForm(fromRow(style));
    setDialogOpen(true);
  };

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const template = all.find((s) => s.id === id);
    if (!template) return;
    // Keep what the admin already typed for the identity fields; take everything else from the template.
    setForm((prev) => ({ ...fromRow(template), name: prev.name, slug: prev.slug, startingPrice: prev.startingPrice || template.startingPrice, image: prev.image, description: prev.description }));
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const slugValid = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug);
  const priceValid = form.startingPrice !== '' && Number.isFinite(Number(form.startingPrice)) && Number(form.startingPrice) >= 0;
  const canSave = form.name.trim() !== '' && priceValid && (editing ? true : slugValid);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Product styles</h2>
          <p className="text-sm text-muted-foreground">
            The style cards a customer picks first, in the customizer&apos;s PRODUCTS tab. Add a style, hide
            or remove one, and drag the order with the arrows. Changes show on the storefront immediately.
          </p>
        </div>
        {canManage && (
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add style
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{styles.length} Styles</p>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load styles.</p>
      ) : styles.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {material.toLowerCase()} styles yet.</p>
      ) : (
        <div className="space-y-2">
          {styles.map((style, index) => (
            <Card key={style.id}>
              <CardContent className="flex items-center gap-4 p-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                  {style.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={style.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-medium">
                    {style.name}
                    {!style.isActive && <Badge variant="outline">Hidden</Badge>}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    Starts at {formatCurrency(style.startingPrice)} &middot; {style.panelsCount ?? 1} panel
                    {(style.panelsCount ?? 1) === 1 ? '' : 's'} &middot; {style.slug}
                  </div>
                </div>
                {canManage && (
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" disabled={index === 0 || reorderMutation.isPending} onClick={() => move(index, -1)}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" disabled={index === styles.length - 1 || reorderMutation.isPending} onClick={() => move(index, 1)}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(style)}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setPendingDelete(style)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.name}` : `Add a ${material.toLowerCase()} style`}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'Changes show on the storefront immediately.'
                : 'A new style uses the standard single-panel editor, like Single Print. Special editors (Lyric Studio, Bus Roll, collage grids) belong to the built-in styles.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {!editing && (
              <div className="space-y-2 rounded-md border bg-muted/30 p-3">
                <Label htmlFor="cp-template">Start from an existing style</Label>
                <select
                  id="cp-template"
                  value={templateId}
                  onChange={(e) => applyTemplate(e.target.value)}
                  className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
                >
                  <option value="">Blank (Single Print defaults)</option>
                  {styles.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {templateId && (
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input type="checkbox" checked={copySizes} onChange={(e) => setCopySizes(e.target.checked)} />
                    Also copy that style&apos;s sizes, so the SELECT SIZE tab isn&apos;t empty
                  </label>
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => {
                    set('name', e.target.value);
                    if (!editing && !slugTouched) set('slug', slugify(material, e.target.value));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Starts at (Rs.)</Label>
                <Input type="number" min="0" step="0.01" value={form.startingPrice} onChange={(e) => set('startingPrice', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Identifier</Label>
                <Input
                  value={form.slug}
                  disabled={Boolean(editing)}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set('slug', e.target.value.toLowerCase());
                  }}
                />
                <p className="text-[11px] text-muted-foreground">
                  {editing ? 'Fixed once created: sizes and links use it.' : 'Lowercase letters, numbers and dashes.'}
                </p>
                {!editing && form.slug && !slugValid && <p className="text-[11px] text-destructive">Use lowercase letters, numbers and dashes only.</p>}
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <select
                  value={form.iconType}
                  onChange={(e) => set('iconType', e.target.value)}
                  className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
                >
                  {ICON_TYPES.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Panels</Label>
                <Input type="number" min="1" value={form.panelsCount} onChange={(e) => set('panelsCount', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Default shape</Label>
                <select
                  value={form.defaultShapeId}
                  onChange={(e) => set('defaultShapeId', e.target.value)}
                  className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
                >
                  {SHAPES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover image</Label>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                  {form.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.image} alt="Preview" className="h-full w-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
                  ) : (
                    <span className="text-[10px] text-muted-foreground">No image</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex gap-2">
                    <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-1.5 text-sm hover:bg-muted">
                      {form.image ? 'Change image' : 'Upload image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          e.target.value = '';
                          if (!file) return;
                          try {
                            set('image', await imageToIconDataUrl(file, 480));
                          } catch {
                            toast.error('Could not read that image. Try a PNG, JPG or WebP file.');
                          }
                        }}
                      />
                    </label>
                    {form.image && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => set('image', '')}>
                        Remove
                      </Button>
                    )}
                  </div>
                  <Input placeholder="…or paste an image link (optional)" value={form.image.startsWith('data:') ? '' : form.image} onChange={(e) => set('image', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Shapes a customer can pick</Label>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {SHAPES.map((s) => (
                  <label key={s.id} className="flex items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={form.supportedShapeIds.includes(s.id)}
                      onChange={(e) =>
                        set(
                          'supportedShapeIds',
                          e.target.checked ? [...form.supportedShapeIds, s.id] : form.supportedShapeIds.filter((x) => x !== s.id),
                        )
                      }
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tabs and views for this style</Label>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {FEATURES.filter((f) => !(f.canvasOnly && material === 'ACRYLIC')).map((f) => (
                  <label key={f.key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.capabilities[f.key] === true}
                      onChange={(e) => set('capabilities', setFeature(form.capabilities, f.key, e.target.checked))}
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Defaults when this style is picked</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Default size id" value={form.defaultSizeOptionId} onChange={(e) => set('defaultSizeOptionId', e.target.value)} />
                <Input placeholder="Default hardware id" value={form.defaultHardwareId} onChange={(e) => set('defaultHardwareId', e.target.value)} />
                <Input placeholder="Default thickness id" value={form.defaultThicknessId} onChange={(e) => set('defaultThicknessId', e.target.value)} />
                <Input placeholder="Default layout id" value={form.defaultLayoutId} onChange={(e) => set('defaultLayoutId', e.target.value)} />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Filled in automatically when you start from an existing style. Change them only if you know the ids.
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
              Show this style in the customizer
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!canSave || saveMutation.isPending} onClick={() => saveMutation.mutate()}>
              {saveMutation.isPending ? 'Saving…' : editing ? 'Save changes' : 'Add style'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove this style?</DialogTitle>
            <DialogDescription>
              {pendingDelete?.name} will disappear from the customizer&apos;s PRODUCTS tab straight away. Its
              sizes stay on the Select Size screen. To keep it but stop showing it, use Edit and untick
              &quot;Show this style&quot; instead.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={deleteMutation.isPending} onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}>
              {deleteMutation.isPending ? 'Removing…' : 'Remove style'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
