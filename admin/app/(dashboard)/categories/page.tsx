'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { ProductTypeSummary } from '@/lib/types/product';
import { usePermission } from '@/lib/auth/use-permission';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canEdit = hasPermission('products.edit');
  const [pendingHide, setPendingHide] = useState<ProductTypeSummary | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product-types'],
    queryFn: () => apiClient.get<ProductTypeSummary[]>('/product-types'),
  });

  const visibilityMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch(`/product-types/${id}`, { isActive }),
    onSuccess: (_result, { id, isActive }) => {
      queryClient.setQueryData<ProductTypeSummary[]>(['product-types'], (old) =>
        old?.map((c) => (c.id === id ? { ...c, isActive } : c)),
      );
      // The Products list shows which products are hidden by their category.
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(isActive ? 'Category is showing on the website again' : 'Category hidden from the website');
      setPendingHide(null);
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Could not change visibility'),
  });

  const categories = [...(data ?? [])].sort((a, b) => a.name.localeCompare(b.name));
  const hiddenCount = categories.filter((c) => !c.isActive).length;

  return (
    <div className="space-y-6">
      <div>
        <div className="page-eyebrow">STORE MANAGEMENT</div>
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">
          The product groups shoppers browse on the website. Hiding a category takes all of its products
          off the live site at once, and showing it again brings back exactly the ones that were live.
          Products you hid one by one stay hidden.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load categories.</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            {categories.length} categories{hiddenCount > 0 ? `, ${hiddenCount} hidden from the website` : ''}
          </p>
          <div className="space-y-2">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-medium">
                      {category.name}
                      {!category.isActive && <Badge variant="outline">Hidden from website</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {category.liveCount} of {category.productCount} products live
                      {!category.isActive && category.liveCount > 0 ? ' (not shown while the category is hidden)' : ''}
                    </div>
                  </div>
                  {canEdit && (
                    <Button
                      variant={category.isActive ? 'outline' : 'default'}
                      size="sm"
                      disabled={visibilityMutation.isPending}
                      onClick={() =>
                        category.isActive
                          ? setPendingHide(category)
                          : visibilityMutation.mutate({ id: category.id, isActive: true })
                      }
                    >
                      {category.isActive ? (
                        <>
                          <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                          Hide from website
                        </>
                      ) : (
                        <>
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          Show on website
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Dialog open={!!pendingHide} onOpenChange={(open) => !open && setPendingHide(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hide {pendingHide?.name} from the website?</DialogTitle>
            <DialogDescription>
              {pendingHide?.liveCount ?? 0} live product{pendingHide?.liveCount === 1 ? '' : 's'} will disappear
              from the website straight away. Nothing is deleted, and you can show the category again at any
              time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingHide(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={visibilityMutation.isPending}
              onClick={() => pendingHide && visibilityMutation.mutate({ id: pendingHide.id, isActive: false })}
            >
              {visibilityMutation.isPending ? 'Hiding…' : 'Hide category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
