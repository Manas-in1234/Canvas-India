'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { PricingSettingItem } from '@/lib/types/pricing-setting';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/** Built-in rates: their label and the original value that "Reset" restores. */
const BUILT_IN: Record<string, { label: string; original: number }> = {
  shape_area_rate_per_sqin: { label: 'Legacy shared shape rate (fallback only)', original: 1.65 },
  canvas_shape_area_rate_per_sqin: { label: 'Canvas Shape Area Rate (Rs. per sq. inch)', original: 1.65 },
  acrylic_shape_area_rate_per_sqin: { label: 'Acrylic Shape Area Rate (Rs. per sq. inch)', original: 1.65 },
  acrylic_thickness_rate_3mm: { label: 'Acrylic Thickness Rate — 3mm (Rs. per sq. inch)', original: 5.5 },
  acrylic_thickness_rate_5mm: { label: 'Acrylic Thickness Rate — 5mm (Rs. per sq. inch)', original: 6.5 },
  acrylic_thickness_rate_6mm: { label: 'Acrylic Thickness Rate — 6mm (Rs. per sq. inch)', original: 7.75 },
  acrylic_thickness_rate_8mm: { label: 'Acrylic Thickness Rate — 8mm (Rs. per sq. inch)', original: 9.5 },
};

const sameNumber = (a: string | number, b: string | number) => Number(a) === Number(b);

function PricingSettingRow({ setting, canManage }: { setting: PricingSettingItem; canManage: boolean }) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState(String(Number(setting.value)));
  const builtIn = BUILT_IN[setting.key];

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['pricing-settings'] });
  const onError = (fallback: string) => (err: unknown) => toast.error(err instanceof ApiError ? err.message : fallback);

  const updateMutation = useMutation({
    mutationFn: (next: string) => apiClient.patch(`/admin/pricing-settings/${setting.key}`, { value: next }),
    onSuccess: (_d, next) => {
      setValue(String(Number(next)));
      toast.success('Rate updated — takes effect when the storefront is refreshed');
      refresh();
    },
    onError: onError('Failed to update rate'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete(`/admin/pricing-settings/${setting.key}`),
    onSuccess: () => {
      toast.success('Pricing method deleted');
      refresh();
    },
    onError: onError('Failed to delete pricing method'),
  });

  const isDirty = !sameNumber(value, setting.value);
  const canReset = !!builtIn && !sameNumber(setting.value, builtIn.original);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4">
      <div className="min-w-0">
        <div className="font-medium">{builtIn?.label ?? setting.description ?? setting.key}</div>
        {(builtIn ? setting.description : setting.description && setting.key) && (
          <div className="text-sm text-muted-foreground">{builtIn ? setting.description : setting.key}</div>
        )}
        <div className="mt-1 text-xs text-muted-foreground">
          Last updated {formatDate(setting.updatedAt)}
          {builtIn && <> · Original value {builtIn.original}</>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input
          className="w-32"
          type="number"
          step="0.0001"
          min="0"
          value={value}
          disabled={!canManage}
          onChange={(e) => setValue(e.target.value)}
        />
        {canManage && (
          <>
            <Button size="sm" disabled={!isDirty || updateMutation.isPending} onClick={() => updateMutation.mutate(value)}>
              Save
            </Button>
            {builtIn && (
              <Button
                size="sm"
                variant="outline"
                title={`Restore the original value (${builtIn.original})`}
                disabled={!canReset || updateMutation.isPending}
                onClick={() => updateMutation.mutate(String(builtIn.original))}
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
              </Button>
            )}
            {!builtIn && (
              <Button
                size="sm"
                variant="outline"
                title="Delete this pricing method"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (window.confirm('Delete this pricing method? This cannot be undone.')) deleteMutation.mutate();
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);

function AddPricingMethod() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [rate, setRate] = useState('');

  const create = useMutation({
    mutationFn: () => apiClient.post('/admin/pricing-settings', { key: slugify(name), description: name.trim(), value: rate }),
    onSuccess: () => {
      toast.success('Pricing method added');
      setName('');
      setRate('');
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['pricing-settings'] });
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Failed to add pricing method'),
  });

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1 h-4 w-4" /> Add pricing method
      </Button>
    );
  }

  const invalid = slugify(name).length < 2 || rate.trim() === '' || !(Number(rate) >= 0);

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-md border border-dashed p-4">
      <div className="space-y-1">
        <Label htmlFor="pm-name">Name</Label>
        <Input id="pm-name" className="w-72" placeholder="e.g. Rush order surcharge (Rs. per sq. inch)" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="pm-rate">Rate</Label>
        <Input id="pm-rate" className="w-32" type="number" step="0.0001" min="0" value={rate} onChange={(e) => setRate(e.target.value)} />
      </div>
      <Button size="sm" disabled={invalid || create.isPending} onClick={() => create.mutate()}>
        Add
      </Button>
      <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </div>
  );
}

export default function PricingPage() {
  const { hasPermission } = usePermission();
  const canManage = hasPermission('pricing.manage');

  const { data, isLoading, isLoadingError: isError } = useQuery({
    queryKey: ['pricing-settings'],
    queryFn: () => apiClient.get<PricingSettingItem[]>('/admin/pricing-settings'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pricing</h1>
        <p className="text-sm text-muted-foreground">
          Rates used directly in pricing formulas on the storefront — changes apply on storefront refresh, no deploy needed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rates</CardTitle>
          <CardDescription>
            Non-rectangular shapes (heart, hexagon, custom traced shapes) are billed by their bounding
            rectangle&apos;s area at the rate below, not their actual silhouette area. Use Reset to go back to the
            original value. Built-in rates can be reset but not deleted; methods you add can be deleted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive">Failed to load pricing settings.</p>
          ) : !data || data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pricing settings configured yet.</p>
          ) : (
            data.map((setting) => <PricingSettingRow key={setting.key} setting={setting} canManage={canManage} />)
          )}
          {canManage && <AddPricingMethod />}
        </CardContent>
      </Card>
    </div>
  );
}
