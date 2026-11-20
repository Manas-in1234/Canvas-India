"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Banknote, CheckCircle2, Clock, Landmark, PackageCheck, Plus, Wallet } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { CodRemittance, CodSummary, CollectedUnremittedPayment, PendingCollectionPayment } from "@/lib/types/cod";
import { COD_REMITTANCE_STATUS_LABEL } from "@/lib/types/cod";
import { usePermission } from "@/lib/auth/use-permission";
import { formatCurrency, formatCurrencyNumber, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function errorText(err: unknown, fallback: string) {
  return err instanceof ApiError || err instanceof Error ? err.message : fallback;
}

export default function CodDashboardPage() {
  const { hasPermission } = usePermission();
  const canManage = hasPermission("cod.manage");
  const [createOpen, setCreateOpen] = useState(false);

  const summary = useQuery({ queryKey: ["cod-summary"], queryFn: () => apiClient.get<CodSummary>("/cod/summary") });
  const pending = useQuery({ queryKey: ["cod-pending-collection"], queryFn: () => apiClient.get<PendingCollectionPayment[]>("/cod/pending-collection") });
  const unremitted = useQuery({ queryKey: ["cod-collected-unremitted"], queryFn: () => apiClient.get<CollectedUnremittedPayment[]>("/cod/collected-unremitted") });
  const remittances = useQuery({ queryKey: ["cod-remittances"], queryFn: () => apiClient.get<CodRemittance[]>("/cod/remittances") });

  const s = summary.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="page-eyebrow">DELIVERY</div>
          <h1 className="text-2xl font-semibold tracking-tight">COD Financial Dashboard</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Delhivery's courier API has no endpoint that confirms cash was collected or reports remittance (verified
            against their public API docs) - only their finance portal/statement does, outside this system. So
            collection and remittance here are recorded by an admin from that statement, not auto-synced.
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record a remittance
          </Button>
        )}
      </div>

      {summary.isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : summary.isError || !s ? (
        <p className="text-sm text-destructive">Failed to load the COD summary.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Wallet className="h-3.5 w-3.5" /> Total COD orders</div>
              <div className="mt-1 text-2xl font-semibold">{s.totalCodOrders}</div>
              <div className="text-xs text-muted-foreground">{formatCurrencyNumber(s.totalCodAmount)}</div>
            </CardContent>
          </Card>
          <Card className="border-amber-300 bg-amber-50/60">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Collection pending</div>
              <div className="mt-1 text-2xl font-semibold">{s.pendingCollectionOrders}</div>
              <div className="text-xs text-muted-foreground">{formatCurrencyNumber(s.pendingCollectionAmount)}</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-300 bg-emerald-50/60">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5" /> Cash collected</div>
              <div className="mt-1 text-2xl font-semibold">{s.collectedOrders}</div>
              <div className="text-xs text-muted-foreground">{formatCurrencyNumber(s.collectedAmount)}</div>
            </CardContent>
          </Card>
          <Card className="border-blue-300 bg-blue-50/60">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Landmark className="h-3.5 w-3.5" /> Credited to bank</div>
              <div className="mt-1 text-2xl font-semibold">{formatCurrencyNumber(s.bankCreditedAmount)}</div>
              <div className="text-xs text-muted-foreground">Remittance pending: {formatCurrencyNumber(s.remittancePendingAmount)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PackageCheck className="h-4 w-4" />
              Awaiting collection confirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pending.isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : !pending.data || pending.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing pending.</p>
            ) : (
              pending.data.map((p) => <PendingCollectionRow key={p.id} payment={p} canManage={canManage} />)
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Banknote className="h-4 w-4" />
              Collected, awaiting remittance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {unremitted.isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : !unremitted.data || unremitted.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing collected is waiting on a remittance record.</p>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {unremitted.data.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2 border-b pb-1.5 last:border-0">
                    <Link href={`/orders/placeholder?id=${encodeURIComponent(p.order.id)}`} className="text-primary hover:underline">
                      {p.order.orderNumber}
                    </Link>
                    <span>{formatCurrency(p.codCollectedAmount ?? p.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Remittance history</CardTitle>
        </CardHeader>
        <CardContent>
          {remittances.isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : !remittances.data || remittances.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No remittances recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2 pr-4">Amount</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4">Bank reference (UTR)</th>
                    <th className="pb-2 pr-4">Orders covered</th>
                    <th className="pb-2">Credited on</th>
                  </tr>
                </thead>
                <tbody>
                  {remittances.data.map((r) => (
                    <RemittanceRow key={r.id} remittance={r} canManage={canManage} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateRemittanceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

function PendingCollectionRow({ payment, canManage }: { payment: PendingCollectionPayment; canManage: boolean }) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState(payment.amount);
  const [editing, setEditing] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["cod-summary"] });
    queryClient.invalidateQueries({ queryKey: ["cod-pending-collection"] });
    queryClient.invalidateQueries({ queryKey: ["cod-collected-unremitted"] });
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["shipments"] });
  };

  const collect = useMutation({
    mutationFn: () => apiClient.post(`/cod/payments/${payment.id}/collect`, { collectedAmount: Number(amount) }),
    onSuccess: () => {
      toast.success("Marked collected");
      setEditing(false);
      invalidate();
    },
    onError: (err: unknown) => toast.error(errorText(err, "Could not confirm collection")),
  });

  const shipment = payment.order.shipments[0];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 text-sm last:border-0">
      <div>
        <Link href={`/orders/placeholder?id=${encodeURIComponent(payment.order.id)}`} className="text-primary hover:underline">
          {payment.order.orderNumber}
        </Link>
        <div className="text-xs text-muted-foreground">
          AWB {shipment?.awbNumber ?? "—"} · {payment.order.shippingStatus}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <Input className="h-7 w-24 text-xs" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Button size="sm" className="h-7 text-xs" disabled={collect.isPending} onClick={() => collect.mutate()}>Confirm</Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditing(false)}>Cancel</Button>
          </>
        ) : (
          <>
            <span className="font-medium">{formatCurrency(payment.amount)}</span>
            {canManage && (
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEditing(true)}>Mark collected</Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function RemittanceRow({ remittance, canManage }: { remittance: CodRemittance; canManage: boolean }) {
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: (status: "INITIATED" | "CREDITED") => apiClient.patch(`/cod/remittances/${remittance.id}`, { status }),
    onSuccess: () => {
      toast.success("Remittance updated");
      queryClient.invalidateQueries({ queryKey: ["cod-remittances"] });
      queryClient.invalidateQueries({ queryKey: ["cod-summary"] });
    },
    onError: (err: unknown) => toast.error(errorText(err, "Could not update the remittance")),
  });

  return (
    <tr className="border-b last:border-0">
      <td className="py-2 pr-4">{formatDate(remittance.remittanceDate)}</td>
      <td className="py-2 pr-4 font-medium">{formatCurrency(remittance.amount)}</td>
      <td className="py-2 pr-4">
        <span
          className={
            remittance.status === "CREDITED"
              ? "rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800"
              : remittance.status === "INITIATED"
              ? "rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
              : "rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
          }
        >
          {COD_REMITTANCE_STATUS_LABEL[remittance.status]}
        </span>
      </td>
      <td className="py-2 pr-4 font-mono text-xs">{remittance.bankReference ?? "—"}</td>
      <td className="py-2 pr-4 text-xs text-muted-foreground">{remittance.items.map((i) => i.payment.order.orderNumber).join(", ")}</td>
      <td className="py-2">
        {remittance.bankCreditedAt ? (
          formatDate(remittance.bankCreditedAt)
        ) : canManage && remittance.status !== "CREDITED" ? (
          <Button size="sm" variant="outline" className="h-7 text-xs" disabled={update.isPending} onClick={() => update.mutate(remittance.status === "PENDING" ? "INITIATED" : "CREDITED")}>
            Mark {remittance.status === "PENDING" ? "initiated" : "credited"}
          </Button>
        ) : (
          "—"
        )}
      </td>
    </tr>
  );
}

function CreateRemittanceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">{open && <CreateRemittanceForm onClose={() => onOpenChange(false)} />}</DialogContent>
    </Dialog>
  );
}

function CreateRemittanceForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const unremitted = useQuery({ queryKey: ["cod-collected-unremitted"], queryFn: () => apiClient.get<CollectedUnremittedPayment[]>("/cod/collected-unremitted") });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [bankReference, setBankReference] = useState("");
  const [status, setStatus] = useState<"PENDING" | "INITIATED" | "CREDITED">("CREDITED");
  const [notes, setNotes] = useState("");

  const toggle = (id: string, checked: boolean, value: number) => {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
    if (checked) setAmount((prev) => (Number(prev) || 0) + value === 0 ? prev : String((Number(prev) || 0) + value));
  };

  const create = useMutation({
    mutationFn: () =>
      apiClient.post("/cod/remittances", {
        amount: Number(amount),
        remittanceDate: date,
        bankReference: bankReference.trim() || undefined,
        status,
        notes: notes.trim() || undefined,
        paymentIds: [...selected],
      }),
    onSuccess: () => {
      toast.success("Remittance recorded");
      queryClient.invalidateQueries({ queryKey: ["cod-remittances"] });
      queryClient.invalidateQueries({ queryKey: ["cod-summary"] });
      queryClient.invalidateQueries({ queryKey: ["cod-collected-unremitted"] });
      onClose();
    },
    onError: (err: unknown) => toast.error(errorText(err, "Could not record the remittance")),
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Record a COD remittance</DialogTitle>
        <DialogDescription>
          Copy this from Delhivery's remittance statement (finance portal) - select which collected COD payments it covers, then
          enter the amount, date, and bank reference (UTR) exactly as shown there.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <Label className="text-xs">Payments covered by this remittance</Label>
        {unremitted.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : !unremitted.data || unremitted.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No collected-but-unremitted COD payments to choose from.</p>
        ) : (
          <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border p-2">
            {unremitted.data.map((p) => (
              <label key={p.id} className="flex items-center justify-between gap-2 py-1 text-sm">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={(e) => toggle(p.id, e.target.checked, Number(p.codCollectedAmount ?? p.amount))}
                  />
                  {p.order.orderNumber}
                </span>
                <span>{formatCurrency(p.codCollectedAmount ?? p.amount)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Remittance amount</Label>
          <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Remittance date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Bank reference (UTR)</Label>
          <Input value={bankReference} onChange={(e) => setBankReference(e.target.value)} placeholder="e.g. UTR123456789" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm">
            <option value="PENDING">Pending</option>
            <option value="INITIATED">Initiated</option>
            <option value="CREDITED">Credited to bank</option>
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs">Notes (optional)</Label>
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button disabled={create.isPending || selected.size === 0 || !amount || Number(amount) <= 0 || !date} onClick={() => create.mutate()}>
          {create.isPending ? "Recording…" : "Record remittance"}
        </Button>
      </DialogFooter>
    </>
  );
}
