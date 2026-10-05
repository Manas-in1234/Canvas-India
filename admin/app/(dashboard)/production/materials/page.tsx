'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { CreateMaterialInput, RawMaterial } from '@/lib/types/production';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/lib/auth/use-permission';
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

const emptyForm: CreateMaterialInput = { name: '', unit: '' };

export default function MaterialsPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canAdjust = hasPermission('materials.adjust');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['materials'],
    queryFn: () => apiClient.get<RawMaterial[]>('/production/materials'),
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateMaterialInput>(emptyForm);

  const [adjustItem, setAdjustItem] = useState<RawMaterial | null>(null);
  const [quantity, setQuantity] = useState('');

  const createMutation = useMutation({
    mutationFn: (input: CreateMaterialInput) => apiClient.post('/production/materials', input),
    onSuccess: () => {
      toast.success('Material created');
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      setCreateOpen(false);
      setForm(emptyForm);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create material');
    },
  });

  const adjustMutation = useMutation({
    mutationFn: (input: { rawMaterialId: string; quantity: string }) =>
      apiClient.post('/production/materials/adjust', input),
    onSuccess: () => {
      toast.success('Stock adjusted');
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      setAdjustItem(null);
      setQuantity('');
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to adjust stock');
    },
  });

  const columns: DataTableColumn<RawMaterial>[] = [
    { header: 'Name', cell: (row) => <span className="font-medium">{row.name}</span> },
    { header: 'Unit', cell: (row) => row.unit },
    { header: 'Available', cell: (row) => row.available },
    { header: 'Reserved', cell: (row) => row.reserved },
    {
      header: 'Status',
      cell: (row) =>
        Number(row.available) <= Number(row.reorderLevel) ? (
          <Badge variant="outline" className="border-0 bg-amber-100 font-medium text-amber-800">
            Low stock
          </Badge>
        ) : (
          <Badge variant="outline" className="border-0 bg-emerald-100 font-medium text-emerald-800">
            OK
          </Badge>
        ),
    },
    ...(canAdjust
      ? [
          {
            header: '',
            cell: (row: RawMaterial) => (
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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem || !quantity) return;
    adjustMutation.mutate({ rawMaterialId: adjustItem.id, quantity });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Raw Materials</h1>
          <p className="text-sm text-muted-foreground">Stock used in production, separate from finished-product inventory.</p>
        </div>
        {canAdjust && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Material
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load materials.</p>
      ) : (
        <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} emptyMessage="No materials yet." />
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Material</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Canvas Roll, Ink"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                placeholder="e.g. meters, ml, units"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorderLevel">Reorder Level (optional)</Label>
              <Input
                id="reorderLevel"
                type="number"
                min="0"
                value={form.reorderLevel ?? ''}
                onChange={(e) => setForm({ ...form, reorderLevel: e.target.value || undefined })}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating…' : 'Create Material'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={adjustItem !== null} onOpenChange={(open) => !open && setAdjustItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              {adjustItem?.name} — currently {adjustItem?.available} {adjustItem?.unit} available.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity change</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Positive to add, negative to remove"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
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
