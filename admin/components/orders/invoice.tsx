"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, Printer } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { InvoiceData } from "@/lib/types/invoice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
const money = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 12px; }
  .inv { width: 100%; max-width: 794px; margin: 0 auto; padding: 24px; }
  .inv h1 { font-size: 20px; margin: 0; letter-spacing: 1px; }
  .inv .top { display: flex; justify-content: space-between; gap: 16px; border-bottom: 2px solid #111; padding-bottom: 10px; }
  .inv .meta { text-align: right; line-height: 1.6; }
  .inv .cols { display: flex; gap: 16px; margin: 14px 0; }
  .inv .box { flex: 1; border: 1px solid #bbb; padding: 8px 10px; line-height: 1.5; }
  .inv .label { font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 2px; }
  .inv table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  .inv th { background: #f1f1f1; text-align: left; padding: 6px; border: 1px solid #bbb; font-size: 11px; }
  .inv td { padding: 6px; border: 1px solid #ddd; vertical-align: top; }
  .inv .r { text-align: right; }
  .inv .totals { margin-left: auto; width: 55%; margin-top: 10px; }
  .inv .totals td { border: none; padding: 3px 6px; }
  .inv .totals .grand td { border-top: 2px solid #111; font-weight: bold; font-size: 14px; padding-top: 6px; }
  .inv .words { margin-top: 10px; font-style: italic; }
  .inv .foot { margin-top: 28px; display: flex; justify-content: space-between; font-size: 11px; color: #444; }
  .inv .draft { background: #fff3cd; border: 1px solid #e0b100; padding: 6px 10px; margin-bottom: 10px; font-weight: bold; }
`;

export function invoiceHtml(d: InvoiceData): string {
  const rows = d.lines
    .map((l, i) => `<tr><td>${i + 1}</td><td>${esc(l.description)}</td><td>${esc(l.hsn)}</td><td class="r">${l.quantity}</td><td class="r">${money(l.unitPrice)}</td><td class="r">${money(l.amount)}</td></tr>`)
    .join("");
  const tax = d.interState
    ? `<tr><td>IGST (${d.taxRate}%)</td><td class="r">${money(d.igst)}</td></tr>`
    : `<tr><td>CGST (${d.taxRate / 2}%)</td><td class="r">${money(d.cgst)}</td></tr><tr><td>SGST (${d.taxRate / 2}%)</td><td class="r">${money(d.sgst)}</td></tr>`;
  return `<div class="inv">
    ${d.profileComplete ? "" : '<div class="draft">DRAFT: business name or GSTIN is not set yet. Do not give this to a customer.</div>'}
    <div class="top">
      <div><h1>TAX INVOICE</h1><div style="margin-top:6px;line-height:1.5"><strong>${esc(d.seller.name)}</strong><br>${esc(d.seller.address)}${d.seller.gstin ? `<br>GSTIN: ${esc(d.seller.gstin)}` : ""}${d.seller.phone ? `<br>Phone: ${esc(d.seller.phone)}` : ""}${d.seller.email ? ` &middot; ${esc(d.seller.email)}` : ""}</div></div>
      <div class="meta"><div><strong>Invoice No:</strong> ${esc(d.invoiceNumber)}</div><div><strong>Date:</strong> ${esc(d.date)}</div><div><strong>Payment:</strong> ${esc(d.paymentMode)}</div></div>
    </div>
    <div class="cols">
      <div class="box"><div class="label">Billed and delivered to</div><strong>${esc(d.buyer.name)}</strong><br>${d.buyer.addressLines.map(esc).join("<br>")}${d.buyer.phone ? `<br>Phone: ${esc(d.buyer.phone)}` : ""}</div>
      <div class="box"><div class="label">Place of supply</div>${esc(d.placeOfSupply)}<div class="label" style="margin-top:8px">Supply type</div>${d.interState ? "Inter-state (IGST)" : "Intra-state (CGST + SGST)"}</div>
    </div>
    <table><thead><tr><th>#</th><th>Description</th><th>HSN</th><th class="r">Qty</th><th class="r">Rate (Rs.)</th><th class="r">Amount (Rs.)</th></tr></thead><tbody>${rows}</tbody></table>
    <table class="totals"><tbody>
      <tr><td>Subtotal</td><td class="r">${money(d.subtotal)}</td></tr>
      ${d.discount > 0 ? `<tr><td>Discount</td><td class="r">- ${money(d.discount)}</td></tr>` : ""}
      <tr><td>Delivery</td><td class="r">${d.shipping > 0 ? money(d.shipping) : "Free"}</td></tr>
      <tr><td>Taxable value</td><td class="r">${money(d.taxableValue)}</td></tr>
      ${d.totalTax > 0 ? tax : ""}
      <tr class="grand"><td>Total</td><td class="r">Rs. ${money(d.total)}</td></tr>
    </tbody></table>
    <div class="words"><strong>Amount in words:</strong> ${esc(d.amountInWords)}</div>
    <div style="margin-top:6px;color:#555;font-size:11px">${esc(d.taxNote)}</div>
    <div class="foot"><div>Thank you for shopping with us.<br>This is a computer-generated invoice.</div><div style="text-align:right">For ${esc(d.seller.name)}<br><br><br>Authorised signatory</div></div>
  </div>`;
}

export function printInvoice(d: InvoiceData): boolean {
  const win = window.open("", "_blank", "width=900,height=1000");
  if (!win) return false;
  win.document.write(`<!doctype html><html><head><title>Invoice ${esc(d.invoiceNumber)}</title><style>@page{size:A4;margin:12mm}${CSS}</style></head><body>${invoiceHtml(d)}</body></html>`);
  win.document.close();
  win.focus();
  win.onload = () => win.print();
  setTimeout(() => win.print(), 400);
  return true;
}

/** "Invoice" button on an order: preview, then print. */
export function InvoiceButton({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["invoice", orderId],
    enabled: open && !!orderId && orderId !== "placeholder",
    queryFn: () => apiClient.get<InvoiceData>(`/orders/${orderId}/invoice`),
  });
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <FileText className="mr-1.5 h-3.5 w-3.5" />
        Invoice
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Tax invoice</DialogTitle>
            <DialogDescription>Check it, then print or save as PDF from the print window.</DialogDescription>
          </DialogHeader>
          {isLoading && <Skeleton className="h-72 w-full" />}
          {isError && <p className="text-sm text-destructive">Could not load the invoice.</p>}
          {data && (
            <>
              <div className="rounded border bg-white p-2 text-black">
                <style>{CSS}</style>
                <div dangerouslySetInnerHTML={{ __html: invoiceHtml(data) }} />
              </div>
            </>
          )}
          <DialogFooter>
            <Button disabled={!data} onClick={() => data && !printInvoice(data) && toast.error("Allow pop-ups for this site to print.")}>
              <Printer className="mr-2 h-4 w-4" />
              Print invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
