# Production backend releases

Use `npm run deploy:worker` from `backend` with DATABASE_URL set to the same database used by the production HYPERDRIVE binding. This applies migrations and regenerates Prisma before publishing. A failed migration stops the release. Do not deploy new Prisma schema changes with a bare Wrangler command.

Incident: the category visibility release required migration `20261111000000_add_product_type_visibility`. The new Worker was published before its `product_types.is_active` column existed. Both Products and Categories consequently returned HTTP 500. The migration has now been applied and recorded in production.

Verified recovery: authenticated Products 865, public Products 865, Categories/product types 9, Inventory HTTP 200 with zero tracked SKUs. Inventory now separately lists catalog products without stock tracking; their stock quantities are unknown, not zero. No quantities were invented or modified.
