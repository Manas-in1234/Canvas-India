"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { ReviewListItem, ReviewStatus } from "@/lib/types/review";
import { StatusBadge } from "@/components/status-badge";
import { usePermission } from "@/lib/auth/use-permission";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TABS: Array<{ value: ReviewStatus | "ALL"; label: string }> = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ALL", label: "All" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<ReviewStatus | "ALL">("PENDING");
  const [rejecting, setRejecting] = useState<ReviewListItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [deleting, setDeleting] = useState<ReviewListItem | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews", tab],
    queryFn: () =>
      apiClient.get<ReviewListItem[]>(
        tab === "ALL" ? "/admin/reviews" : `/admin/reviews?status=${tab}`,
      ),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["reviews"] });

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.patch(`/admin/reviews/${id}`, { status: "APPROVED" }),
    onSuccess: () => {
      toast.success("Review approved — now visible on the storefront");
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(err instanceof ApiError ? err.message : "Failed to approve review"),
  });

  const rejectMutation = useMutation({
    mutationFn: () =>
      apiClient.patch(`/admin/reviews/${rejecting!.id}`, {
        status: "REJECTED",
        rejectionReason: rejectReason || undefined,
      }),
    onSuccess: () => {
      toast.success("Review rejected");
      setRejecting(null);
      setRejectReason("");
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(err instanceof ApiError ? err.message : "Failed to reject review"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete(`/admin/reviews/${deleting!.id}`),
    onSuccess: () => {
      toast.success("Review deleted");
      setDeleting(null);
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(err instanceof ApiError ? err.message : "Failed to delete review"),
  });

  const canManage = hasPermission("reviews.manage");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Customer reviews from verified purchases. New reviews start Pending and only show on
          the storefront once approved.
        </p>
      </div>

      <div className="flex gap-2 border-b">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.value
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load reviews.</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews here.</p>
      ) : (
        <div className="space-y-3">
          {data.map((review) => (
            <div key={review.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Stars rating={review.rating} />
                    <StatusBadge status={review.status} />
                  </div>
                  <div className="text-sm font-medium">
                    {review.customer.name}{" "}
                    <span className="font-normal text-muted-foreground">
                      ({review.customer.email})
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {review.orderItem.productNameSnapshot} · Order{" "}
                    {review.orderItem.order.orderNumber} · {formatDate(review.createdAt)}
                  </div>
                </div>
                {canManage && (
                  <div className="flex shrink-0 gap-2">
                    {review.status !== "APPROVED" && (
                      <Button
                        size="sm"
                        disabled={approveMutation.isPending}
                        onClick={() => approveMutation.mutate(review.id)}
                      >
                        Approve
                      </Button>
                    )}
                    {review.status !== "REJECTED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRejecting(review);
                          setRejectReason("");
                        }}
                      >
                        Reject
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleting(review)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm">{review.comment}</p>
              {review.status === "REJECTED" && review.rejectionReason && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Rejection reason: {review.rejectionReason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!rejecting} onOpenChange={(open) => !open && setRejecting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject this review?</DialogTitle>
            <DialogDescription>
              It will not show on the storefront. You can optionally note why, for your own
              records.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Reason (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejecting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={rejectMutation.isPending}
              onClick={() => rejectMutation.mutate()}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this review?</DialogTitle>
            <DialogDescription>
              This permanently removes it, and the customer will be able to submit a new review
              for that same purchase.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
