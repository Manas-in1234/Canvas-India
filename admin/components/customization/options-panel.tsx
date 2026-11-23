'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { OptionCategoryListItem } from '@/lib/types/option-category';
import { usePermission } from '@/lib/auth/use-permission';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DESIGN_TEMPLATE_SEED_ITEMS } from '@/lib/customizer-options';
import layoutSeed from '@/lib/layout-seed.json';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * This page mirrors the storefront customizer exactly: one block per sidebar
 * tab, one sub-heading per section inside that tab, using the same wording the
 * customer sees (taken from CanvasCustomizerPage.tsx). Numbers in front of the
 * storefront headings ("1.", "2.") are left out because they differ between
 * canvas and acrylic.
 *
 * Entry kinds:
 *  - category: an admin-managed option list (opens the item editor)
 *  - link:     managed on another admin screen
 *  - fixed:    a real storefront section whose content still lives in code, so
 *              it is listed here to make the map complete, with no editor yet
 */
type Entry =
  | { kind: 'category'; baseKey: string; title?: string; seed?: SeedSpec }
  | { kind: 'link'; title: string; href: string; note: string }
  | { kind: 'fixed'; title: string; note: string };

interface SeedSpec {
  scope: 'CANVAS' | 'ACRYLIC' | 'BOTH';
  name: string;
  items: Array<{ label: string; description: string; flatPrice: string; extras: Record<string, unknown> }>;
}

const CANVAS_THICKNESS_SEED: SeedSpec = {
  scope: 'CANVAS',
  name: 'Canvas thickness',
  items: [
      { label: 'Canvas Lite', description: 'Ultra slim & lightweight, economical mount', flatPrice: '148.50', extras: { id: 'canvas-lite', name: 'Canvas Lite', thicknessInches: 0.5, depthPx: 12, badge: '' } },
      { label: 'Thin Gallery Wrap', description: 'Standard modern gallery profile', flatPrice: '193.05', extras: { id: 'thin-gallery', name: 'Thin Gallery Wrap', thicknessInches: 0.75, depthPx: 18, badge: 'Recommended' } },
      { label: 'Thick Gallery Wrap', description: 'Museum-grade premium deep projection', flatPrice: '231.66', extras: { id: 'thick-gallery', name: 'Thick Gallery Wrap', thicknessInches: 1.5, depthPx: 30, badge: 'Museum Quality' } },
      { label: 'Custom Thickness', description: 'Specify custom canvas frame depth', flatPrice: '193.05', extras: { id: 'custom-thickness', name: 'Custom Thickness', thicknessInches: 1.0, depthPx: 22, badge: '' } },
      { label: 'Unframed Rolled Canvas', description: 'Flexible unmounted rolled canvas or hanging bar', flatPrice: '85.00', extras: { id: 'hanging-canvas', name: 'Unframed Rolled Canvas', thicknessInches: 0.25, depthPx: 8, badge: '' } },
  ],
};

const ACRYLIC_THICKNESS_SEED: SeedSpec = {
  scope: 'ACRYLIC',
  name: 'Acrylic thickness',
  items: [
      { label: '3MM Lightweight Cast Acrylic', description: '', flatPrice: '0.00', extras: { id: '3mm', name: '3MM Cast Acrylic', thicknessMm: 3, badge: '' } },
      { label: '5MM Standard Studio Acrylic', description: '', flatPrice: '150.00', extras: { id: '5mm', name: '5MM Studio Acrylic', thicknessMm: 5, badge: 'Recommended' } },
      { label: '6MM Architectural Grade Acrylic', description: '', flatPrice: '200.00', extras: { id: '6mm', name: '6MM Architectural Grade', thicknessMm: 6, badge: '' } },
      { label: '8MM Premium Optical Cast Acrylic', description: '', flatPrice: '250.00', extras: { id: '8mm', name: '8MM Optical Cast', thicknessMm: 8, badge: 'Museum Quality' } },
      { label: '18mm Heavy Block Acrylic', description: '', flatPrice: '450.00', extras: { id: '18mm', name: '', thicknessMm: 18, badge: '' } },
  ],
};

const DESIGN_TEMPLATES_SEED: SeedSpec = {
  scope: 'BOTH',
  name: 'Design templates',
  items: DESIGN_TEMPLATE_SEED_ITEMS,
};

interface Section {
  heading: string;
  scope?: string;
  entries: Entry[];
}

interface TabBlock {
  tab: string;
  note?: string;
  sections: Section[];
  footnote?: string;
}

const LAYOUT_TYPE_LABELS: Record<string, string> = {
  'canvas-single': 'Single print',
  'canvas-hexagon': 'Hexagon',
  'canvas-wall-art': 'Wall display',
  'canvas-collage': 'Photo collage',
  'canvas-split': 'Split',
  'canvas-mosaic': 'Photo mosaic',
};

const LAYOUTS_SEED: SeedSpec = {
  scope: 'BOTH',
  name: 'Layouts',
  items: (layoutSeed as Array<{ id: string; type: string; name: string; price: number; acrylicPrice: number | null }>).map((l) => ({
    label: l.name,
    description: '',
    flatPrice: String(l.price),
    extras: { id: l.id, category: LAYOUT_TYPE_LABELS[l.type] ?? l.type, acrylicPrice: l.acrylicPrice ?? '' },
  })),
};

const CUSTOM_SIZE_SEED: SeedSpec = {
  scope: 'BOTH',
  name: 'Custom size limits (inches)',
  items: [6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 36, 40, 44].map((n) => ({
    label: String(n), description: '', flatPrice: '0', extras: {},
  })),
};

const TABS: TabBlock[] = [
  {
    tab: 'SPECIALTY PRODUCTS',
    note: 'Existing Lyric Canvas, Word Art, Canvas Banner and Pop Art pickers.',
    sections: [
      { heading: 'Lyric Canvas', entries: [{ kind: 'category', baseKey: 'lyric_templates', title: 'Templates' }, { kind: 'category', baseKey: 'lyric_sizes', title: 'Sizes' }] },
      { heading: 'Word Art', entries: ['sizes', 'fonts', 'colors', 'directions'].map((key) => ({ kind: 'category' as const, baseKey: `word_art_${key}`, title: key })) },
      { heading: 'Canvas Banner', entries: ['sizes', 'hardware', 'backgrounds'].map((key) => ({ kind: 'category' as const, baseKey: `banner_${key}`, title: key })) },
      { heading: 'Pop Art', entries: [{ kind: 'category', baseKey: 'pop_art_styles', title: 'Styles' }, { kind: 'category', baseKey: 'pop_art_sizes', title: 'Sizes' }] },
    ],
  },
  {
    tab: 'SELECT SIZE',
    sections: [
      {
        heading: 'Custom size limits',
        entries: [
          {
            kind: 'category',
            baseKey: 'custom_size_steps',
            title: 'Inch steps offered in the Custom Size boxes (Height × Width). Add a smaller or larger number and it is placed in order automatically.',
            seed: CUSTOM_SIZE_SEED,
          },
        ],
      },
    ],
  },
  {
    tab: 'LAYOUTS & DESIGNS',
    sections: [
      {
        heading: 'Layouts & Designs',
        entries: [
          {
            kind: 'category',
            baseKey: 'design_templates',
            title: 'Design templates (Father’s Day, Valentine’s Day, Birthday, ...)',
            seed: DESIGN_TEMPLATES_SEED,
          },
          {
            kind: 'category',
            baseKey: 'layouts',
            title: 'Layout arrangements (Single Full Image, Landscape, Wall Display, Collage, ...). Rename, re-price, hide, reorder or add a cover image. New layout shapes need a developer, because each one defines how the photo is cut into panels.',
            seed: LAYOUTS_SEED,
          },
        ],
      },
    ],
  },
  {
    tab: 'WRAP & BORDER',
    note: 'Canvas only: this tab never shows for acrylic products.',
    sections: [
      {
        heading: 'Wrap',
        scope: 'Canvas',
        entries: [
          {
            kind: 'category',
            baseKey: 'canvas_thickness',
            title: 'Canvas thickness cards (Canvas Lite, Thin / Thick Gallery Wrap, ...)',
            seed: CANVAS_THICKNESS_SEED,
          },
        ],
      },
      { heading: 'Edge Wrap', scope: 'Canvas', entries: [{ kind: 'category', baseKey: 'wrap_style' }] },
      {
        heading: 'Border',
        scope: 'Canvas',
        entries: [
          { kind: 'category', baseKey: 'border_width', title: 'Border widths' },
          { kind: 'category', baseKey: 'border_color', title: 'Border Color swatches' },
        ],
      },
      { heading: 'Frames', scope: 'Canvas', entries: [{ kind: 'category', baseKey: 'frame' }] },
    ],
  },
  {
    tab: 'HARDWARE & FINISH',
    sections: [
      {
        heading: 'Acrylic Thickness',
        scope: 'Acrylic',
        entries: [
          {
            kind: 'category',
            baseKey: 'acrylic_thickness',
            title: 'Acrylic thickness cards (3, 5, 6, 8 mm ...)',
            seed: ACRYLIC_THICKNESS_SEED,
          },
          {
            kind: 'link',
            title: 'Acrylic thickness rates',
            href: '/pricing',
            note: 'The per-sq-inch price of each acrylic thickness is set under Pricing.',
          },
        ],
      },
      {
        heading: 'Canvas Stretcher Thickness',
        scope: 'Canvas',
        entries: [
          {
            kind: 'category',
            baseKey: 'canvas_thickness',
            title: 'Same list as the Wrap cards (Canvas thickness)',
            seed: CANVAS_THICKNESS_SEED,
          },
        ],
      },
      { heading: 'Backing', scope: 'Acrylic', entries: [{ kind: 'category', baseKey: 'backgrounds' }] },
      { heading: 'Surface Finish', scope: 'Acrylic', entries: [{ kind: 'category', baseKey: 'finish' }] },
      { heading: 'Hardware Option & Style', entries: [{ kind: 'category', baseKey: 'hardware' }] },
      { heading: 'Back Display Option', scope: 'Canvas', entries: [{ kind: 'category', baseKey: 'display_option' }] },
      {
        heading: 'Optional Color Finishing',
        entries: [{ kind: 'category', baseKey: 'color_finishing' }],
      },
    ],
  },
  {
    tab: 'OPTIONS',
    sections: [
      { heading: 'Lamination Options', entries: [{ kind: 'category', baseKey: 'lamination' }] },
      { heading: 'Minor Photo Retouching', entries: [{ kind: 'category', baseKey: 'retouching' }] },
    ],
    footnote:
      'Major Retouching Notes, Digital Proof Request and Order Quantity are built-in form fields, so there is nothing to edit.',
  },
  {
    tab: 'SELECT CANVAS MATERIAL VARIANT',
    note: 'A popup opened from the material selector on canvas products.',
    sections: [
      { heading: 'Canvas Material Variant', scope: 'Canvas', entries: [{ kind: 'category', baseKey: 'material_grade' }] },
    ],
  },
];

/** Admin categories that exist but that no storefront screen reads yet. */
const NOT_CONNECTED: Array<{ baseKey: string; title: string; hint: string }> = [
  { baseKey: 'font', title: 'Font', hint: 'Lyric Studio uses its own built-in font list.' },
  { baseKey: 'text_color', title: 'Text Color', hint: 'Lyric Studio uses its own built-in color list.' },
  { baseKey: 'clipart', title: 'Clipart', hint: 'The clipart picker uses its own built-in artwork.' },
];

function groupByBaseKey(categories: OptionCategoryListItem[]) {
  const groups = new Map<string, OptionCategoryListItem[]>();
  for (const category of categories) {
    const existing = groups.get(category.baseKey) ?? [];
    existing.push(category);
    groups.set(category.baseKey, existing);
  }
  return groups;
}

export function OptionsPanel({ material, tabs }: { material: 'CANVAS' | 'ACRYLIC'; tabs: string[] }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState('');
  const [seeding, setSeeding] = useState<string | null>(null);
  const { hasPermission } = usePermission();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['option-categories'],
    queryFn: () => apiClient.get<OptionCategoryListItem[]>('/admin/option-categories'),
  });

  const groups = groupByBaseKey(data ?? []);
  const placed = new Set<string>([
    // The old editor was removed. Keep its saved lists out of the generic Options panel.
    'sidebar_tabs', 'toolbar_buttons',
    ...TABS.flatMap((t) => t.sections.flatMap((s) => s.entries)).flatMap((e) => (e.kind === 'category' ? [e.baseKey] : [])),
    ...NOT_CONNECTED.map((n) => n.baseKey),
  ]);
  const unplaced = Array.from(groups.keys()).filter((k) => !placed.has(k));
  const matches = (scope?: string) => !scope || scope.toUpperCase() === 'BOTH' || scope.toUpperCase() === material;
  const visibleTabs = TABS.filter((block) => tabs.includes(block.tab)).map((block) => ({
    ...block,
    sections: block.sections
      .filter((section) => matches(section.scope))
      .map((section) => ({
        ...section,
        entries: section.entries.filter((e) => e.kind !== 'category' || !e.seed || matches(e.seed.scope)),
      }))
      .filter((section) => section.entries.length > 0),
  })).filter((block) => block.sections.length > 0);

  // Creates the list in the database from what the storefront shows today, so the
  // team can start editing (rename, re-price, change icons, hide, delete, add).
  // Safe against a flaky connection: every step is retried, a half-built list is picked up
  // where it stopped instead of starting over, and customers only see it once every item is in.
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  async function withRetry<T>(work: () => Promise<T>, onFail?: () => Promise<boolean>): Promise<T | undefined> {
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        return await work();
      } catch (error) {
        if (attempt === 4) throw error;
        await wait(400 * attempt);
        // The failed call may have gone through before the connection dropped; do not repeat it if so.
        if (onFail && (await onFail().catch(() => false))) return undefined;
      }
    }
    return undefined;
  }

  const seedCategory = async (baseKey: string, seed: SeedSpec, draft?: OptionCategoryListItem) => {
    setSeeding(baseKey);
    try {
      let id = draft?.id;
      if (!id) {
        const created = await withRetry(
          () =>
            apiClient.post<{ id: string }>('/admin/option-categories', {
              baseKey,
              materialScope: seed.scope,
              name: seed.name,
              isActive: false,
            }),
          async () => {
            const list = await apiClient.get<OptionCategoryListItem[]>('/admin/option-categories');
            const found = list.find((c) => c.baseKey === baseKey && c.materialScope === seed.scope && !c.isActive);
            if (found) id = found.id;
            return !!found;
          },
        );
        if (created) id = created.id;
      }
      if (!id) throw new Error('no list');
      const listId = id;
      const countItems = async () => (await apiClient.get<OptionCategoryListItem>(`/admin/option-categories/${listId}`)).items.length;
      for (let index = draft?.items.length ?? 0; index < seed.items.length; index++) {
        setProgress(`${index} of ${seed.items.length}`);
        const item = seed.items[index];
        await withRetry(
          () =>
            apiClient.post(`/admin/option-categories/${listId}/items`, {
              label: item.label,
              description: item.description || undefined,
              priceMode: 'FLAT',
              flatPrice: item.flatPrice,
              extras: item.extras,
            }),
          async () => (await countItems()) > index,
        );
      }
      await withRetry(() => apiClient.patch(`/admin/option-categories/${listId}`, { isActive: true }));
      await queryClient.invalidateQueries({ queryKey: ['option-categories'] });
      toast.success('Ready to edit. The storefront now reads this list.');
    } catch {
      toast.error('Setup paused because the connection kept dropping. Press "Finish setup" to continue where it stopped.');
      await queryClient.invalidateQueries({ queryKey: ['option-categories'] });
    } finally {
      setSeeding(null);
      setProgress('');
    }
  };

  const renderVariantRows = (baseKey: string, seed?: SeedSpec) => {
    const variants = groups.get(baseKey)?.filter((v) => v.materialScope === material || v.materialScope === 'BOTH');
    if (!variants || variants.length === 0) {
      if (seed && hasPermission('option_catalog.manage')) {
        return (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Showing the built-in options. Set up to make them editable.
            </p>
            <Button size="sm" disabled={seeding === baseKey} onClick={() => void seedCategory(baseKey, seed)}>
              {seeding === baseKey ? `Setting up… ${progress}` : 'Set up from current options'}
            </Button>
          </div>
        );
      }
      return <p className="text-xs text-muted-foreground">Not set up yet.</p>;
    }
    return variants.map((variant) => (
      <div key={variant.id} className="space-y-1.5">
      <button
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
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          {!variant.isActive && <Badge variant="outline">Inactive</Badge>}
          Edit <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </button>
      {seed && !variant.isActive && variant.items.length < seed.items.length && hasPermission('option_catalog.manage') && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Setup stopped at {variant.items.length} of {seed.items.length}. Customers still see the built-in options.</span>
          <Button size="sm" disabled={seeding === baseKey} onClick={() => void seedCategory(baseKey, seed, variant)}>
            {seeding === baseKey ? `Setting up… ${progress}` : 'Finish setup'}
          </Button>
        </div>
      )}
      </div>
    ));
  };

  const renderEntry = (entry: Entry, single: boolean) => {
    if (entry.kind === 'category') {
      return (
        <Card key={entry.baseKey}>
          {!single && entry.title && (
            <CardHeader>
              <CardTitle className="text-sm">{entry.title}</CardTitle>
            </CardHeader>
          )}
          <CardContent className={`space-y-2 ${single || !entry.title ? 'pt-4' : ''}`}>
            {renderVariantRows(entry.baseKey, entry.seed)}
          </CardContent>
        </Card>
      );
    }
    if (entry.kind === 'link') {
      return (
        <Link key={entry.title} href={entry.href} className="block">
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm">
                {entry.title}
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription className="text-xs">{entry.note}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      );
    }
    return (
      <Card key={entry.title} className="border-dashed bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            {entry.title}
            <Badge variant="outline">Fixed in code</Badge>
          </CardTitle>
          <CardDescription className="text-xs">{entry.note}</CardDescription>
        </CardHeader>
      </Card>
    );
  };

  return (
    <div className="space-y-10">
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load option categories.</p>
      ) : (
        <>
          {visibleTabs.map((block) => (
            <section key={block.tab} className="space-y-5">
              {(visibleTabs.length > 1 || block.note) && (
                <div className="border-b pb-2">
                  {visibleTabs.length > 1 && <h2 className="text-lg font-semibold tracking-wide">{block.tab}</h2>}
                  {block.note && <p className="text-xs text-muted-foreground">{block.note}</p>}
                </div>
              )}
              {block.sections.map((section) => (
                <div key={section.heading} className="space-y-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    {section.heading}
                    {section.scope && <Badge variant="outline">{section.scope} only</Badge>}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {section.entries.map((entry) => renderEntry(entry, section.entries.length === 1))}
                  </div>
                </div>
              ))}
              {block.footnote && <p className="text-xs text-muted-foreground">{block.footnote}</p>}
            </section>
          ))}

          {tabs.includes('OPTIONS') && <section className="space-y-5">
            <div className="border-b pb-2">
              <h2 className="text-lg font-semibold tracking-wide">NOT CONNECTED TO THE STOREFRONT YET</h2>
              <p className="text-xs text-muted-foreground">
                These lists exist here, but no storefront screen reads them, so editing them changes nothing
                for customers today.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {NOT_CONNECTED.filter((n) => groups.has(n.baseKey)).map((n) => (
                <Card key={n.baseKey}>
                  <CardHeader>
                    <CardTitle className="text-sm">{n.title}</CardTitle>
                    <CardDescription className="text-xs">{n.hint}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">{renderVariantRows(n.baseKey)}</CardContent>
                </Card>
              ))}
              {unplaced.map((baseKey) => (
                <Card key={baseKey}>
                  <CardHeader>
                    <CardTitle className="text-sm">{groups.get(baseKey)![0].name}</CardTitle>
                    <CardDescription className="text-xs">Not mapped to a storefront section.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">{renderVariantRows(baseKey)}</CardContent>
                </Card>
              ))}
            </div>
          </section>}
        </>
      )}
    </div>
  );
}
