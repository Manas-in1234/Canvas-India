"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Undo2 } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import { COD_REMITTANCE_STATUS_LABEL } from "@/lib/types/cod";
import { usePermission } from "@/lib/auth/use-permission";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function errorText(err: unknown, fallback: string) {
  return err instanceof ApiError || err instanceof Error ? err.message : fallback;
}

// Deliberately a minimal local shape (not the full order/shipping Payment
// types) - this component only ever needs these fields, and is used from
// both the Orders detail page and the Shipment detail page, whose Payment
// types otherwise differ (transactions/providerRef vs a leaner shipping
// projection).
export interface CodPayment {
  id: string;
  amount: string;
  codCollectionStatus?: 'PENDING' | 'COLLECTED';
  codCollectedAmount?: string | null;
  codCollectedAt?: string | null;
  codCollectionNote?: string | null;
  remittanceItems?: { remittance: { id: string; status: 'PENDING' | 'INITIATED' | 'CREDITED'; bankReference: string | null } }[];
}

/**
 * Shows - and lets an admin set - whether COD cash has actually been
 * collected for one payment, and which remittance (if any) paid it out.
 * Deliberately never auto-derived from delivery status: Delhivery's courier
 * API has no endpoint or webhook that confirms cash was collected, so this
 * is a manual confirmation, same as the remittance ledger itself.
 */
export function CodCollectionCard({ payment, invalidateKeys = [] }: { payment: CodPayment; invalidateKeys?: string[][] }) {
  const { hasPermission } = usePermission();
  const canManage = hasPermission("cod.manage");
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(payment.amount);
  const [note, setNote] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["shipments"] });
    queryClient.invalidateQueries({ queryKey: ["cod-summary"] });
    queryClient.invalidateQueries({ queryKey: ["cod-pending-collection"] });
    for (const key of invalidateKeys) queryClient.invalidateQueries({ queryKey: key });
  };

  const collect = useMutation({
    mutationFn: () => apiClient.post(`/cod/payments/${payment.id}/collect`, { collectedAmount: Number(amount), note: note.trim() || undefined }),
    onSuccess: () => {
      toast.success("COD payment confirmed collected");
      setOpen(false);
      invalidate();
    },
    onError: (err: unknown) => toast.error(errorText(err, "Could not confirm collection")),
  });

  const undo = useMutation({
    mutationFn: () => apiClient.post(`/cod/payments/${payment.id}/undo-collect`),
    onSuccess: () => {
      toast.success("Collection mark undone");
      invalidate();
    },
    onError: (err: unknown) => toast.error(errorText(err, "Could not undo")),
  });

  const remittance = payment.remittanceItems?.[0]?.remittance;
  const isCollected = payment.codCollectionStatus === "COLLECTED";

  return (
    <div className="space-y-2 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <strong>Cash on Delivery</strong>
        <span className={isCollected ? "rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800" : "rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"}>
          {isCollected ? "Cash collected" : "Collection pending"}
        </span>
      </div>
      <div>The courier collects {formatCurrency(payment.amount)} at the door.</div>

      {isCollected ? (
        <div className="space-y-1 rounded bg-white/60 p-2 text-xs">
          <div className="flex justify-between"><span>Collected amount</span><span className="font-medium">{formatCurrency(payment.codCollectedAmount ?? payment.amount)}</span></div>
          {payment.codCollectedAt && <div className="flex justify-between"><span>Collected on</span><span>{formatDate(payment.codCollectedAt)}</span></div>}
          {payment.codCollectionNote && <div>Note: {payment.codCollectionNote}</div>}
          {remittance ? (
            <div className="flex justify-between">
              <span>Remittance</span>
              <span>{COD_REMITTANCE_STATUS_LABEL[remittance.status]}{remittance.bankReference ? ` · ${remittance.bankReference}` : ""}</span>
            </div>
          ) : (
            <div className="text-amber-700">Not yet included in a remittance batch.</div>
          )}
          {canManage && !remittance && (
            <Button size="sm" variant="outline" className="mt-1 h-7 text-xs" disabled={undo.isPending} onClick={() => undo.mutate()}>
              <Undo2 className="mr-1 h-3 w-3" />
              Undo (marked by mistake)
            </Button>
          )}
        </div>
      ) : canManage ? (
        <Button size="sm" className="h-7 text-xs" onClick={() => setOpen(true)}>
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Confirm cash collected
        </Button>
      ) : (
        <p className="text-xs">You do not have permission to confirm COD collection.</p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm COD cash collected</DialogTitle>
            <DialogDescription>
              Only confirm this once you have verified the cash was actually collected (e.g. against Delhivery's dashboard or your own records) - this is not detected automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label className="text-xs">Amount collected</Label>
            <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Note (optional, e.g. if short-paid)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button disabled={collect.isPending || !amount || Number(amount) < 0} onClick={() => collect.mutate()}>
              {collect.isPending ? "Confirming…" : "Confirm collected"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
