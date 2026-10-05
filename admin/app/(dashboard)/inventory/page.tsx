'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, ApiError } from '@/lib/api-client';
import type { InventoryItem } from '@/lib/types/inventory';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function InventoryPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canAdjust = hasPermission('inventory.adjust');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => apiClient.get<InventoryItem[]>('/inventory'),
  });

  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const adjustMutation = useMutation({
    mutationFn: (input: { variantId: string; quantity: number; reason?: string }) =>
      apiClient.post('/inventory/adjust', input),
    onSuccess: () => {
      toast.success('Inventory adjusted');
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setAdjustItem(null);
      setQuantity('');
      setReason('');
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to adjust inventory');
    },
  });

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem) return;
    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty === 0) return;
    adjustMutation.mutate({ variantId: adjustItem.variantId, quantity: qty, reason: reason || undefined });
  };

  const columns: DataTableColumn<InventoryItem>[] = [
    { header: 'SKU', cell: (row) => <span className="font-mono text-xs">{row.variant.sku}</span> },
    { header: 'Available', cell: (row) => row.available },
    { header: 'Reserved', cell: (row) => row.reserved },
    { header: 'Damaged', cell: (row) => row.damaged },
    {
      header: 'Status',
      cell: (row) =>
        row.available <= row.reorderLevel ? (
          <Badge variant="outline" className="border-0 bg-amber-100 font-medium text-amber-800">
            Low stock
          </Badge>
        ) : (
          <Badge variant="outline" className="border-0 bg-emerald-100 font-medium text-emerald-800">
            In stock
          </Badge>
        ),
    },
    { header: 'Updated', cell: (row) => formatDate(row.updatedAt) },
    ...(canAdjust
      ? [
          {
            header: '',
            cell: (row: InventoryItem) => (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setAdjustItem(row);
                }}
              >
                Adjust
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">Stock levels per product variant.</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load inventory.</p>
      ) : (
        <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} emptyMessage="No inventory items yet." />
      )}

      <Dialog open={adjustItem !== null} onOpenChange={(open) => !open && setAdjustItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              {adjustItem && <span className="font-mono text-xs">{adjustItem.variant.sku}</span>} — currently{' '}
              {adjustItem?.available} available.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity change</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="e.g. 10 to add, -5 to remove"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={adjustMutation.isPending}>
                {adjustMutation.isPending ? 'Saving…' : 'Apply Adjustment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
