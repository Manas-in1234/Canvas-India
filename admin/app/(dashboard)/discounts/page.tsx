'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DiscountExpiryFields } from '@/components/discount-expiry-fields';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { Discount } from '@/lib/types/growth';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { buttonVariants, Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function DiscountsPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canManage = hasPermission('discounts.manage');
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [neverExpires, setNeverExpires] = useState(true);
  const [expiryDate, setExpiryDate] = useState('');
  const [fields, setFields] = useState({ description: '', discountType: 'PERCENTAGE', value: '', minOrderSubtotal: '', usageLimit: '' });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['discounts'],
    queryFn: () => apiClient.get<Discount[]>('/growth/discounts'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch(`/growth/discounts/${id}`, { isActive }),
    onSuccess: () => {
      toast.success('Discount updated');
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update discount');
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, expiresAt }: { id: string; expiresAt: string | null }) =>
      apiClient.patch(`/growth/discounts/${id}`, {
        description: fields.description.trim(),
        discountType: fields.discountType,
        value: Number(fields.value),
        minOrderSubtotal: fields.minOrderSubtotal === '' ? null : Number(fields.minOrderSubtotal),
        usageLimit: fields.usageLimit === '' ? null : Number(fields.usageLimit),
        expiresAt,
      }),
    onSuccess: () => {
      setEditingDiscount(null);
      void queryClient.invalidateQueries({ queryKey: ['discounts'] });
      toast.success('Discount updated');
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update discount');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/growth/discounts/${id}`),
    onSuccess: () => {
      toast.success('Discount deleted');
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete discount');
    },
  });

  const columns: DataTableColumn<Discount>[] = [
    { header: 'Code', cell: (row) => <span className="font-mono font-medium">{row.code}</span> },
    {
      header: 'Value',
      cell: (row) => (row.discountType === 'PERCENTAGE' ? `${row.value}%` : `₹${row.value}`),
    },
    { header: 'Usage', cell: (row) => `${row.usageCount}${row.usageLimit ? ` / ${row.usageLimit}` : ''}` },
    {
      header: 'Status',
      cell: (row) =>
        row.isActive ? (
          <Badge variant="outline" className="border-0 bg-emerald-100 font-medium text-emerald-800">
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="border-0 bg-muted font-medium">
            Inactive
          </Badge>
        ),
    },
    { header: 'Expires', cell: (row) => (row.expiresAt ? formatDate(row.expiresAt) : 'Never expires') },
    ...(canManage
      ? [
          {
            header: '',
            cell: (row: Discount) => (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setFields({
                    description: row.description ?? '',
                    discountType: row.discountType,
                    value: String(row.value),
                    minOrderSubtotal: row.minOrderSubtotal == null ? '' : String(row.minOrderSubtotal),
                    usageLimit: row.usageLimit == null ? '' : String(row.usageLimit),
                  });
                  setNeverExpires(!row.expiresAt);
                  setExpiryDate(row.expiresAt?.slice(0, 10) ?? '');
                  setEditingDiscount(row);
                }}>Edit</Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={toggleMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMutation.mutate({ id: row.id, isActive: !row.isActive });
                  }}
                >
                  {row.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(row.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Discounts</h1>
          <p className="text-sm text-muted-foreground">Discount codes customers can apply at checkout.</p>
        </div>
        {canManage && (
          <Link href="/discounts/new" className={cn(buttonVariants({ variant: 'default' }))}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Discount
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load discounts.</p>
      ) : (
        <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} emptyMessage="No discounts yet." />
      )}
      <Dialog open={editingDiscount !== null} onOpenChange={open => {
        if (!open && !editMutation.isPending) setEditingDiscount(null);
      }}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit discount</DialogTitle>
            <DialogDescription>{editingDiscount?.code}</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={event => {
            event.preventDefault();
            if (!editingDiscount || editMutation.isPending) return;
            const current = editingDiscount.expiresAt;
            const expiresAt = neverExpires ? null : current?.slice(0, 10) === expiryDate
              ? current : new Date(expiryDate).toISOString();
            editMutation.mutate({ id: editingDiscount.id, expiresAt });
          }}>
            <div className="space-y-2">
              <Label htmlFor="edit-discount-description">Description</Label>
              <Input id="edit-discount-description" value={fields.description}
                onChange={event => setFields({ ...fields, description: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-discount-type">Type</Label>
              <select id="edit-discount-type" className="h-9 w-full rounded-md border bg-background px-2"
                value={fields.discountType} onChange={event => setFields({ ...fields, discountType: event.target.value })}>
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed amount (₹)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-discount-value">Value</Label>
              <Input id="edit-discount-value" type="number" min="0.01" step="0.01"
                max={fields.discountType === 'PERCENTAGE' ? 100 : undefined} required value={fields.value}
                onChange={event => setFields({ ...fields, value: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-discount-minimum">Minimum subtotal (₹)</Label>
              <Input id="edit-discount-minimum" type="number" min="0" step="0.01" value={fields.minOrderSubtotal}
                onChange={event => setFields({ ...fields, minOrderSubtotal: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-discount-limit">Usage limit</Label>
              <Input id="edit-discount-limit" type="number" min="1" step="1" value={fields.usageLimit}
                onChange={event => setFields({ ...fields, usageLimit: event.target.value })} />
            </div>
            <DiscountExpiryFields neverExpires={neverExpires} setNeverExpires={setNeverExpires}
              date={expiryDate} setDate={setExpiryDate} />
            <DialogFooter>
              <Button type="submit" disabled={editMutation.isPending}>
                {editMutation.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
