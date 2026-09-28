'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { NdrCase } from '@/lib/types/shipping';
import { StatusBadge } from '@/components/status-badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function NdrDetailClient({ id }: { id: string }) {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const canAct = hasPermission('ndr.action');

  const { data: ndrCase, isLoading, isError } = useQuery({
    queryKey: ['ndr-cases', id],
    queryFn: () => apiClient.get<NdrCase>(`/shipping/ndr/${id}`),
  });

  const [newAddress, setNewAddress] = useState('');

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['ndr-cases', id] });
    queryClient.invalidateQueries({ queryKey: ['ndr-cases'] });
  };

  const onActionError = (label: string) => (err: unknown) => {
    toast.error(err instanceof ApiError ? err.message : `Failed to ${label.toLowerCase()}`);
  };

  const callCustomerMutation = useMutation({
    mutationFn: () => apiClient.post(`/shipping/ndr/${id}/call-customer`),
    onSuccess: () => {
      toast.success('Customer contacted');
      invalidate();
    },
    onError: onActionError('Customer contacted'),
  });

  const reattemptMutation = useMutation({
    mutationFn: () => apiClient.post(`/shipping/ndr/${id}/reattempt`),
    onSuccess: () => {
      toast.success('Reattempt requested');
      invalidate();
    },
    onError: onActionError('Reattempt requested'),
  });

  const cancelMutation = useMutation({
    mutationFn: () => apiClient.post(`/shipping/ndr/${id}/cancel`),
    onSuccess: () => {
      toast.success('NDR case cancelled');
      invalidate();
    },
    onError: onActionError('NDR case cancelled'),
  });

  const returnToOriginMutation = useMutation({
    mutationFn: () => apiClient.post(`/shipping/ndr/${id}/return-to-origin`),
    onSuccess: () => {
      toast.success('Marked as returning to origin');
      invalidate();
    },
    onError: onActionError('Marked as returning to origin'),
  });

  const changeAddressMutation = useMutation({
    mutationFn: (address: string) => apiClient.post(`/shipping/ndr/${id}/change-address`, { address }),
    onSuccess: () => {
      toast.success('Address updated');
      setNewAddress('');
      invalidate();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to change address');
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

  if (isError || !ndrCase) {
    return <p className="text-sm text-destructive">Failed to load NDR case.</p>;
  }

  const isResolved = ndrCase.status !== 'NDR';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/ndr" className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to NDR Cases
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Order {ndrCase.shipment.order.orderNumber}</h1>
        </div>
        <StatusBadge status={ndrCase.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Case Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reason</span>
            <span>{ndrCase.reason}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Attempt</span>
            <span>#{ndrCase.attemptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Courier</span>
            <span>{ndrCase.shipment.courierProvider}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">AWB</span>
            <span>{ndrCase.shipment.awbNumber ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Raised</span>
            <span>{formatDate(ndrCase.createdAt)}</span>
          </div>
          {ndrCase.resolution && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resolution</span>
              <span>{ndrCase.resolution}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {canAct && !isResolved && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                disabled={callCustomerMutation.isPending}
                onClick={() => callCustomerMutation.mutate()}
              >
                Call Customer
              </Button>
              <Button
                variant="outline"
                disabled={reattemptMutation.isPending}
                onClick={() => reattemptMutation.mutate()}
              >
                Request Reattempt
              </Button>
              <Button
                variant="outline"
                disabled={returnToOriginMutation.isPending}
                onClick={() => returnToOriginMutation.mutate()}
              >
                Return to Origin
              </Button>
              <Button variant="destructive" disabled={cancelMutation.isPending} onClick={() => cancelMutation.mutate()}>
                Cancel Case
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newAddress.trim()) changeAddressMutation.mutate(newAddress.trim());
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="New delivery address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
              <Button type="submit" disabled={changeAddressMutation.isPending || !newAddress.trim()}>
                Change Address
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
