# Custom shapes production deployment

The storefront and backend run as Cloudflare Workers. The admin portal is a
Next.js static export on the existing `canvas-india-admin` Pages project.

The Worker entry point must expose `/api/v1/shapes` and `/api/v1/admin/shapes`;
registering NestJS controllers alone does not publish Worker routes.

The production upload route is `POST /api/v1/admin/shapes/upload` with multipart
`name` and `file` fields. PNG/JPEG uploads are limited to 1 MB and 4 megapixels,
then reduced to 600 pixels for tracing. Private originals and small PNG previews
are stored in the existing database through nullable `assets.content_bytes`.
No R2 or S3 configuration is required for this flow. The Jimp Worker alias loads
only PNG/JPEG and resizing plugins. PNG decoding uses streams because pngjs's
legacy synchronous inflater is incompatible with the Worker runtime.

Apply the three added Prisma migrations in order, generate the Prisma client,
and grant the four `shapes.*` permissions to the existing Super Admin role.
The historical guest-token migrations add and then remove the column. Before
applying them to any database, check for existing token data; production had no
such column at the time of this deployment. Do not rerun the full seed against
production just to grant permissions.

Deploy the backend from `backend/wrangler.jsonc`, build the admin with
`NEXT_PUBLIC_API_BASE_URL` set to the production `/api/v1` URL, then publish
`admin/out` to the existing Pages project. Publish the root Vite `dist` through
the root `wrangler.toml`. Preserve the existing Hyperdrive binding and runtime
configuration. The runtime support files also preserve the existing checkout
and authentication behavior already deployed in production.

Query caching is disabled on the existing Hyperdrive configuration. The backend
uses that connection for authentication, permissions, and shape review, which
require fresh reads after writes. Hyperdrive otherwise serves a stale approved
shape list even after a successful review. Connection pooling remains enabled.

Validation covers PNG and JPEG upload, private preview, pending/rejected shape
exclusion, approval visibility, repeated-review rejection, unauthenticated admin
access, and the existing product endpoint. Temporary verification records are
removed after checks. Sign out and back in if an existing admin session does not
show the newly granted permissions.
