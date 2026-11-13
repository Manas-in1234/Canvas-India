"use client";
import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { usePermission } from "@/lib/auth/use-permission";
import { formatDate } from "@/lib/format";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Kind = "returns" | "replacements";
type RequestRecord = {
  id: string;
  orderId: string;
  status: string;
  reason?: string;
  complaintReason?: string;
  createdAt: string;
  order: { orderNumber: string; customer?: { name?: string; email?: string | null; phone?: string | null } };
  orderItem: { productNameSnapshot: string; quantity?: number; priceSnapshot?: string };
  history?: { type: string; message: string | null; createdAt: string }[];
};

// Which admin actions are offered at each status.
const ACTIONS: Record<Kind, Record<string, { action: string; label: string; danger?: boolean }[]>> = {
  returns: {
    REQUESTED: [{ action: "approve", label: "Accept" }, { action: "reject", label: "Reject", danger: true }],
    REVIEW: [{ action: "approve", label: "Accept" }, { action: "reject", label: "Reject", danger: true }],
    APPROVED: [{ action: "returned", label: "Item received & inspected" }, { action: "reject", label: "Reject", danger: true }],
    RETURNED: [{ action: "refund", label: "Refund to customer" }],
  },
  replacements: {
    REQUESTED: [{ action: "approve", label: "Accept" }, { action: "reject", label: "Reject", danger: true }],
    REVIEW: [{ action: "approve", label: "Accept" }, { action: "reject", label: "Reject", danger: true }],
    APPROVED: [{ action: "complete", label: "Mark completed" }],
  },
};
const DELETABLE: Record<Kind, string[]> = {
  returns: ["REFUNDED", "RETURNED", "REJECTED"],
  replacements: ["COMPLETED", "REJECTED"],
};

export default function ReturnsPage() {
  const [kind, setKind] = useState<Kind>("returns");
  const [openId, setOpenId] = useState<string | null>(null);
  const { hasPermission } = usePermission();
  const client = useQueryClient();
  const canView = hasPermission("returns.view"),
    canManage = hasPermission("returns.manage"),
    canOrders = hasPermission("orders.view");
  const records = useQuery({
    queryKey: ["aftercare", kind],
    queryFn: () => apiClient.get<RequestRecord[]>(`/returns-replacements/${kind}`),
    enabled: canView,
  });
  const detail = useQuery({
    queryKey: ["aftercare", kind, openId],
    queryFn: () => apiClient.get<RequestRecord>(`/returns-replacements/${kind}/${openId}`),
    enabled: canView && !!openId,
  });
  const refresh = () => client.invalidateQueries({ queryKey: ["aftercare"] });
  const act = useMutation({
    mutationFn: (action: string) => apiClient.post(`/returns-replacements/${kind}/${openId}/${action}`, {}),
    onSuccess: () => {
      toast.success("Request updated");
      refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const remove = useMutation({
    mutationFn: () => apiClient.delete(`/returns-replacements/${kind}/${openId}`),
    onSuccess: () => {
      toast.success("Request deleted");
      setOpenId(null);
      refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const columns: DataTableColumn<RequestRecord>[] = [
    { header: "Order", cell: (r) => <span className="font-medium">{r.order.orderNumber}</span> },
    { header: "Item", cell: (r) => r.orderItem.productNameSnapshot },
    {
      header: "Reason",
      cell: (r) => <span className="line-clamp-2 max-w-64">{r.reason || r.complaintReason}</span>,
    },
    { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    { header: "Created", cell: (r) => formatDate(r.createdAt) },
  ];
  const d = detail.data;
  const actions = d ? ACTIONS[kind][d.status] ?? [] : [];
  return (
    <div className="space-y-6">
      <div className="page-heading">
        <div>
          <div className="page-eyebrow">CUSTOMER AFTERCARE</div>
          <h1>Returns & replacements</h1>
          <p>Requests arrive here automatically when a customer submits them. Open one to review, accept, reject or delete it.</p>
        </div>
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
          onRowClick={(r) => setOpenId(r.id)}
          emptyMessage={`No ${kind === "returns" ? "return" : "replacement"} requests yet.`}
        />
      )}
      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{kind === "returns" ? "Return" : "Replacement"} request</DialogTitle>
          </DialogHeader>
          {!d ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={d.status} />
              </div>
              <dl className="grid grid-cols-[110px_1fr] gap-y-2">
                <dt className="text-muted-foreground">Order</dt>
                <dd>
                  {canOrders ? (
                    <Link className="font-medium text-primary" href={`/orders/placeholder?id=${encodeURIComponent(d.orderId)}`}>
                      {d.order.orderNumber}
                    </Link>
                  ) : (
                    d.order.orderNumber
                  )}
                </dd>
                <dt className="text-muted-foreground">Customer</dt>
                <dd>
                  {[d.order.customer?.name, d.order.customer?.email, d.order.customer?.phone].filter(Boolean).join(" · ") || "—"}
                </dd>
                <dt className="text-muted-foreground">Item</dt>
                <dd>
                  {d.orderItem.productNameSnapshot}
                  {d.orderItem.quantity ? ` × ${d.orderItem.quantity}` : ""}
                </dd>
                <dt className="text-muted-foreground">Reason</dt>
                <dd className="whitespace-pre-wrap">{d.reason || d.complaintReason}</dd>
                <dt className="text-muted-foreground">Requested</dt>
                <dd>{formatDate(d.createdAt)}</dd>
              </dl>
              <div>
                <div className="mb-1 font-medium">Status history</div>
                {d.history?.length ? (
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {d.history.map((h, i) => (
                      <li key={i}>
                        {formatDate(h.createdAt)} — {h.message ?? h.type}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">No history yet.</p>
                )}
              </div>
            </div>
          )}
          {d && canManage && (
            <DialogFooter className="gap-2">
              {DELETABLE[kind].includes(d.status) && (
                <Button
                  variant="outline"
                  disabled={remove.isPending}
                  onClick={() => confirm("Delete this request permanently?") && remove.mutate()}
                >
                  Delete
                </Button>
              )}
              {actions.map((a) => (
                <Button
                  key={a.action}
                  variant={a.danger ? "outline" : "default"}
                  disabled={act.isPending}
                  onClick={() => (a.action !== "refund" || confirm("Send the refund to the original payment method now? This cannot be undone.")) && act.mutate(a.action)}
                >
                  {a.label}
                </Button>
              ))}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
