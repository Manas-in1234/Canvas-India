"use client";
import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, RotateCcw } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { usePermission } from "@/lib/auth/use-permission";
import { formatDate } from "@/lib/format";
import type { OrderListItem, OrderDetail } from "@/lib/types/order";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
type RequestRecord = {
  id: string;
  orderId: string;
  status: string;
  reason?: string;
  complaintReason?: string;
  createdAt: string;
  order: { orderNumber: string };
  orderItem: { productNameSnapshot: string };
};
export default function ReturnsPage() {
  const [kind, setKind] = useState<"returns" | "replacements">("returns");
  const [open, setOpen] = useState(false),
    [orderId, setOrderId] = useState(""),
    [itemId, setItemId] = useState(""),
    [reason, setReason] = useState("");
  const { hasPermission } = usePermission();
  const client = useQueryClient();
  const canView = hasPermission("returns.view"),
    canOrders = hasPermission("orders.view");
  const records = useQuery({
    queryKey: ["aftercare", kind],
    queryFn: () =>
      apiClient.get<RequestRecord[]>(`/returns-replacements/${kind}`),
    enabled: canView,
  });
  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get<OrderListItem[]>("/orders"),
    enabled: open && canOrders,
  });
  const selected = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => apiClient.get<OrderDetail>(`/orders/${orderId}`),
    enabled: open && !!orderId && canOrders,
  });
  const create = useMutation({
    mutationFn: () =>
      apiClient.post(`/returns-replacements/${kind}`, {
        orderId,
        orderItemId: itemId,
        ...(kind === "returns"
          ? { reason: reason.trim() }
          : { complaintReason: reason.trim() }),
      }),
    onSuccess: () => {
      toast.success("Request created");
      client.invalidateQueries({ queryKey: ["aftercare"] });
      setOpen(false);
      setOrderId("");
      setItemId("");
      setReason("");
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const columns: DataTableColumn<RequestRecord>[] = [
    {
      header: "Order",
      cell: (r) =>
        canOrders ? (
          <Link
            className="font-medium text-primary"
            href={`/orders/placeholder?id=${encodeURIComponent(r.orderId)}`}
          >
            {r.order.orderNumber}
          </Link>
        ) : (
          r.order.orderNumber
        ),
    },
    { header: "Item", cell: (r) => r.orderItem.productNameSnapshot },
    {
      header: "Reason",
      cell: (r) => (
        <span className="line-clamp-2 max-w-64">
          {r.reason || r.complaintReason}
        </span>
      ),
    },
    { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    { header: "Created", cell: (r) => formatDate(r.createdAt) },
  ];
  return (
    <div className="space-y-6">
      <div className="page-heading">
        <div>
          <div className="page-eyebrow">CUSTOMER AFTERCARE</div>
          <h1>Returns & replacements</h1>
          <p>Keep every request connected to its original order and artwork.</p>
        </div>
        {hasPermission("returns.manage") && canOrders && (
          <Button onClick={() => setOpen(true)}>
            <Plus size={15} />
            New request
          </Button>
        )}
      </div>
      <div className="status-filters">
        {(["returns", "replacements"] as const).map((value) => (
          <button
            key={value}
            aria-pressed={kind === value}
            className={kind === value ? "active" : ""}
            onClick={() => setKind(value)}
          >
            <RotateCcw size={13} />
            {value === "returns" ? "Return requests" : "Replacement requests"}
          </button>
        ))}
      </div>
      {!canView ? (
        <p>You do not have permission to view aftercare requests.</p>
      ) : records.isError ? (
        <div className="workspace-alert" role="alert">
          Requests could not be loaded.
          <button onClick={() => records.refetch()}>Retry</button>
        </div>
      ) : records.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading requests…</p>
      ) : (
        <DataTable
          columns={columns}
          data={records.data || []}
          getRowKey={(r) => r.id}
          emptyMessage={`No ${kind === "returns" ? "return" : "replacement"} requests yet.`}
        />
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              New {kind === "returns" ? "return" : "replacement"} request
            </DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="aftercare-order">Order</Label>
              <select
                id="aftercare-order"
                required
                className="w-full rounded-md border bg-white p-2 text-sm"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  setItemId("");
                }}
              >
                <option value="">Choose an order</option>
                {orders.data?.map((order) => (
                  <option value={order.id} key={order.id}>
                    {order.orderNumber} · {order.customer?.name}
                  </option>
                ))}
              </select>
              {orders.isError && (
                <p className="text-xs text-destructive">
                  Orders could not be loaded.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="aftercare-item">Order item</Label>
              <select
                id="aftercare-item"
                required
                disabled={!orderId || selected.isLoading}
                className="w-full rounded-md border bg-white p-2 text-sm"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
              >
                <option value="">Choose the affected item</option>
                {selected.data?.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.productNameSnapshot}
                  </option>
                ))}
              </select>
              {selected.isError && (
                <p className="text-xs text-destructive">
                  Order items could not be loaded.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="aftercare-reason">Reason</Label>
              <textarea
                id="aftercare-reason"
                required
                maxLength={2000}
                rows={3}
                className="w-full rounded-md border bg-white p-2 text-sm"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe what needs attention…"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  create.isPending || !orderId || !itemId || !reason.trim()
                }
              >
                {create.isPending ? "Creating…" : "Create request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
