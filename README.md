<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ad638366-00a2-426b-a4d3-c68fe0ade8ac

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend Modules & Architecture

### Phase 6 — Analytics
The backend includes a comprehensive, read-only **Analytics** module covering:
- **Sales Analytics** (`GET /analytics/sales`)
- **Product Analytics** (`GET /analytics/products`)
- **Customer Analytics** (`GET /analytics/customers`)
- **Production Analytics** (`GET /analytics/production`)
- **Inventory Analytics** (`GET /analytics/inventory`)
- **Shipping Analytics** (`GET /analytics/shipping`)
- **Profitability Analytics** (`GET /analytics/profitability`)

All endpoints are secured by `JwtAuthGuard` and `PermissionsGuard` requiring the `analytics.view` permission. Detailed specifications, response structures, and filter semantics can be found in the [Analytics Documentation](docs/analytics.md).

