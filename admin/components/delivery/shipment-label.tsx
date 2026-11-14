"use client";

import JsBarcode from "jsbarcode";
import type { ShipmentDetail } from "@/lib/types/shipping";
import { formatCurrency } from "@/lib/format";

/** Everything a 4x6 courier label needs, taken from our own records (Delhivery's slip is JSON, not a PDF). */
export interface LabelData {
  awb: string;
  orderNumber: string;
  paymentMode: "COD" | "PREPAID";
  codAmount: string | null;
  consignee: { name: string; lines: string[]; pin: string; phone: string | null };
  from: { name: string; address: string; pin: string; phone: string };
  items: string;
}

export function buildLabelData(
  shipment: ShipmentDetail,
  pickup: { sellerName: string; pickupAddress: string; pickupPincode: string; pickupPhone: string },
): LabelData {
  const address = shipment.order.addresses.find((a) => a.type === "SHIPPING");
  const isCod = shipment.order.payments.some((p) => p.provider === "COD");
  return {
    awb: shipment.awbNumber ?? "",
    orderNumber: shipment.order.orderNumber,
    paymentMode: isCod ? "COD" : "PREPAID",
    codAmount: isCod ? shipment.order.total : null,
    consignee: {
      name: address?.name ?? shipment.order.customer?.name ?? "",
      lines: [address?.line1, address?.line2, [address?.city, address?.state].filter(Boolean).join(", ")].filter(Boolean) as string[],
      pin: address?.postalCode ?? "",
      phone: address?.phone ?? shipment.order.customer?.phone ?? null,
    },
    from: { name: pickup.sellerName, address: pickup.pickupAddress, pin: pickup.pickupPincode, phone: pickup.pickupPhone },
    items: shipment.items.map((i) => `${i.orderItem.productNameSnapshot} x${i.quantity}`).join(", "),
  };
}

function barcodeSvg(awb: string): string {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  try {
    JsBarcode(svg, awb, { format: "CODE128", width: 2, height: 64, displayValue: true, fontSize: 16, margin: 0 });
  } catch {
    return `<div style="font:700 18px monospace">${awb}</div>`;
  }
  return svg.outerHTML;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

export function labelHtml(d: LabelData): string {
  return `
  <div class="sl-label">
    <div class="sl-row sl-top">
      <div class="sl-brand">Delhivery</div>
      <div class="sl-mode ${d.paymentMode === "COD" ? "sl-cod" : ""}">${d.paymentMode === "COD" ? "COD" : "PREPAID"}</div>
    </div>
    <div class="sl-bar">${barcodeSvg(d.awb)}</div>
    <div class="sl-box">
      <div class="sl-small">Ship to</div>
      <div class="sl-big">${esc(d.consignee.name)}</div>
      ${d.consignee.lines.map((l) => `<div>${esc(l)}</div>`).join("")}
      <div class="sl-pin">PIN ${esc(d.consignee.pin)}</div>
      ${d.consignee.phone ? `<div>Phone: ${esc(d.consignee.phone)}</div>` : ""}
    </div>
    ${d.codAmount ? `<div class="sl-box sl-cod-box">Collect cash: Rs. ${esc(Number(d.codAmount).toFixed(2))}</div>` : ""}
    <div class="sl-box">
      <div class="sl-small">Order ${esc(d.orderNumber)}</div>
      <div>${esc(d.items)}</div>
    </div>
    <div class="sl-box sl-foot">
      <div class="sl-small">Return to</div>
      <div>${esc(d.from.name)}, ${esc(d.from.address)} - ${esc(d.from.pin)}</div>
      <div>Phone: ${esc(d.from.phone)}</div>
    </div>
  </div>`;
}

const LABEL_CSS = `
  @page { size: 4in 6in; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #000; }
  .sl-label { width: 4in; height: 6in; padding: 0.15in; display: flex; flex-direction: column; gap: 6px; page-break-after: always; }
  .sl-row { display: flex; justify-content: space-between; align-items: center; }
  .sl-brand { font-size: 18px; font-weight: 800; letter-spacing: 1px; }
  .sl-mode { border: 2px solid #000; padding: 2px 10px; font-weight: 800; font-size: 16px; }
  .sl-mode.sl-cod { background: #000; color: #fff; }
  .sl-bar { text-align: center; padding: 4px 0; }
  .sl-bar svg { max-width: 100%; height: auto; }
  .sl-box { border: 1px solid #000; padding: 6px 8px; font-size: 12px; line-height: 1.35; }
  .sl-small { font-size: 10px; text-transform: uppercase; color: #333; margin-bottom: 2px; }
  .sl-big { font-size: 15px; font-weight: 700; }
  .sl-pin { font-size: 18px; font-weight: 800; margin-top: 2px; }
  .sl-cod-box { font-size: 16px; font-weight: 800; text-align: center; }
  .sl-foot { margin-top: auto; font-size: 10px; }
`;

/** Opens the browser print dialog with a 4x6 label (works with any thermal or office printer). */
export function printShipmentLabel(d: LabelData): boolean {
  const win = window.open("", "_blank", "width=480,height=720");
  if (!win) return false;
  win.document.write(`<!doctype html><html><head><title>Label ${esc(d.awb)}</title><style>${LABEL_CSS}</style></head><body>${labelHtml(d)}</body></html>`);
  win.document.close();
  win.focus();
  win.onload = () => win.print();
  setTimeout(() => win.print(), 400);
  return true;
}

export function ShipmentLabelPreview({ data }: { data: LabelData }) {
  return (
    <div className="mx-auto w-[4in] max-w-full overflow-hidden rounded border bg-white p-0 text-black shadow-sm">
      <style>{LABEL_CSS.replace("@page { size: 4in 6in; margin: 0; }", "")}</style>
      <div dangerouslySetInnerHTML={{ __html: labelHtml(data) }} />
      <div className="sr-only">{formatCurrency(data.codAmount ?? "0")}</div>
    </div>
  );
}
