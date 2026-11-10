'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { OptionCategoryListItem } from '@/lib/types/option-category';
import { usePermission } from '@/lib/auth/use-permission';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

/**
 * Mirrors the customizer's real tab structure (CanvasCustomizerPage.tsx)
 * so this page reads the same way the storefront does, instead of a flat
 * alphabetical list of baseKeys with no indication of where each one
 * actually shows up. Verified against the live site tab by tab — see each
 * tab's note for where to look if you want to confirm an item yourself.
 */
const TAB_GROUPS: Array<{ tab: string; note: string; baseKeys: string[] }> = [
  {
    tab: 'Wrap & Border',
    note: 'Canvas only — this tab never shows for acrylic products.',
    baseKeys: ['wrap_style', 'border_width', 'border_color', 'frame'],
  },
  {
    tab: 'Hardware & Finish',
    note: 'Shown for both materials — hardware/backing/finish are material-specific within the same tab.',
    baseKeys: ['hardware', 'backgrounds', 'finish', 'material_grade', 'lamination', 'display_option'],
  },
  {
    tab: 'Text & Design',
    note: 'Lyric, Word Art, and Quotes product types — font and color pickers inside Lyric Studio.',
    baseKeys: ['font', 'text_color', 'clipart'],
  },
];

const BASE_KEY_LABELS: Record<string, string> = {
  wrap_style: 'Edge Wrap',
  border_width: 'Border Width',
  border_color: 'Border Color',
  frame: 'Frame',
  hardware: 'Hardware',
  backgrounds: 'Acrylic Backing',
  finish: 'Acrylic Surface Finish',
  material_grade: 'Canvas Material Grade',
  lamination: 'Lamination',
  display_option: 'Back Display Option',
  font: 'Font',
  text_color: 'Text Color',
  clipart: 'Clipart',
};

export default function OptionCategoriesPage() {
  const router = useRouter();
  const { hasPermission } = usePermission();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['option-categories'],
    queryFn: () => apiClient.get<OptionCategoryListItem[]>('/admin/option-categories'),
  });

  const groups = groupByBaseKey(data ?? []);
  const knownBaseKeys = new Set(TAB_GROUPS.flatMap((g) => g.baseKeys));
  const uncategorized = Array.from(groups.keys()).filter((k) => !knownBaseKeys.has(k));

  const renderVariantRow = (variant: OptionCategoryListItem) => (
    <button
      key={variant.id}
      className="flex w-full items-center justify-between rounded-md border p-3 text-left text-sm hover:bg-muted"
      onClick={() =>
        hasPermission('option_catalog.view') &&
        router.push(`/option-categories/placeholder?id=${encodeURIComponent(variant.id)}`)
      }
    >
      <span className="flex items-center gap-2">
        <Badge variant="outline">{variant.materialScope}</Badge>
        {variant.items.length} items
      </span>
      {!variant.isActive && <Badge variant="outline">Inactive</Badge>}
    </button>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customize Page Options</h1>
        <p className="text-sm text-muted-foreground">
          Grouped the same way the storefront customizer is — by tab, then by what a customer actually
          picks there. Changes here show up on the storefront immediately.
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
        <>
          {TAB_GROUPS.map(({ tab, note, baseKeys }) => {
            const present = baseKeys.filter((k) => groups.has(k));
            if (present.length === 0) return null;
            return (
              <section key={tab} className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">{tab}</h2>
                  <p className="text-xs text-muted-foreground">{note}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {present.map((baseKey) => {
                    const variants = groups.get(baseKey)!;
                    return (
                      <Card key={baseKey}>
                        <CardHeader>
                          <CardTitle className="text-base">{BASE_KEY_LABELS[baseKey] ?? baseKey}</CardTitle>
                          <CardDescription className="text-xs">
                            Shown in: {tab}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {variants.map(renderVariantRow)}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {uncategorized.length > 0 && (
            <section className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Other</h2>
                <p className="text-xs text-muted-foreground">
                  Not yet mapped to a specific customizer tab — check with a developer before editing.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {uncategorized.map((baseKey) => {
                  const variants = groups.get(baseKey)!;
                  return (
                    <Card key={baseKey}>
                      <CardHeader>
                        <CardTitle className="text-base">{variants[0].name.replace(/\s*\((Acrylic|Canvas)\)\s*$/i, '')}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">{variants.map(renderVariantRow)}</CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
