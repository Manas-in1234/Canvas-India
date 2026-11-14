# Customer emails and GST invoice: setup

Both features are deployed and safe to leave unconfigured: **with no settings, no email is sent and the invoice shows a DRAFT warning.**
Non-secret values go in `backend/wrangler.jsonc` under `"vars"` (then `npx wrangler deploy` from `backend/`).
Secrets are set with `npx wrangler secret put NAME`.

## Customer emails (Resend)

What is sent, each at most once per order (recorded on the order timeline as `email.<kind>`):

| Email | When |
|---|---|
| Order confirmed | Order created and paid, or Cash on Delivery |
| Order shipped | First scan after pickup (picked up, in transit, out for delivery) |
| Order delivered | Delhivery reports delivery |
| Order cancelled | Admin or customer cancels |
| New-order alert (to the shop) | Same moment as the confirmation |

A failed or unconfigured email never affects the order, the payment or the shipment.

| Name | Type | Example |
|---|---|---|
| `RESEND_API_KEY` | **secret** | `re_...` from resend.com |
| `MAIL_FROM` | variable | `Canvas India <orders@canvassindia.com>` (domain must be verified in Resend) |
| `ADMIN_NOTIFY_EMAIL` | variable | `owner@canvassindia.com` (comma separated for several) |
| `MAIL_REPLY_TO` | variable, optional | `support@canvassindia.com` |
| `STORE_NAME`, `STORE_URL`, `ADMIN_URL` | variables, optional | Defaults: Canvas India, https://canvassindia.com, https://canvas-india-admin.pages.dev |

Domain verification: in Resend add the domain, then add the DNS records it shows (SPF, DKIM) in Cloudflare DNS and wait for "Verified".
Check: place a Cash on Delivery test order with your own email; the confirmation should arrive within a minute.

## GST invoice (admin: open an order, press Invoice)

Built from the order. Tax follows what was recorded on the order. If none was recorded and prices include GST, tax is backed out of the total. It never adds tax the customer did not pay.

| Name | Meaning |
|---|---|
| `BUSINESS_LEGAL_NAME` | Legal name printed on the invoice. **Required.** |
| `BUSINESS_GSTIN` | 15-character GSTIN. **Required.** Until both are set the invoice is marked DRAFT. |
| `BUSINESS_ADDRESS` | Full address with pincode |
| `BUSINESS_STATE` | Shop state (default Telangana). Decides CGST+SGST (same state) or IGST (other state). |
| `BUSINESS_PHONE`, `BUSINESS_EMAIL` | Printed in the header |
| `INVOICE_PREFIX` | Default `INV-`. Invoice number = prefix + order number, kept to 16 characters. |
| `PRICES_INCLUDE_GST` | `true` if listed prices already include GST |
| `GST_RATE` | Default 18 |
| `INVOICE_HSN_CODE` | Default 4911 (printed matter) |

**Ask the accountant:** GST requires invoice numbers in one consecutive series per financial year. Order-number-based invoice numbers are unique but not guaranteed consecutive. If a strict series is needed, that is a small change (a counter), so tell us.
