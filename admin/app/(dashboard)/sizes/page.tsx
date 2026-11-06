'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { SizePresetListItem } from '@/lib/types/size-preset';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SHAPE_GENERIC_PRODUCT_TYPE_ID = '__shape_generic__';

function groupByProductType(presets: SizePresetListItem[]) {
  const groups = new Map<string, SizePresetListItem[]>();
  for (const preset of presets) {
    const existing = groups.get(preset.productTypeId) ?? [];
    existing.push(preset);
    groups.set(preset.productTypeId, existing);
  }
  return groups;
}

export default function SizesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['size-presets'],
    queryFn: () => apiClient.get<SizePresetListItem[]>('/admin/size-presets'),
  });

  const groups = groupByProductType(data ?? []);
  const filteredEntries = Array.from(groups.entries()).filter(([productTypeId]) =>
    productTypeId.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sizes</h1>
        <p className="text-sm text-muted-foreground">
          Every size/panel preset a customer can pick on the customize page, grouped by product type.
          Changes here show up on the storefront immediately.
        </p>
      </div>

      <Input placeholder="Search product type..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load size presets.</p>
      ) : filteredEntries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No size presets found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map(([productTypeId, presets]) => (
            <Card
              key={productTypeId}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/sizes/${encodeURIComponent(productTypeId)}`)}
            >
              <CardHeader>
                <CardTitle className="text-base font-mono">
                  {productTypeId === SHAPE_GENERIC_PRODUCT_TYPE_ID ? 'Standard Shape Sizes' : productTypeId}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{presets.length} sizes</Badge>
                {productTypeId === SHAPE_GENERIC_PRODUCT_TYPE_ID && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Applies across whichever shape is selected — scoped by shape, not by a specific product.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
