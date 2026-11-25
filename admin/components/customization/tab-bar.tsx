'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { OptionCategoryListItem } from '@/lib/types/option-category';
import { Button } from '@/components/ui/button';

/** One tab of the Customization page and the storefront sidebar tab it controls. */
export interface BarTab {
  key: string;
  label: string;
  /** The id the storefront uses for this tab. */
  storefrontId: string;
}

const BASE_KEY = 'sidebar_tabs';

/**
 * The horizontal tab bar of the Customization page. Each tab is a box showing its position in the
 * storefront sidebar, with a rename field, a hide switch and arrows to move it. The position,
 * name and visibility are the same ones the storefront's left-hand tabs use.
 */
export function TabBar({
  tabs,
  active,
  onSelect,
  canManage,
  seedTabs,
}: {
  tabs: BarTab[];
  active: string;
  onSelect: (key: string) => void;
  canManage: boolean;
  /** Every tab, so turning controls on never hides one this person cannot open. */
  seedTabs: BarTab[];
}) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const { data } = useQuery({
    queryKey: ['option-categories'],
    queryFn: () => apiClient.get<OptionCategoryListItem[]>('/admin/option-categories'),
  });
  const list = data?.find((c) => c.baseKey === BASE_KEY && c.materialScope === 'BOTH' && c.isActive);
  const stored = list ? [...list.items].sort((a, b) => a.sortOrder - b.sortOrder) : null;

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['option-categories'] });
  const run = async (work: () => Promise<unknown>, done?: string) => {
    setBusy(true);
    try {
      await work();
      await refresh();
      if (done) toast.success(done);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not save that change.');
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const setUp = () =>
    run(async () => {
      const created = await apiClient.post<{ id: string }>('/admin/option-categories', {
        baseKey: BASE_KEY,
        materialScope: 'BOTH',
        name: 'Customizer sidebar tabs',
        isActive: false,
      });
      for (const tab of seedTabs) {
        await apiClient.post(`/admin/option-categories/${created.id}/items`, {
          label: tab.label,
          priceMode: 'FLAT',
          flatPrice: '0',
          extras: { id: tab.storefrontId },
        });
      }
      await apiClient.patch(`/admin/option-categories/${created.id}`, { isActive: true });
    }, 'Tab controls are on. The storefront now follows this order, these names and what is hidden.');

  // Boxes in position order. Before setup they follow the built-in order.
  const rows = tabs
    .map((tab) => ({ tab, item: stored?.find((i) => String(i.extras?.id ?? '') === tab.storefrontId) }))
    .map((row, index) => ({ ...row, index }));
  const ordered = stored
    ? [...rows].sort((a, b) => (a.item?.sortOrder ?? 9999) - (b.item?.sortOrder ?? 9999) || a.index - b.index)
    : rows;

  const move = (position: number, by: number) => {
    if (!stored || !list) return;
    const target = position + by;
    if (target < 0 || target >= ordered.length) return;
    const ids = ordered.map((r) => r.item?.id).filter(Boolean) as string[];
    if (ids.length !== ordered.length) return;
    [ids[position], ids[target]] = [ids[target], ids[position]];
    void run(() => apiClient.put(`/admin/option-categories/${list.id}/items/reorder`, { itemIds: ids }), 'Position saved');
  };

  const patch = (itemId: string, body: Record<string, unknown>, done: string) =>
    run(() => apiClient.patch(`/admin/option-categories/items/${itemId}`, body), done);

  const saveName = (itemId: string, current: string, key: string) => {
    const next = (drafts[key] ?? current).trim();
    setDrafts((d) => {
      const copy = { ...d };
      delete copy[key];
      return copy;
    });
    if (!next || next === current) return;
    void patch(itemId, { label: next }, 'Name saved');
  };

  return (
    <div className="space-y-2">
      {canManage && !stored && (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          <span>The storefront shows its built-in tabs. Turn on tab controls to rename, move or hide them.</span>
          <Button size="sm" disabled={busy} onClick={() => void setUp()}>
            {busy ? 'Setting up…' : 'Turn on tab controls'}
          </Button>
        </div>
      )}
      <div className="flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Customizer tabs">
        {ordered.map(({ tab, item }, position) => {
          const hidden = Boolean(stored) && (!item || !item.isActive);
          const name = drafts[tab.key] ?? item?.label ?? tab.label;
          const selected = active === tab.key;
          const editable = canManage && Boolean(item);
          return (
            <div
              key={tab.key}
              role="tab"
              aria-selected={selected}
              tabIndex={0}
              onClick={() => onSelect(tab.key)}
              onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) onSelect(tab.key);
              }}
              className={`min-w-[190px] flex-1 cursor-pointer rounded-xl border bg-card p-3 text-left shadow-sm transition ${
                selected ? 'border-primary ring-2 ring-primary/30' : 'hover:border-primary/50'
              } ${hidden ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                    hidden ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
                  }`}
                  title="Position in the storefront sidebar"
                >
                  {position + 1}
                </span>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    disabled={!editable || busy || position === 0}
                    onClick={() => move(position, -1)}
                    className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                    title="Move earlier"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={!editable || busy || position === ordered.length - 1}
                    onClick={() => move(position, 1)}
                    className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                    title="Move later"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={!editable || busy}
                    onClick={() => item && void patch(item.id, { isActive: hidden }, hidden ? 'Shown in the storefront' : 'Hidden from the storefront')}
                    className="flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-30"
                    title={hidden ? 'Show this tab in the storefront' : 'Hide this tab from the storefront'}
                  >
                    {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {hidden ? 'Hidden' : 'Hide'}
                  </button>
                </div>
              </div>
              <input
                value={name}
                disabled={!editable || busy}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setDrafts((d) => ({ ...d, [tab.key]: e.target.value }))}
                onBlur={() => item && saveName(item.id, item.label, tab.key)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                }}
                aria-label={`Name of the ${tab.label} tab`}
                className="mt-3 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm font-semibold disabled:border-transparent disabled:bg-transparent"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
