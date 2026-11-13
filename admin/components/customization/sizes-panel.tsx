'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { SizePresetListItem } from '@/lib/types/size-preset';
import type { CustomizerProductType } from '@/lib/types/customizer-product-type';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SHAPE_GENERIC_PRODUCT_TYPE_ID = '__shape_generic__';

function humanizeProductTypeId(productTypeId: string): string {
  if (productTypeId === SHAPE_GENERIC_PRODUCT_TYPE_ID) return 'Standard Shape Sizes';
  return productTypeId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function groupByProductType(presets: SizePresetListItem[]) {
  const groups = new Map<string, SizePresetListItem[]>();
  for (const preset of presets) {
    const existing = groups.get(preset.productTypeId) ?? [];
    existing.push(preset);
    groups.set(preset.productTypeId, existing);
  }
  return groups;
}

export function SizesPanel({ material }: { material: 'CANVAS' | 'ACRYLIC' }) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['size-presets'],
    queryFn: () => apiClient.get<SizePresetListItem[]>('/admin/size-presets'),
  });

  // Style names come from the customizer's PRODUCTS tab data, so a style added
  // there shows its real name here instead of a reconstructed identifier.
  const { data: styles } = useQuery({
    queryKey: ['customizer-product-types'],
    queryFn: () => apiClient.get<CustomizerProductType[]>('/admin/customizer-product-types'),
  });
  const styleBySlug = new Map((styles ?? []).map((s) => [s.slug, s]));
  const labelFor = (productTypeId: string) => {
    const style = styleBySlug.get(productTypeId);
    return style ? `${style.name} (${style.material === 'CANVAS' ? 'Canvas' : 'Acrylic'})` : humanizeProductTypeId(productTypeId);
  };

  const groups = groupByProductType(data ?? []);
  // Only this material's styles; the generic shape sizes apply to both.
  const filteredEntries = Array.from(groups.entries()).filter(([productTypeId]) => {
    const style = styleBySlug.get(productTypeId);
    if (style && style.material !== material) return false;
    if (!style && productTypeId !== SHAPE_GENERIC_PRODUCT_TYPE_ID && !productTypeId.startsWith(material.toLowerCase())) return false;
    return labelFor(productTypeId).toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Sizes</h2>
        <p className="text-sm text-muted-foreground">
          The sizes a customer can pick in the customizer&apos;s SELECT SIZE tab, grouped by product style.
          Changes here show up on the storefront immediately.
        </p>
      </div>

      <Input placeholder="Search style..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />

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
              onClick={() => router.push(`/sizes/placeholder?id=${encodeURIComponent(productTypeId)}`)}
            >
              <CardHeader>
                <CardTitle className="text-base">{labelFor(productTypeId)}</CardTitle>
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
