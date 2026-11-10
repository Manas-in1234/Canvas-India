import type { OrderListItem } from "./types/order";
export function indiaDateKey(value: string | Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  return ["year", "month", "day"]
    .map((key) => parts.find((p) => p.type === key)!.value)
    .join("-");
}
export function orderOverview(
  orders: OrderListItem[],
  days: number,
  now = new Date(),
) {
  const end = indiaDateKey(now);
  const anchor = new Date(end + "T12:00:00Z");
  const buckets = Array.from({ length: days }, (_, index) => {
    const date = new Date(anchor);
    date.setUTCDate(date.getUTCDate() - (days - index - 1));
    return { date: date.toISOString().slice(0, 10), amount: 0, orders: 0 };
  });
  const first = buckets[0].date;
  const selected = orders.filter((order) => {
    const key = indiaDateKey(order.createdAt);
    return key >= first && key <= end;
  });
  let paidCents = 0;
  for (const order of selected) {
    const bucket = buckets.find(
      (b) => b.date === indiaDateKey(order.createdAt),
    )!;
    bucket.orders++;
    if (order.paymentStatus === "PAID") {
      const cents = Math.round(Number(order.total) * 100);
      if (Number.isFinite(cents)) {
        paidCents += cents;
        bucket.amount += cents / 100;
      }
    }
  }
  return {
    selected,
    buckets,
    paidAmount: paidCents / 100,
    paidOrders: selected.filter((o) => o.paymentStatus === "PAID").length,
    awaitingPayment: selected.filter(
      (o) =>
        ["PENDING", "AUTHORIZED"].includes(o.paymentStatus) &&
        !["CANCELLED", "REFUNDED"].includes(o.orderStatus),
    ).length,
    toFulfil: orders.filter(
      (o) =>
        o.paymentStatus === "PAID" &&
        ["NOT_SHIPPED", "READY"].includes(o.shippingStatus) &&
        !["CANCELLED", "REFUNDED"].includes(o.orderStatus),
    ).length,
  };
}
