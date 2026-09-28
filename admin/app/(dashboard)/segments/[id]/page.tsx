'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, X } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { CustomerSegmentDetail } from '@/lib/types/growth';
import { usePermission } from '@/lib/auth/use-permission';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SegmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canManage = hasPermission('segments.manage');

  const { data: segment, isLoading, isError } = useQuery({
    queryKey: ['segments', id],
    queryFn: () => apiClient.get<CustomerSegmentDetail>(`/growth/segments/${id}`),
  });

  const [customerId, setCustomerId] = useState('');

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['segments', id] });
    queryClient.invalidateQueries({ queryKey: ['segments'] });
  };

  const addMemberMutation = useMutation({
    mutationFn: (ids: string[]) => apiClient.post(`/growth/segments/${id}/members`, { customerIds: ids }),
    onSuccess: () => {
      toast.success('Member added');
      setCustomerId('');
      invalidate();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to add member');
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberCustomerId: string) => apiClient.delete(`/growth/segments/${id}/members/${memberCustomerId}`),
    onSuccess: () => {
      toast.success('Member removed');
      invalidate();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to remove member');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !segment) {
    return <p className="text-sm text-destructive">Failed to load segment.</p>;
  }

  const canEditMembers = canManage && segment.type === 'MANUAL';

  return (
    <div className="space-y-6">
      <div>
        <Link href="/segments" className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Segments
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{segment.name}</h1>
        {segment.description && <p className="text-sm text-muted-foreground">{segment.description}</p>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Members ({segment.members.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {segment.type === 'DYNAMIC' && (
            <p className="text-xs text-muted-foreground">
              This is a dynamic segment — membership is computed automatically and can&rsquo;t be edited manually.
            </p>
          )}

          {segment.members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members yet.</p>
          ) : (
            <div className="space-y-2">
              {segment.members.map((member) => (
                <div key={member.customer.id} className="flex items-center justify-between rounded-md border p-2.5 text-sm">
                  <div>
                    <div className="font-medium">{member.customer.name}</div>
                    <div className="text-xs text-muted-foreground">{member.customer.email ?? member.customer.phone ?? '—'}</div>
                  </div>
                  {canEditMembers && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={removeMemberMutation.isPending}
                      onClick={() => removeMemberMutation.mutate(member.customer.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {canEditMembers && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customerId.trim()) addMemberMutation.mutate([customerId.trim()]);
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
              <Button type="submit" disabled={addMemberMutation.isPending || !customerId.trim()}>
                Add
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
