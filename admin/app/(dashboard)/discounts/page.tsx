'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DiscountExpiryFields } from '@/components/discount-expiry-fields';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Users, Sparkles } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { Discount, DiscountType } from '@/lib/types/growth';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { buttonVariants, Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { parseDiscountDescription, formatDiscountDescription } from '@/lib/discount-tier';

const extraNumbers = [
  { key: 'maxDiscountAmount', label: 'Maximum discount (₹)', min: '0.01', step: '0.01' },
  { key: 'perCustomerLimit', label: 'Usage limit per customer', min: '1', step: '1' },
] as const;

const optionalNumber = (value: string) => (value === '' ? null : Number(value));

export default function DiscountsPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canManage = hasPermission('discounts.manage');
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [neverExpires, setNeverExpires] = useState(true);
  const [expiryDate, setExpiryDate] = useState('');

  // Initial users special discount tier
  const [hasInitialTier, setHasInitialTier] = useState(false);
  const [initialUsersCount, setInitialUsersCount] = useState('');
  const [initialUsersDiscount, setInitialUsersDiscount] = useState('');
  const [initialUsersDiscountType, setInitialUsersDiscountType] = useState<DiscountType>('PERCENTAGE');

  const [fields, setFields] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE' as DiscountType,
    value: '',
    minOrderSubtotal: '',
    usageLimit: '',
    maxDiscountAmount: '',
    perCustomerLimit: '',
    startDate: '',
    isActive: true,
    isExclusive: false,
    applicableCategoryIds: '',
    applicableProductIds: '',
    customerSegmentId: '',
    campaignId: '',
  });

  const { data, isLoading, isLoadingError: isError } = useQuery({
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
    mutationFn: ({ id, expiresAt }: { id: string; expiresAt: string | null }) => {
      const formattedDesc = formatDiscountDescription({
        note: fields.description,
        initialUsersCount: hasInitialTier && initialUsersCount ? Number(initialUsersCount) : null,
        initialUsersDiscount: hasInitialTier && initialUsersDiscount ? Number(initialUsersDiscount) : null,
        initialUsersDiscountType,
      });

      return apiClient.patch(`/growth/discounts/${id}`, {
        code: fields.code.trim().toUpperCase(),
        description: formattedDesc || null,
        maxDiscountAmount: optionalNumber(fields.maxDiscountAmount),
        perCustomerLimit: optionalNumber(fields.perCustomerLimit),
        startsAt: fields.startDate
          ? editingDiscount?.startsAt?.slice(0, 10) === fields.startDate
            ? editingDiscount.startsAt
            : new Date(fields.startDate).toISOString()
          : null,
        isActive: fields.isActive,
        isExclusive: fields.isExclusive,
        applicableCategoryIds: fields.applicableCategoryIds
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        applicableProductIds: fields.applicableProductIds
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        customerSegmentId: fields.customerSegmentId.trim() || null,
        campaignId: fields.campaignId.trim() || null,
        discountType: fields.discountType,
        value: Number(fields.value),
        minOrderSubtotal: fields.minOrderSubtotal === '' ? null : Number(fields.minOrderSubtotal),
        usageLimit: fields.usageLimit === '' ? null : Number(fields.usageLimit),
        expiresAt,
      });
    },
    onSuccess: () => {
      setEditingDiscount(null);
      void queryClient.invalidateQueries({ queryKey: ['discounts'] });
      toast.success('Discount updated successfully');
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
    {
      header: 'Code & Rules',
      cell: (row) => {
        const tier = parseDiscountDescription(row.description);
        const hasTier = Boolean(tier.initialUsersCount && tier.initialUsersDiscount);
        return (
          <div className="space-y-1">
            <span className="font-mono font-semibold text-sm">{row.code}</span>
            {hasTier && (
              <div>
                <Badge className="border-amber-300 bg-amber-100/90 text-amber-900 hover:bg-amber-100 text-[11px] font-semibold flex items-center gap-1 w-fit">
                  <Sparkles className="h-3 w-3 text-amber-600" />
                  Initial {tier.initialUsersCount} users get {tier.initialUsersDiscount}
                  {tier.initialUsersDiscountType === 'PERCENTAGE' ? '%' : '₹'} OFF
                </Badge>
              </div>
            )}
            {tier.note && <div className="text-xs text-muted-foreground">{tier.note}</div>}
          </div>
        );
      },
    },
    {
      header: 'Discount Value',
      cell: (row) => {
        const tier = parseDiscountDescription(row.description);
        const hasTier = Boolean(tier.initialUsersCount && tier.initialUsersDiscount);
        if (hasTier) {
          return (
            <div>
              <div className="font-semibold text-emerald-700">
                {tier.initialUsersDiscount}
                {tier.initialUsersDiscountType === 'PERCENTAGE' ? '%' : '₹'}{' '}
                <span className="text-xs font-normal text-muted-foreground">(Initial)</span>
              </div>
              <div className="text-xs text-muted-foreground">
                then {row.discountType === 'PERCENTAGE' ? `${row.value}%` : `₹${row.value}`}
              </div>
            </div>
          );
        }
        return (
          <span className="font-medium">
            {row.discountType === 'PERCENTAGE' ? `${row.value}%` : `₹${row.value}`}
          </span>
        );
      },
    },
    {
      header: 'Valid to Users / Usage',
      cell: (row) => {
        const tier = parseDiscountDescription(row.description);
        const hasTier = Boolean(tier.initialUsersCount && tier.initialUsersDiscount);
        return (
          <div>
            {row.usageLimit != null ? (
              <div className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                <Users className="h-3.5 w-3.5 text-primary" />
                Valid to {row.usageLimit} users
              </div>
            ) : (
              <div className="text-xs text-muted-foreground font-medium">Valid to unlimited users</div>
            )}
            <div className="text-xs text-muted-foreground mt-0.5">
              {row.usageCount} redeemed{' '}
              {row.usageLimit != null ? `(${Math.max(0, row.usageLimit - row.usageCount)} left)` : ''}
            </div>
            {hasTier && (
              <div className="text-[11px] font-medium text-amber-800 mt-0.5">
                Initial tier:{' '}
                <span className="font-semibold">
                  {Math.min(row.usageCount, tier.initialUsersCount!)} / {tier.initialUsersCount}
                </span>{' '}
                {row.usageCount >= tier.initialUsersCount! ? '(ended)' : 'claimed'}
              </div>
            )}
          </div>
        );
      },
    },
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const tier = parseDiscountDescription(row.description);
                    setHasInitialTier(Boolean(tier.initialUsersCount && tier.initialUsersDiscount));
                    setInitialUsersCount(tier.initialUsersCount ? String(tier.initialUsersCount) : '');
                    setInitialUsersDiscount(tier.initialUsersDiscount ? String(tier.initialUsersDiscount) : '');
                    setInitialUsersDiscountType(tier.initialUsersDiscountType || 'PERCENTAGE');

                    setFields({
                      code: row.code,
                      description: tier.note,
                      maxDiscountAmount: row.maxDiscountAmount == null ? '' : String(row.maxDiscountAmount),
                      perCustomerLimit: row.perCustomerLimit == null ? '' : String(row.perCustomerLimit),
                      startDate: row.startsAt?.slice(0, 10) ?? '',
                      isActive: row.isActive,
                      isExclusive: row.isExclusive,
                      applicableCategoryIds: row.applicableCategoryIds?.join(', ') ?? '',
                      applicableProductIds: row.applicableProductIds?.join(', ') ?? '',
                      customerSegmentId: row.customerSegmentId ?? '',
                      campaignId: row.campaignId ?? '',
                      discountType: row.discountType,
                      value: String(row.value),
                      minOrderSubtotal: row.minOrderSubtotal == null ? '' : String(row.minOrderSubtotal),
                      usageLimit: row.usageLimit == null ? '' : String(row.usageLimit),
                    });
                    setNeverExpires(!row.expiresAt);
                    setExpiryDate(row.expiresAt?.slice(0, 10) ?? '');
                    setEditingDiscount(row);
                  }}
                >
                  Edit
                </Button>
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
          <h1 className="text-2xl font-semibold tracking-tight">Discounts & Coupons</h1>
          <p className="text-sm text-muted-foreground">Manage coupon codes, user limits, and early bird discounts.</p>
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

      <Dialog
        open={editingDiscount !== null}
        onOpenChange={(open) => {
          if (!open && !editMutation.isPending) setEditingDiscount(null);
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Coupon Discount</DialogTitle>
            <DialogDescription>{editingDiscount?.code}</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!editingDiscount || editMutation.isPending) return;
              const current = editingDiscount.expiresAt;
              const expiresAt = neverExpires
                ? null
                : current?.slice(0, 10) === expiryDate
                ? current
                : new Date(expiryDate).toISOString();
              editMutation.mutate({ id: editingDiscount.id, expiresAt });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="edit-discount-code">Coupon Code</Label>
              <Input
                id="edit-discount-code"
                required
                maxLength={80}
                value={fields.code}
                onChange={(event) => setFields({ ...fields, code: event.target.value.toUpperCase() })}
                className="font-mono uppercase font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-discount-description">Campaign Note / Description (optional)</Label>
              <Input
                id="edit-discount-description"
                value={fields.description}
                onChange={(event) => setFields({ ...fields, description: event.target.value })}
              />
            </div>

            {/* Valid to these many users */}
            <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-600" />
                <Label htmlFor="edit-discount-limit" className="font-semibold text-xs">
                  Valid to these many users (Total Limit)
                </Label>
              </div>
              <Input
                id="edit-discount-limit"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 100 (leave blank for unlimited users)"
                value={fields.usageLimit}
                onChange={(event) => setFields({ ...fields, usageLimit: event.target.value })}
              />
              <p className="text-[11px] text-muted-foreground">
                Specifies how many total users can redeem this coupon before it is closed (e.g. valid to 100 users).
              </p>
            </div>

            {/* Standard Discount Settings */}
            <div className="space-y-2">
              <Label className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                {hasInitialTier ? 'Standard Discount (After Initial Users Tier)' : 'Discount Rate'}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-discount-type" className="text-xs">Type</Label>
                  <select
                    id="edit-discount-type"
                    className="h-9 w-full rounded-md border bg-background px-2 text-sm"
                    value={fields.discountType}
                    onChange={(event) => setFields({ ...fields, discountType: event.target.value as DiscountType })}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed amount (₹)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-discount-value" className="text-xs">Value</Label>
                  <Input
                    id="edit-discount-value"
                    type="number"
                    min="0.01"
                    step="0.01"
                    max={fields.discountType === 'PERCENTAGE' ? 100 : undefined}
                    required
                    value={fields.value}
                    onChange={(event) => setFields({ ...fields, value: event.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Initial Users Tier */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3.5 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-amber-950 text-sm">
                <input
                  type="checkbox"
                  checked={hasInitialTier}
                  onChange={(e) => setHasInitialTier(e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  Initial Users Special Discount (Early Bird)
                </span>
              </label>

              {hasInitialTier && (
                <div className="space-y-3 pt-2 border-t border-amber-200/70 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-initialUsersCount" className="text-xs font-semibold text-amber-950">
                        Initial Users Count
                      </Label>
                      <Input
                        id="edit-initialUsersCount"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="e.g. 20"
                        value={initialUsersCount}
                        onChange={(e) => setInitialUsersCount(e.target.value)}
                        required={hasInitialTier}
                        className="bg-white"
                      />
                      <p className="text-[11px] text-muted-foreground">Valid for the first N users.</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="edit-initialUsersDiscountType" className="text-xs font-semibold text-amber-950">
                        Initial Discount Type
                      </Label>
                      <select
                        id="edit-initialUsersDiscountType"
                        value={initialUsersDiscountType}
                        onChange={(e) => setInitialUsersDiscountType(e.target.value as DiscountType)}
                        className="flex h-9 w-full rounded-md border border-input bg-white px-2 py-1 text-sm"
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-initialUsersDiscount" className="text-xs font-semibold text-amber-950">
                      Initial Users Discount Value ({initialUsersDiscountType === 'PERCENTAGE' ? '%' : '₹'})
                    </Label>
                    <Input
                      id="edit-initialUsersDiscount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={initialUsersDiscountType === 'PERCENTAGE' ? 100 : undefined}
                      placeholder={initialUsersDiscountType === 'PERCENTAGE' ? 'e.g. 50 (50% OFF)' : 'e.g. 500 (₹500 OFF)'}
                      value={initialUsersDiscount}
                      onChange={(e) => setInitialUsersDiscount(e.target.value)}
                      required={hasInitialTier}
                      className="bg-white"
                    />
                  </div>

                  <div className="rounded-md border border-amber-300 bg-amber-100/80 p-2.5 text-xs text-amber-950 space-y-0.5">
                    <div className="font-semibold flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-amber-700" />
                      Rule Preview:
                    </div>
                    <div>
                      • <strong>Valid to:</strong> {fields.usageLimit ? `${fields.usageLimit} users total` : 'all users'}
                    </div>
                    <div>
                      • <strong>Initial {initialUsersCount || 'N'} users:</strong> will get{' '}
                      <span className="font-bold text-amber-900">
                        {initialUsersDiscount || 'X'}
                        {initialUsersDiscountType === 'PERCENTAGE' ? '%' : '₹'} OFF
                      </span>
                    </div>
                    <div>
                      • <strong>Subsequent users:</strong> will get standard{' '}
                      <span className="font-medium text-amber-900">
                        {fields.value || 'Y'}
                        {fields.discountType === 'PERCENTAGE' ? '%' : '₹'} OFF
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-discount-minimum">Minimum subtotal (₹)</Label>
              <Input
                id="edit-discount-minimum"
                type="number"
                min="0"
                step="0.01"
                value={fields.minOrderSubtotal}
                onChange={(event) => setFields({ ...fields, minOrderSubtotal: event.target.value })}
              />
            </div>

            {extraNumbers.map(({ key, label, min, step }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type="number"
                  min={min}
                  step={step}
                  value={fields[key]}
                  onChange={(event) => setFields({ ...fields, [key]: event.target.value })}
                />
              </div>
            ))}

            <div className="space-y-2">
              <Label htmlFor="edit-discount-start">Start date (optional)</Label>
              <Input
                id="edit-discount-start"
                type="date"
                value={fields.startDate}
                onChange={(event) => setFields({ ...fields, startDate: event.target.value })}
              />
            </div>

            <DiscountExpiryFields
              neverExpires={neverExpires}
              setNeverExpires={setNeverExpires}
              date={expiryDate}
              setDate={setExpiryDate}
            />

            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={fields.isActive}
                  onChange={(event) => setFields({ ...fields, isActive: event.target.checked })}
                />
                Active
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={fields.isExclusive}
                  onChange={(event) => setFields({ ...fields, isExclusive: event.target.checked })}
                />
                Exclusive
              </label>
            </div>

            <details className="space-y-3 rounded border p-3">
              <summary className="cursor-pointer text-sm font-medium">Targeting and campaign</summary>
              {(
                [
                  ['applicableCategoryIds', 'Eligible category IDs (comma separated)'],
                  ['applicableProductIds', 'Eligible product IDs (comma separated)'],
                  ['customerSegmentId', 'Customer segment ID'],
                  ['campaignId', 'Campaign ID'],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    value={fields[key]}
                    onChange={(event) => setFields({ ...fields, [key]: event.target.value })}
                  />
                </div>
              ))}
            </details>

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
