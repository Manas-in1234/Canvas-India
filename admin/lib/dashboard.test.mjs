import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
const source = await readFile(
  new URL("./dashboard.ts", import.meta.url),
  "utf8",
);
const output = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2017,
    module: ts.ModuleKind.ES2022,
  },
}).outputText;
const { indiaDateKey, orderOverview } = await import(
  `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`
);
const order = (overrides = {}) => ({
  id: "id",
  total: "100.10",
  createdAt: "2026-10-25T20:00:00Z",
  paymentStatus: "PAID",
  orderStatus: "CONFIRMED",
  shippingStatus: "NOT_SHIPPED",
  ...overrides,
});
test("dashboard dates follow India time across a UTC midnight boundary", () => {
  assert.equal(indiaDateKey("2026-10-25T20:00:00Z"), "2026-10-26");
  const result = orderOverview(
    [order(), order({ createdAt: "2026-10-25T18:00:00Z" })],
    1,
    new Date("2026-10-26T08:00:00Z"),
  );
  assert.equal(result.selected.length, 1);
});
test("pending, authorized and refunded payments never count as paid order value", () => {
  const result = orderOverview(
    [
      order(),
      order({ paymentStatus: "PENDING" }),
      order({ paymentStatus: "AUTHORIZED" }),
      order({ paymentStatus: "REFUNDED" }),
    ],
    7,
    new Date("2026-10-26T08:00:00Z"),
  );
  assert.equal(result.paidAmount, 100.1);
  assert.equal(result.paidOrders, 1);
  assert.equal(result.awaitingPayment, 2);
});
test("amounts use whole-paise accumulation and exclude future/out-of-range orders", () => {
  const result = orderOverview(
    [
      order({ total: "0.10" }),
      order({ total: "0.20" }),
      order({ createdAt: "2026-11-01T12:00:00Z" }),
      order({ createdAt: "2026-09-01T12:00:00Z" }),
    ],
    7,
    new Date("2026-10-26T08:00:00Z"),
  );
  assert.equal(result.paidAmount, 0.3);
  assert.equal(result.selected.length, 2);
  assert.equal(result.buckets.length, 7);
});
test("fulfilment attention excludes unpaid, shipped and cancelled orders", () => {
  const result = orderOverview(
    [
      order(),
      order({ paymentStatus: "PENDING" }),
      order({ shippingStatus: "IN_TRANSIT" }),
      order({ orderStatus: "CANCELLED" }),
    ],
    30,
    new Date("2026-10-26T08:00:00Z"),
  );
  assert.equal(result.toFulfil, 1);
});
