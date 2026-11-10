# Canvas India admin refresh

The admin retains the existing Next.js static export and Cloudflare Pages deployment. The interface uses Canvas India's official logo, deep blue navigation, orange accents, and responsive layouts. HABÄNE informed the grouped navigation and workspace structure; Canvas India's own operations and content remain the basis of each page.

## Behavior

- Permission-filtered navigation covers store management, customization, production, delivery, marketing, and administration. Page search uses the same permission-filtered navigation.
- Overview figures come from existing order, production, and shape APIs. Paid order value includes shipping and tax, counts only paid orders, and groups dates in Asia/Kolkata. There are no invented comparison percentages.
- Tables provide search, empty states, keyboard row activation, and pagination. Orders, products, and shapes have status filters.
- Shape upload, automatic outline tracing, private pending previews, approval/rejection, and approved storefront availability are preserved. No shape schema or migration changes are included.
- Static detail pages use exported placeholder paths with an ID query parameter, so navigation works on Pages without a server renderer.
- Returns and replacements use the existing request APIs and require the existing view/manage permissions.
- Missing Worker read routes now expose the existing production board, role permissions, artwork queue, and supported detail views. Authentication and all required permissions run before data loading. Customer order history requires both customer and order read permissions.

## Validation

Frontend tests cover API errors, India date boundaries, paid value, and fulfillment eligibility. Backend tests cover shape behavior, password compatibility, and lazy permission-protected read route resolution. Both applications receive TypeScript checks and the admin receives a production static build. Browser checks cover sign-in, dashboard, search, order detail, responsive navigation, shape workspace, and returns.

Production deployment uses the existing `canvas-india-admin` Pages project and `canvas-india-backend` Worker. No database migration is required for this refresh.
