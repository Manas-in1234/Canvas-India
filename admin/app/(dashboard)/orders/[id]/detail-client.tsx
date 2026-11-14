"use client";
import { useRecordId } from "@/lib/use-record-id";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { OrderDetail } from "@/lib/types/order";
import { StatusBadge } from "@/components/status-badge";
import { usePermission } from "@/lib/auth/use-permission";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { OrderShippingPanel } from "@/components/delivery/order-shipping-panel";
import { OrderEditor } from "@/components/order-editor";

export function OrderDetailClient({ id: initialId }: { id: string }) {
  const id = useRecordId(initialId);
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", id],
    enabled: !!id && id !== "placeholder",
    queryFn: () => apiClient.get<OrderDetail>(`/orders/${id}`),
  });

  const cancelMutation = useMutation({
    mutationFn: () => apiClient.post(`/orders/${id}/cancel`),
    onSuccess: () => {
      toast.success("Order cancelled");
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to cancel order",
      );
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => apiClient.post(`/orders/${id}/accept`),
    onSuccess: () => {
      toast.success("Order accepted - production started");
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to accept order");
    },
  });

  const visibilityMutation = useMutation({
    mutationFn: (action: "hide" | "show" | "archive" | "restore") => apiClient.put(`/admin/orders/${id}/visibility`, { action }),
    onSuccess: async (_, action) => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success({ hide: "Order hidden", show: "Order shown", archive: "Order moved to Archived", restore: "Order restored" }[action]);
      if (action === "archive") router.push("/orders");
    },
    onError: error => toast.error(error.message),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !order) {
    return <p className="text-sm text-destructive">Failed to load order.</p>;
  }

  const archived = order.adminVisibility === "ARCHIVED";
  const canEdit = hasPermission("orders.edit");
  const canCancel =
    !archived &&
    hasPermission("orders.cancel") &&
    order.orderStatus !== "CANCELLED" &&
    order.orderStatus !== "COMPLETED";

  const canAccept =
    canEdit && !archived &&
    order.paymentLabel !== "UNVERIFIED" &&
    (order.orderStatus === "CONFIRMED" || order.orderStatus === "PAID");

  const shippingAddress = order.addresses.find((a) => a.type === "SHIPPING");
  const billingAddress = order.addresses.find((a) => a.type === "BILLING");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/orders"
            className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Orders
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order {order.orderNumber}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.orderStatus} />
          <StatusBadge status={order.paymentLabel ?? order.paymentStatus} />
          <StatusBadge status={order.shippingStatus} />
          {order.adminVisibility && order.adminVisibility !== "VISIBLE" && <StatusBadge status={order.adminVisibility} />}
        </div>
      </div>

      {editing && <OrderEditor order={order} onClose={() => setEditing(false)} />}
      {(canAccept || canCancel || canEdit) && (
        <div className="flex flex-wrap items-center gap-2">
          {canEdit && (archived ? (
            <Button size="sm" variant="outline" disabled={visibilityMutation.isPending} onClick={() => visibilityMutation.mutate("restore")}>Restore order</Button>
          ) : <>
            <Button size="sm" variant="outline" disabled={visibilityMutation.isPending} onClick={() => setEditing(true)}>Edit order</Button>
            <Button size="sm" variant="outline" disabled={visibilityMutation.isPending}
              onClick={() => visibilityMutation.mutate(order.adminVisibility === "HIDDEN" ? "show" : "hide")}>
              {order.adminVisibility === "HIDDEN" ? "Show order" : "Hide order"}
            </Button>
            <Button size="sm" variant="outline" disabled={visibilityMutation.isPending} onClick={() => {
              if (confirm("Move this order to Archived? You can restore it later. Payment and order history will be kept.")) visibilityMutation.mutate("archive");
            }}>Delete order</Button>
          </>)}
          {canAccept && (
            <Button size="sm" disabled={acceptMutation.isPending} onClick={() => acceptMutation.mutate()}>
              {acceptMutation.isPending ? "Accepting…" : "Accept Order"}
            </Button>
          )}
          {canCancel && (
            <Button
              variant="destructive"
              size="sm"
              disabled={cancelMutation.isPending}
              onClick={() => confirm("Cancel this order? If it was paid online, the full amount will be refunded to the customer automatically.") && cancelMutation.mutate()}
            >
              {cancelMutation.isPending ? "Cancelling…" : "Cancel Order"}
            </Button>
          )}
          {canAccept && (
            <span className="text-xs text-muted-foreground">
              Accepting starts production; the customer can no longer cancel after that.
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between border-b pb-3 last:border-0"
              >
                <div>
                  {/* Always render snapshot fields — never re-fetch live product data
                      for a historical order (scope §89/§114). */}
                  <div className="font-medium">{item.productNameSnapshot}</div>
                  <div className="text-sm text-muted-foreground">
                    SKU: {item.variantSnapshot.sku}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.variantSnapshot.options
                      .map((o) => `${o.group}: ${o.value}`)
                      .join(", ")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div>{formatCurrency(item.priceSnapshot)}</div>
                  <div className="text-muted-foreground">
                    Tax: {formatCurrency(item.taxSnapshot)}
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-1 pt-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between border-t pt-1 font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <OrderShippingPanel orderId={order.id} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="font-medium">{order.customer.name}</div>
              {order.customer.email && (
                <div className="text-muted-foreground">
                  {order.customer.email}
                </div>
              )}
              {order.customer.phone && (
                <div className="text-muted-foreground">
                  {order.customer.phone}
                </div>
              )}
            </CardContent>
          </Card>

          {shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div>{shippingAddress.name}</div>
                <div>{shippingAddress.line1}</div>
                {shippingAddress.line2 && <div>{shippingAddress.line2}</div>}
                <div>
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.postalCode}
                </div>
                <div>{shippingAddress.country}</div>
                {shippingAddress.phone && <div>{shippingAddress.phone}</div>}
              </CardContent>
            </Card>
          )}

          {billingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div>{billingAddress.name}</div>
                <div>{billingAddress.line1}</div>
                {billingAddress.line2 && <div>{billingAddress.line2}</div>}
                <div>
                  {billingAddress.city}, {billingAddress.state}{" "}
                  {billingAddress.postalCode}
                </div>
                <div>{billingAddress.country}</div>
              </CardContent>
            </Card>
          )}

          {order.paymentLabel === 'UNVERIFIED' && <p className="text-sm text-muted-foreground">
            No captured payment is linked to this order. The total reflects the original order record.
          </p>}
          {order.payments.filter(payment => order.paymentLabel !== 'UNVERIFIED' ||
            payment.provider !== 'RAZORPAY' || Boolean(payment.providerRef)).map((payment) => (
            <Card key={payment.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  Payment ({payment.provider})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={payment.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span>{formatCurrency(payment.amount)}</span>
                </div>
                {payment.providerRef && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono text-xs">
                      {payment.providerRef}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {order.events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events recorded.</p>
          ) : (
            <ol className="space-y-3 border-l pl-4">
              {order.events.map((event) => (
                <li key={event.id} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary" />
                  <div className="text-sm font-medium">
                    {event.type.replaceAll("_", " ")}
                  </div>
                  {event.message && (
                    <div className="text-sm text-muted-foreground">
                      {event.message}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {formatDate(event.createdAt)}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
