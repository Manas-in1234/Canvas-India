'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { CreatePromotionInput, DiscountType, PromotionType } from '@/lib/types/growth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PROMOTION_TYPES: PromotionType[] = ['AUTOMATIC_DISCOUNT', 'BUY_X_GET_Y', 'TIERED_DISCOUNT', 'FREE_SHIPPING'];

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function NewPromotionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [promotionType, setPromotionType] = useState<PromotionType>('AUTOMATIC_DISCOUNT');
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
  const [value, setValue] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');

  const createMutation = useMutation({
    mutationFn: (input: CreatePromotionInput) => apiClient.post('/growth/promotions', input),
    onSuccess: () => {
      toast.success('Promotion created');
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      router.push('/promotions');
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create promotion');
    },
  });

  const handleNameChange = (v: string) => {
    setName(v);
    if (!slugEdited) setSlug(slugify(v));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      slug,
      description: description || undefined,
      promotionType,
      discountType,
      value: Number(value),
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/promotions" className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Promotions
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">New Promotion</h1>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">Promotion Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => handleNameChange(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEdited(true);
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotionType">Promotion Type</Label>
              <select
                id="promotionType"
                value={promotionType}
                onChange={(e) => setPromotionType(e.target.value as PromotionType)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {PROMOTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <select
                  id="discountType"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startsAt">Starts</Label>
                <Input
                  id="startsAt"
                  type="date"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endsAt">Ends</Label>
                <Input id="endsAt" type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} required />
              </div>
            </div>

            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating…' : 'Create Promotion'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
