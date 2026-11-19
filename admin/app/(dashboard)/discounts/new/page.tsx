'use client';

import { useState } from 'react';
import { DiscountExpiryFields } from '@/components/discount-expiry-fields';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, Sparkles, Users } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { CreateDiscountInput, DiscountType } from '@/lib/types/growth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDiscountDescription } from '@/lib/discount-tier';

export default function NewDiscountPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
  const [value, setValue] = useState('');
  const [minOrderSubtotal, setMinOrderSubtotal] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [neverExpires, setNeverExpires] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');

  // Initial users special discount tier
  const [hasInitialTier, setHasInitialTier] = useState(false);
  const [initialUsersCount, setInitialUsersCount] = useState('');
  const [initialUsersDiscount, setInitialUsersDiscount] = useState('');
  const [initialUsersDiscountType, setInitialUsersDiscountType] = useState<DiscountType>('PERCENTAGE');

  const createMutation = useMutation({
    mutationFn: (input: CreateDiscountInput) => apiClient.post('/growth/discounts', input),
    onSuccess: () => {
      toast.success('Discount created successfully');
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      router.push('/discounts');
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create discount');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDesc = formatDiscountDescription({
      note: description,
      initialUsersCount: hasInitialTier && initialUsersCount ? Number(initialUsersCount) : null,
      initialUsersDiscount: hasInitialTier && initialUsersDiscount ? Number(initialUsersDiscount) : null,
      initialUsersDiscountType,
    });

    createMutation.mutate({
      code: code.toUpperCase().trim(),
      description: formattedDesc || undefined,
      discountType,
      value: Number(value),
      minOrderSubtotal: minOrderSubtotal ? Number(minOrderSubtotal) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      expiresAt: neverExpires ? undefined : new Date(expiresAt).toISOString(),
      isActive: true,
    });
  };

  const codePreview = code.trim().toUpperCase() || 'COUPON';
  const totalUsersText = usageLimit ? `${usageLimit} users total` : 'all users';
  const initialCountText = initialUsersCount ? `${initialUsersCount} users` : 'the initial users';
  const initialDiscountSymbol = initialUsersDiscountType === 'PERCENTAGE' ? '%' : '₹';
  const standardDiscountSymbol = discountType === 'PERCENTAGE' ? '%' : '₹';

  return (
    <div className="space-y-6">
      <div>
        <Link href="/discounts" className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Discounts
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">New Discount</h1>
        <p className="text-sm text-muted-foreground">Create a coupon code with user validity and initial-user discount tiers.</p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Discount & User Validity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                placeholder="e.g. WELCOME50"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono uppercase font-semibold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Campaign Note / Description (optional)</Label>
              <Input
                id="description"
                placeholder="e.g. Grand Opening Early Bird Campaign"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* User Validity: Valid to these many users */}
            <div className="rounded-lg border bg-muted/30 p-3.5 space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                <Label htmlFor="usageLimit" className="font-semibold text-sm">
                  Valid to these many users (Total User Limit)
                </Label>
              </div>
              <Input
                id="usageLimit"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 100 (leave blank for unlimited users)"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Specifies how many total users can redeem this coupon before it is closed (e.g. valid to 100 users). Leave blank if there is no total user limit.
              </p>
            </div>

            {/* Standard Discount Settings */}
            <div className="space-y-2">
              <Label className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                {hasInitialTier ? 'Standard Discount (After Initial Users Tier)' : 'Discount Rate'}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="discountType" className="text-xs">Type</Label>
                  <select
                    id="discountType"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="value" className="text-xs">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={discountType === 'PERCENTAGE' ? 100 : undefined}
                    placeholder={discountType === 'PERCENTAGE' ? 'e.g. 20 (20%)' : 'e.g. 200 (₹200)'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Initial Users Tier */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer font-medium text-amber-950 text-sm">
                <input
                  type="checkbox"
                  checked={hasInitialTier}
                  onChange={(e) => setHasInitialTier(e.target.checked)}
                  className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  Initial Users Special Discount (Early Bird)
                </span>
              </label>
              <p className="text-xs text-amber-800/80 pl-6.5">
                Reward the first users who apply this code with a higher discount rate. Subsequent users will receive the standard rate above.
              </p>

              {hasInitialTier && (
                <div className="space-y-3 pt-2 border-t border-amber-200/70 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="initialUsersCount" className="text-xs font-semibold text-amber-950">
                        Initial Users Count
                      </Label>
                      <Input
                        id="initialUsersCount"
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
                      <Label htmlFor="initialUsersDiscountType" className="text-xs font-semibold text-amber-950">
                        Initial Discount Type
                      </Label>
                      <select
                        id="initialUsersDiscountType"
                        value={initialUsersDiscountType}
                        onChange={(e) => setInitialUsersDiscountType(e.target.value as DiscountType)}
                        className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="initialUsersDiscount" className="text-xs font-semibold text-amber-950">
                      Initial Users Discount Value ({initialUsersDiscountType === 'PERCENTAGE' ? '%' : '₹'})
                    </Label>
                    <Input
                      id="initialUsersDiscount"
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

                  {/* Live Preview Box */}
                  <div className="rounded-md border border-amber-300 bg-amber-100/80 p-3 text-xs text-amber-950 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                      Rule Preview:
                    </div>
                    <div>
                      • <strong>Valid to:</strong> {totalUsersText}
                    </div>
                    <div>
                      • <strong>Initial {initialCountText}:</strong> will get{' '}
                      <span className="font-bold text-amber-900">
                        {initialUsersDiscount || 'X'}{initialDiscountSymbol} OFF
                      </span>
                    </div>
                    <div>
                      • <strong>Subsequent users:</strong> will get standard{' '}
                      <span className="font-medium text-amber-900">
                        {value || 'Y'}{standardDiscountSymbol} OFF
                      </span>{' '}
                      until {usageLimit ? `user #${usageLimit}` : 'expiry'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderSubtotal">Min Order Subtotal (₹, optional)</Label>
              <Input
                id="minOrderSubtotal"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 999"
                value={minOrderSubtotal}
                onChange={(e) => setMinOrderSubtotal(e.target.value)}
              />
            </div>

            <DiscountExpiryFields
              neverExpires={neverExpires}
              setNeverExpires={setNeverExpires}
              date={expiresAt}
              setDate={setExpiresAt}
            />

            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating…' : 'Create Coupon Discount'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
