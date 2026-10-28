'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { OptionCategoryListItem } from '@/lib/types/option-category';
import { usePermission } from '@/lib/auth/use-permission';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function groupByBaseKey(categories: OptionCategoryListItem[]) {
  const groups = new Map<string, OptionCategoryListItem[]>();
  for (const category of categories) {
    const existing = groups.get(category.baseKey) ?? [];
    existing.push(category);
    groups.set(category.baseKey, existing);
  }
  return groups;
}

export default function OptionCategoriesPage() {
  const router = useRouter();
  const { hasPermission } = usePermission();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['option-categories'],
    queryFn: () => apiClient.get<OptionCategoryListItem[]>('/admin/option-categories'),
  });

  const groups = groupByBaseKey(data ?? []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customize Page Options</h1>
        <p className="text-sm text-muted-foreground">
          Every option a customer can pick on the canvas/acrylic customize page — wrap style, hardware,
          fonts, colors, clipart, and more. Changes here show up on the storefront immediately.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load option categories.</p>
      ) : groups.size === 0 ? (
        <p className="text-sm text-muted-foreground">No option categories configured yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from(groups.entries()).map(([baseKey, variants]) => (
            <Card key={baseKey}>
              <CardHeader>
                <CardTitle className="text-base">{variants[0].name.replace(/\s*\((Acrylic|Canvas)\)\s*$/i, '')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    className="flex w-full items-center justify-between rounded-md border p-3 text-left text-sm hover:bg-muted"
                    onClick={() => hasPermission('option_catalog.view') && router.push(`/option-categories/${variant.id}`)}
                  >
                    <span className="flex items-center gap-2">
                      <Badge variant="outline">{variant.materialScope}</Badge>
                      {variant.items.length} items
                    </span>
                    {!variant.isActive && <Badge variant="outline">Inactive</Badge>}
                  </button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
