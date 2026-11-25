'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { OptionCategoryItem, OptionCategoryListItem } from '@/lib/types/option-category';
import { Button } from '@/components/ui/button';

export interface ManagedBox {
  /** Stable id, saved with the box (`extras.id`). */
  id: string;
  /** The built-in name, used until it is renamed. */
  label: string;
  /** Extra content under the name (counts, notes). */
  body?: ReactNode;
  /** Clicking the box (outside its controls). */
  onOpen?: () => void;
}

/**
 * Position, name and visibility for a set of boxes, kept in one option list (`baseKey`) so the
 * storefront can read them. The list is created the first time anything is changed.
 */
function useManagedOrder<T extends { id: string; label: string }>(
  baseKey: string,
  listName: string,
  boxes: T[],
  canManage: boolean,
  /** Every box the list should hold (even ones not on screen, e.g. the other material's), so none looks hidden to the storefront. */
  seed: { id: string; label: string }[] = boxes,
) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const { data } = useQuery({
    queryKey: ['option-categories'],
    queryFn: () => apiClient.get<OptionCategoryListItem[]>('/admin/option-categories'),
  });
  const list = data?.find((c) => c.baseKey === baseKey && c.materialScope === 'BOTH' && c.isActive);
  // The overview only carries item ids, so load the list itself for names, order and visibility.
  const { data: detail } = useQuery({
    queryKey: ['option-categories', list?.id],
    enabled: Boolean(list?.id),
    queryFn: () => apiClient.get<OptionCategoryListItem>('/admin/option-categories/' + list!.id),
  });
  const items: OptionCategoryItem[] = detail ? [...detail.items].sort((a, b) => a.sortOrder - b.sortOrder) : [];
  const itemFor = (id: string) => items.find((i) => String(i.extras?.id ?? '') === id);

  // Boxes with a saved item come first in saved order; any new box follows in its built-in order.
  const ordered = boxes
    .map((box, index) => ({ box, item: itemFor(box.id), index }))
    .sort((a, b) => (a.item ? a.item.sortOrder : 1e9 + a.index) - (b.item ? b.item.sortOrder : 1e9 + b.index));

  const run = async (work: () => Promise<unknown>, done?: string) => {
    setBusy(true);
    try {
      await work();
      await queryClient.invalidateQueries({ queryKey: ['option-categories'] });
      if (done) toast.success(done);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not save that change.');
      await queryClient.invalidateQueries({ queryKey: ['option-categories'] });
    } finally {
      setBusy(false);
    }
  };

  /** Makes sure the list and one item per box exist, so any change can be saved. Returns the list id. */
  const ensureAll = async (): Promise<string> => {
    let listId = list?.id;
    if (!listId) {
      const created = await apiClient.post<{ id: string }>('/admin/option-categories', {
        baseKey,
        materialScope: 'BOTH',
        name: listName,
        isActive: false,
      });
      listId = created.id;
    }
    const have = new Set(items.map((i) => String(i.extras?.id ?? '')));
    for (const box of seed) {
      if (have.has(box.id)) continue;
      await apiClient.post(`/admin/option-categories/${listId}/items`, {
        label: box.label,
        priceMode: 'FLAT',
        flatPrice: '0',
        extras: { id: box.id },
      });
    }
    if (!list?.id) await apiClient.patch(`/admin/option-categories/${listId}`, { isActive: true });
    return listId;
  };

  const freshItems = async (listId: string) => {
    const full = await apiClient.get<OptionCategoryListItem>(`/admin/option-categories/${listId}`);
    return new Map(full.items.map((i) => [String(i.extras?.id ?? ''), i] as const));
  };

  const move = (position: number, by: number) => {
    const target = position + by;
    if (target < 0 || target >= ordered.length) return;
    const order = ordered.map((r) => r.box.id);
    [order[position], order[target]] = [order[target], order[position]];
    void run(async () => {
      const listId = await ensureAll();
      const byId = await freshItems(listId);
      const ids = order.map((id) => byId.get(id)!.id);
      // Boxes not on screen keep their places after these.
      for (const other of byId.values()) if (!ids.includes(other.id)) ids.push(other.id);
      await apiClient.put(`/admin/option-categories/${listId}/items/reorder`, { itemIds: ids });
    }, 'Position saved');
  };

  const patch = (boxId: string, body: Record<string, unknown>, done: string) =>
    run(async () => {
      const listId = await ensureAll();
      const byId = await freshItems(listId);
      await apiClient.patch(`/admin/option-categories/items/${byId.get(boxId)!.id}`, body);
    }, done);

  const saveName = (boxId: string, current: string) => {
    const next = (drafts[boxId] ?? current).trim();
    setDrafts((d) => {
      const copy = { ...d };
      delete copy[boxId];
      return copy;
    });
    if (!next || next === current) return;
    void patch(boxId, { label: next }, 'Name saved');
  };

  const info = (id: string) => {
    const position = ordered.findIndex((r) => r.box.id === id);
    const row = ordered[position];
    const hidden = Boolean(row?.item) && !row!.item!.isActive;
    const builtIn = row?.box.label ?? '';
    return {
      position,
      count: ordered.length,
      hidden,
      savedName: row?.item?.label ?? builtIn,
      shownName: drafts[id] ?? row?.item?.label ?? builtIn,
    };
  };

  return { ordered, busy, canManage, drafts, setDrafts, move, patch, saveName, info };
}

type ManagedOrder = ReturnType<typeof useManagedOrder<{ id: string; label: string; onOpen?: () => void; body?: ReactNode }>>;

/** Number badge, move arrows, Hide switch and name field for one box. */
function Controls({ order, id, label }: { order: ManagedOrder; id: string; label: string }) {
  const { position, count, hidden, savedName, shownName } = order.info(id);
  const disabled = !order.canManage || order.busy;
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between gap-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
            hidden ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
          }`}
          title="Position in the storefront"
        >
          {position + 1}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={disabled || position === 0}
            onClick={() => order.move(position, -1)}
            className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
            title="Move earlier"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={disabled || position === count - 1}
            onClick={() => order.move(position, 1)}
            className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
            title="Move later"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => void order.patch(id, { isActive: hidden }, hidden ? 'Shown' : 'Hidden')}
            className="h-7 gap-1 px-1.5 text-xs text-muted-foreground"
            title={hidden ? 'Show this in the storefront' : 'Hide this from the storefront'}
          >
            {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {hidden ? 'Hidden' : 'Hide'}
          </Button>
        </div>
      </div>
      <input
        value={shownName}
        disabled={disabled}
        onChange={(e) => order.setDrafts((d) => ({ ...d, [id]: e.target.value }))}
        onBlur={() => order.saveName(id, savedName)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        aria-label={`Name of ${label}`}
        className="mt-3 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm font-semibold disabled:border-transparent disabled:bg-transparent"
      />
    </div>
  );
}

/** A grid of numbered boxes, each with its own rename, Hide and move controls. */
export function ManagedBoxes({
  baseKey,
  listName,
  boxes,
  canManage,
  columns = 'md:grid-cols-2 lg:grid-cols-3',
}: {
  baseKey: string;
  listName: string;
  boxes: ManagedBox[];
  canManage: boolean;
  columns?: string;
}) {
  const order = useManagedOrder(baseKey, listName, boxes, canManage);
  return (
    <div className={`grid gap-4 ${columns}`}>
      {order.ordered.map(({ box }) => {
        const { hidden } = order.info(box.id);
        return (
          <div
            key={box.id}
            onClick={box.onOpen}
            className={`rounded-xl border bg-card p-3 shadow-sm transition ${box.onOpen ? 'cursor-pointer hover:border-primary/50' : ''} ${
              hidden ? 'opacity-60' : ''
            }`}
          >
            <Controls order={order} id={box.id} label={box.label} />
            {box.body && <div className="mt-2">{box.body}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The same controls placed on boxes that already exist elsewhere on a page.
// ---------------------------------------------------------------------------

const OrderContext = createContext<{ order: ManagedOrder; labels: Record<string, string> } | null>(null);

/** Gives every box inside it (see `useManagedBox`) one shared position list. */
export function ManagedOrderProvider({
  baseKey,
  listName,
  boxes,
  seed,
  canManage,
  children,
}: {
  baseKey: string;
  listName: string;
  boxes: { id: string; label: string }[];
  seed?: { id: string; label: string }[];
  canManage: boolean;
  children: ReactNode;
}) {
  const order = useManagedOrder(baseKey, listName, boxes, canManage, seed);
  const labels = Object.fromEntries(boxes.map((b) => [b.id, b.label]));
  return <OrderContext.Provider value={{ order, labels }}>{children}</OrderContext.Provider>;
}

/** Controls and state for a box managed by the nearest provider, or null if `id` is not one of them. */
export function useManagedBox(id: string) {
  const ctx = useContext(OrderContext);
  if (!ctx || !(id in ctx.labels)) return null;
  const { position, hidden } = ctx.order.info(id);
  return {
    position,
    hidden,
    controls: <Controls order={ctx.order} id={id} label={ctx.labels[id]} />,
  };
}

/** Position of every box under the nearest provider, or null when there is none. */
export function useManagedPositions(): Record<string, number> | null {
  const ctx = useContext(OrderContext);
  if (!ctx) return null;
  return Object.fromEntries(Object.keys(ctx.labels).map((id) => [id, ctx.order.info(id).position]));
}
