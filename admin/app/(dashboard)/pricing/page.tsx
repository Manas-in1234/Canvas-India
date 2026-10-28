'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, ApiError } from '@/lib/api-client';
import type { PricingSettingItem } from '@/lib/types/pricing-setting';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SETTING_LABELS: Record<string, string> = {
  shape_area_rate_per_sqin: 'Shape Area Rate (Rs. per sq. inch)',
};

function PricingSettingRow({ setting, canManage }: { setting: PricingSettingItem; canManage: boolean }) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState(setting.value);

  const updateMutation = useMutation({
    mutationFn: () => apiClient.patch(`/admin/pricing-settings/${setting.key}`, { value }),
    onSuccess: () => {
      toast.success('Rate updated — takes effect immediately on the storefront');
      queryClient.invalidateQueries({ queryKey: ['pricing-settings'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update rate');
    },
  });

  const isDirty = value !== setting.value;

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border p-4">
      <div>
        <div className="font-medium">{SETTING_LABELS[setting.key] ?? setting.key}</div>
        {setting.description && <div className="text-sm text-muted-foreground">{setting.description}</div>}
        <div className="mt-1 text-xs text-muted-foreground">Last updated {formatDate(setting.updatedAt)}</div>
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
          <Button size="sm" disabled={!isDirty || updateMutation.isPending} onClick={() => updateMutation.mutate()}>
            Save
          </Button>
        )}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const { hasPermission } = usePermission();
  const canManage = hasPermission('pricing.manage');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['pricing-settings'],
    queryFn: () => apiClient.get<PricingSettingItem[]>('/admin/pricing-settings'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pricing</h1>
        <p className="text-sm text-muted-foreground">
          Rates used directly in pricing formulas on the storefront — changes apply immediately, no deploy needed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rates</CardTitle>
          <CardDescription>
            Non-rectangular shapes (heart, hexagon, custom traced shapes) are billed by their bounding
            rectangle&apos;s area at the rate below, not their actual silhouette area.
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
        </CardContent>
      </Card>
    </div>
  );
}
