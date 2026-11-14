# Delivery (Delhivery) runbook

How a parcel gets from an order to the customer, what the backend does at each step, and what to set up before going live.
Code: `src/shipping/delhivery-client.ts` (Delhivery API), `src/shipping/worker-shipping.ts` (our records), routes in `src/worker.ts`
under `/api/v1/shipping`. Tests: `src/shipping/delivery.spec.ts`. No database migration is needed: it uses the existing
`shipments`, `tracking_events`, `ndr_cases`, `rto_cases` and `warehouses` tables.

## Flow

1. **Checkout.** `GET /shipping/serviceability?pincode=` (public) checks the pincode and whether COD is available.
2. **Order paid or COD.** Only these can be shipped: the order must be CONFIRMED, PAID or PROCESSING, and either payment is PAID or it is a pending COD payment.
3. **Book.** Admin opens the order and presses *Ship with Delhivery* (`POST /shipping/shipments`). The backend checks the address, a valid phone and pincode, and serviceability, estimates weight and box size from the print size (editable), then books with Delhivery. **It saves a shipment only if Delhivery returns a real AWB.** On any failure nothing is saved and the admin sees Delhivery's reason.
4. **Label.** Printed from the shipment page (4x6, barcode of the AWB, COD amount).
5. **Pickup.** *Request pickup* on the Shipments page (`POST /shipping/pickups`). Delhivery allows one open pickup per warehouse.
6. **Tracking.** A cron runs every 20 minutes (`wrangler.jsonc` triggers) and pulls tracking for active shipments in one batched call. *Refresh tracking* does the same on demand. Optional push webhook: `POST /shipping/webhook/delhivery`, enabled only when `DELHIVERY_WEBHOOK_SECRET` is set (Delhivery sets up the push on request, 5 to 6 working days).
7. **Delivered.** Order becomes COMPLETED. For COD the payment becomes PAID.
8. **Failed delivery (NDR).** A case opens and shows in *Delivery problems*. Admin chooses re-attempt, a new date (within 6 days) or corrected phone/address. These go to Delhivery.
9. **Return (RTO).** Case opens; admin marks it received back.
10. **Cancel.** Allowed before pickup completes or while in transit; refused once out for delivery. Delhivery must confirm first. If it refuses, nothing changes here.

## Settings (Cloudflare worker, not the dashboard)

| Name | Type | Meaning |
|---|---|---|
| `DELHIVERY_API_TOKEN` | secret, required | Staging and production tokens differ. |
| `DELHIVERY_MODE` | variable | `staging` for rehearsal. Anything else means production (the default). |
| `DELHIVERY_PICKUP_LOCATION` | variable | Must match the warehouse name registered in Delhivery exactly (case-sensitive). |
| `DELHIVERY_PICKUP_PINCODE`, `_PHONE`, `_ADDRESS`, `_CITY`, `_STATE` | variable | Pickup and return address. Defaults are the current business address. |
| `DELHIVERY_SELLER_NAME`, `DELHIVERY_SELLER_GST`, `DELHIVERY_HSN_CODE` | variable | Printed on bookings. GST is requested by Delhivery. HSN defaults to 4911. |
| `DELHIVERY_WEBHOOK_SECRET` | secret, optional | Enables the push webhook. |
| `DELIVERY_GRAMS_PER_SQ_IN_CANVAS` / `_ACRYLIC` | variable, optional | Weight model (defaults 2.2 and 3.2 g per sq in, plus 220 g packing per piece). |

Set a secret with `npx wrangler secret put NAME` from `backend/`. The dashboard page *Delivery settings* shows the connection state and a go-live checklist, and has a *Test connection* button.

## Go-live checklist

1. Delhivery account is active, a pickup warehouse is registered, and the wallet has at least Rs. 500 (prepaid accounts).
2. Set `DELHIVERY_PICKUP_LOCATION` to the exact registered name. Set `DELHIVERY_SELLER_GST`.
3. Rehearse with the **staging** token and `DELHIVERY_MODE=staging`: book, print the label, refresh, cancel.
4. Switch to the production token and remove `DELHIVERY_MODE` (or set `production`). Run *Test connection*.
5. Book one real order, print the label, request a pickup, and confirm tracking updates.

## Known limits

- Weight and box size are estimates from the print size. Staff can correct them before booking. Wrong weights change Delhivery's charge.
- Tracking updates every 20 minutes (instant if the push webhook is enabled).
- Customers are not emailed or messaged by this code; they see status and tracking on the storefront order page.
- Delhivery field names and status codes were taken from their official documentation; confirm against a real scan during the staging rehearsal. Unknown statuses are ignored, not guessed.
