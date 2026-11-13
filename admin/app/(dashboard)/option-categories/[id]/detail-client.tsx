'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { OptionCategoryItem, OptionCategoryListItem } from '@/lib/types/option-category';
import { usePermission } from '@/lib/auth/use-permission';
import { useRecordId } from '@/lib/use-record-id';
import type { EditableItem } from '@/lib/customizer-options';
import { OptionItemsEditor } from '@/components/option-items-editor';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const toEditable = (item: OptionCategoryItem): EditableItem => ({
  id: item.id,
  label: item.label,
  description: item.description ?? '',
  imageUrl: item.imageUrl ?? '',
  priceMode: item.priceMode,
  flatPrice: Number(item.flatPrice) || 0,
  areaRatePerSqIn: item.areaRatePerSqIn ? Number(item.areaRatePerSqIn) : null,
  hidden: !item.isActive,
  extras: { ...(item.extras ?? {}) },
});

const toPayload = (item: EditableItem) => ({
  label: item.label,
  description: item.description || undefined,
  imageUrl: item.imageUrl || undefined,
  priceMode: item.priceMode,
  flatPrice: item.priceMode === 'FLAT' ? String(item.flatPrice || 0) : '0',
  areaRatePerSqIn: item.priceMode === 'AREA_RATE' ? String(item.areaRatePerSqIn ?? 0) : undefined,
  isActive: !item.hidden,
  extras: item.extras,
});

export function OptionCategoryDetailClient({ id: initialId }: { id: string }) {
  const id = useRecordId(initialId);
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canManage = hasPermission('option_catalog.manage');

  const { data: category, isLoading, isError, refetch } = useQuery({
    queryKey: ['option-categories', id],
    enabled: !!id && id !== 'placeholder',
    queryFn: () => apiClient.get<OptionCategoryListItem>(`/admin/option-categories/${id}`),
  });

  // Shown immediately while each change is sent to the server in the background.
  const [items, setItems] = useState<EditableItem[]>([]);
  const serverItems = useRef<EditableItem[]>([]);
  const queue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    if (category) {
      const next = [...category.items].sort((a, b) => a.sortOrder - b.sortOrder).map(toEditable);
      serverItems.current = next;
      setItems(next);
    }
  }, [category]);

  const sync = (next: EditableItem[]) => {
    setItems(next);
    queue.current = queue.current.then(async () => {
      try {
        const before = serverItems.current;
        const beforeIds = new Set(before.map((i) => i.id));
        const nextIds = new Set(next.map((i) => i.id));
        for (const gone of before.filter((i) => !nextIds.has(i.id))) {
          await apiClient.delete(`/admin/option-categories/items/${gone.id}`);
        }
        for (const added of next.filter((i) => !beforeIds.has(i.id))) {
          await apiClient.post(`/admin/option-categories/${id}/items`, toPayload(added));
        }
        for (const kept of next.filter((i) => beforeIds.has(i.id))) {
          const old = before.find((i) => i.id === kept.id)!;
          if (JSON.stringify(old) !== JSON.stringify(kept)) {
            await apiClient.patch(`/admin/option-categories/items/${kept.id}`, toPayload(kept));
          }
        }
        const sameSet = next.length === before.length && next.every((i) => beforeIds.has(i.id));
        const orderChanged = sameSet && next.some((i, index) => before[index]?.id !== i.id);
        if (orderChanged) {
          await apiClient.put(`/admin/option-categories/${id}/items/reorder`, { itemIds: next.map((i) => i.id) });
        }
        toast.success('Saved');
      } catch (err) {
        setItems(serverItems.current);
        toast.error(err instanceof ApiError ? err.message : 'Could not save that change. It has been undone.');
      } finally {
        await queryClient.invalidateQueries({ queryKey: ['option-categories'] });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">Couldn&apos;t load this list.</p>
        <button className="text-sm underline" onClick={() => void refetch()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/customization?tab=options"
            className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to options
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            These are the shared options every product uses unless it has its own copy under Product customization.
            Changes here are saved as you make them.
          </p>
        </div>
        <Badge variant="outline">{category.materialScope}</Badge>
      </div>

      <OptionItemsEditor baseKey={category.baseKey} items={items} canEdit={canManage} onChange={sync} />
    </div>
  );
}
