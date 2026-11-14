import { Occasions, isOccasionSlug } from './catalog/occasions.js';
import { HomepagePromotions } from './catalog/homepage-promotions.js';
import { HomepageLayout } from './catalog/homepage-layout.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from './generated/prisma/client.js';
import { getQueryCompilerWasm } from './common/prisma-wasm/wasm-loader.js';
import { createServicesContainer, ServicesContainer } from './common/services-container.js';
import { hashPassword, verifyPassword, sha256Hex } from './common/crypto/password.js';
import { randomBytes, createHmac } from 'node:crypto';
import { WorkerShapes } from './customization/shapes/worker-shapes.js';
import { StyleLayouts } from './customization/style-layouts.js';
import { resolveAdminRead } from './common/admin-read-routes.js';
import { HeroImages } from './catalog/hero-images.js';
import { HERO_IMAGE_SLOTS, isHeroImageSlot } from './catalog/hero-image-slots.js';
import { WorkerShipping } from './shipping/worker-shipping.js';
import { sendOrderEmail, type OrderEmailEnv } from './common/order-emails.js';
import { buildInvoice, loadBusinessProfile } from './commerce/invoice.js';
import { verifyCapturedOrderPayment } from './commerce/orders/razorpay-capture.js';
import { AdminOrders } from './commerce/orders/admin-orders.js';

export interface Env {
  DATABASE_URL: string;
  HYPERDRIVE?: { connectionString: string };
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES_IN?: string;
  JWT_REFRESH_SECRET?: string;
  JWT_REFRESH_EXPIRES_IN?: string;
  NODE_ENV?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
  DELHIVERY_API_TOKEN?: string;
  DELHIVERY_PICKUP_LOCATION?: string;
  DELHIVERY_MODE?: string;
  DELHIVERY_PICKUP_PINCODE?: string;
  DELHIVERY_PICKUP_PHONE?: string;
  DELHIVERY_PICKUP_ADDRESS?: string;
  DELHIVERY_PICKUP_CITY?: string;
  DELHIVERY_PICKUP_STATE?: string;
  DELHIVERY_SELLER_NAME?: string;
  DELHIVERY_SELLER_GST?: string;
  DELHIVERY_HSN_CODE?: string;
  DELHIVERY_WEBHOOK_SECRET?: string;
  DELIVERY_GRAMS_PER_SQ_IN_CANVAS?: string;
  DELIVERY_GRAMS_PER_SQ_IN_ACRYLIC?: string;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  MAIL_REPLY_TO?: string;
  ADMIN_NOTIFY_EMAIL?: string;
  STORE_NAME?: string;
  STORE_URL?: string;
  ADMIN_URL?: string;
  BUSINESS_LEGAL_NAME?: string;
  BUSINESS_ADDRESS?: string;
  BUSINESS_STATE?: string;
  BUSINESS_GSTIN?: string;
  BUSINESS_PHONE?: string;
  BUSINESS_EMAIL?: string;
  INVOICE_PREFIX?: string;
  PRICES_INCLUDE_GST?: string;
  GST_RATE?: string;
  INVOICE_HSN_CODE?: string;
}

let cachedWasmModule: any = null;

async function getServices(env: Env): Promise<{ prisma: PrismaClient; services: ServicesContainer }> {
  if ((env as any)._services && (env as any)._prisma) {
    return { prisma: (env as any)._prisma, services: (env as any)._services };
  }
  const connectionString = env.HYPERDRIVE?.connectionString || env.DATABASE_URL;
  const adapter = new PrismaPg({ connectionString, max: 4, connectionTimeoutMillis: 5000 });
  const prisma = new PrismaClient({ adapter });
  const engineConfig = (prisma as any)._engine?.config || (prisma as any)._engineConfig;
  if (engineConfig?.compilerWasm) {
    if (!cachedWasmModule) {
      cachedWasmModule = await getQueryCompilerWasm();
    }
    if (cachedWasmModule) {
      engineConfig.compilerWasm.getQueryCompilerWasmModule = async () => cachedWasmModule;
    }
  }
  const services = createServicesContainer(prisma);
  services.orders.setRefundGateway(async (gatewayPaymentId, amountPaise, notes) => {
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials are not configured');
    }
    const auth = btoa(`${env.RAZORPAY_KEY_ID.trim()}:${env.RAZORPAY_KEY_SECRET.trim()}`);
    const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(gatewayPaymentId)}/refund`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountPaise, speed: 'normal', notes }),
      signal: AbortSignal.timeout(15000),
    });
    const data = (await response.json().catch(() => ({}))) as { id?: string; status?: string; error?: { description?: string } };
    if (!response.ok || !data.id) {
      throw new Error(data.error?.description || `Razorpay refund failed (${response.status})`);
    }
    return { id: data.id, status: data.status ?? 'created' };
  });
  return { prisma, services };
}

async function delhiveryPostalCode(pin: string, token: string) {
  const response = await fetch(`https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${encodeURIComponent(pin)}`, {
    headers: { Authorization: `Token ${token.trim()}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('Delhivery serviceability check failed');
  const data = await response.json() as { delivery_codes?: { postal_code?: { cod?: string; pre_paid?: string; city?: string; district?: string; state_code?: string } }[] };
  return data.delivery_codes?.[0]?.postal_code ?? null;
}

const ALLOWED_ORIGIN_PATTERNS = [
  /^http:\/\/localhost:(3000|3001|5173|5174)$/,
  /^http:\/\/127\.0\.0\.1:(3000|3001|5173|5174)$/,
  /^https:\/\/(.*\.)?canvaschamp\.in$/,
  /^https:\/\/(.*\.)?canvasindia\.com$/,
  /^https:\/\/(.*\.)?canvassindia\.com$/,
  /^https:\/\/.*\.pages\.dev$/,
  /^https:\/\/.*\.workers\.dev$/,
];

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin');
  const allowed = isOriginAllowed(origin);

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };

  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return headers;
}

function jsonResponse(data: any, status = 200, request?: Request): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    ...(request ? corsHeaders(request) : {}),
  };
  return new Response(JSON.stringify(data), { status, headers });
}

async function verifyJwt(token: string, secret: string): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );

    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const signature = Uint8Array.from(atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

    const valid = await crypto.subtle.verify('HMAC', key, signature, data);
    if (!valid) return null;

    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

async function signJwt(payload: Record<string, any>, secret: string, expiresInSeconds: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const toB64Url = (obj: any) =>
    btoa(JSON.stringify(obj))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const headerB64 = toB64Url({ alg: 'HS256', typ: 'JWT' });
  const payloadB64 = toB64Url(fullPayload);
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const sigBuffer = await crypto.subtle.sign('HMAC', key, data);
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${headerB64}.${payloadB64}.${sigB64}`;
}

async function authenticate(request: Request, env: Env, prisma: PrismaClient): Promise<{ user: any; error?: Response }> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: jsonResponse({ statusCode: 401, message: 'Unauthorized' }, 401, request) };
  }

  const token = authHeader.slice(7);
  const secret = env.JWT_ACCESS_SECRET || 'change-me';
  const payload = await verifyJwt(token, secret);
  if (!payload || !payload.sub) {
    return { user: null, error: jsonResponse({ statusCode: 401, message: 'Unauthorized' }, 401, request) };
  }

  const adminUser = await prisma.adminUser.findUnique({
    where: { id: payload.sub },
    include: { role: { include: { permissions: { include: { permission: true } } } } },
  });

  if (!adminUser || !adminUser.isActive) {
    return { user: null, error: jsonResponse({ statusCode: 401, message: 'Account is inactive or no longer exists' }, 401, request) };
  }

  const tokenIssuedAt = (payload.iat || 0) * 1000;
  if (tokenIssuedAt < adminUser.updatedAt.getTime()) {
    return { user: null, error: jsonResponse({ statusCode: 401, message: 'Session invalidated by a recent account change' }, 401, request) };
  }

  const permissions = adminUser.role.permissions.map((rp) => rp.permission.key);
  return {
    user: {
      id: adminUser.id,
      email: adminUser.email,
      roleId: adminUser.roleId,
      roleName: adminUser.role.name,
      permissions,
    },
  };
}

function checkPermission(user: any, required: string[], request: Request): Response | null {
  const hasAll = required.every((p) => user.permissions?.includes(p));
  if (!hasAll) {
    return jsonResponse(
      { statusCode: 403, message: `Missing required permission(s): ${required.join(', ')}`, error: 'Forbidden' },
      403,
      request,
    );
  }
  return null;
}

// ---------------------------------------------------------------------------
// Public website visibility. The website only shows products that are ACTIVE
// and whose category (product type) has not been hidden; the admin sees all.
// ---------------------------------------------------------------------------

const PRODUCT_LIST_INCLUDE = { productType: true, categories: { include: { category: true } } } as const;

/** True when the database has not been migrated to include product_types.is_active yet. */
function isMissingColumnError(err: any): boolean {
  return err?.code === 'P2022' || /column .* does not exist/i.test(String(err?.message ?? ''));
}

async function isSignedInAdmin(request: Request, env: Env, prisma: PrismaClient): Promise<boolean> {
  const header = request.headers.get('Authorization');
  if (!header || !header.startsWith('Bearer ')) return false;
  const { user, error } = await authenticate(request, env, prisma);
  return !error && Boolean(user?.permissions?.includes('products.view'));
}

async function findPublicProducts(prisma: PrismaClient) {
  const live = { deletedAt: null, status: 'ACTIVE' as const };
  const list = (where: any) =>
    prisma.product.findMany({ where, include: PRODUCT_LIST_INCLUDE, orderBy: { createdAt: 'desc' } });
  try {
    return await list({ ...live, productType: { isActive: true } });
  } catch (err: any) {
    // Deployed before the visibility migration was applied: hide by status only.
    if (isMissingColumnError(err)) return list(live);
    throw err;
  }
}

function isPubliclyVisible(product: { status?: string; productType?: { isActive?: boolean } | null }): boolean {
  return product.status === 'ACTIVE' && product.productType?.isActive !== false;
}

async function findPublicProductTypes(prisma: PrismaClient) {
  try {
    return await prisma.productType.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  } catch (err: any) {
    if (isMissingColumnError(err)) return prisma.productType.findMany({ orderBy: { name: 'asc' } });
    throw err;
  }
}

export default {
  async fetch(request: Request, env: Env, ctx?: { waitUntil(promise: Promise<unknown>): void }): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, '') || '/';
    const method = request.method;
    const query = Object.fromEntries(url.searchParams.entries());
    // Emails run after the response is sent and can never fail the request.
    const background = (task: Promise<unknown>) => {
      if (ctx?.waitUntil) ctx.waitUntil(task);
      else void task.catch(() => undefined);
    };

    let requestPrisma: PrismaClient | undefined;
    try {
      const { prisma, services } = await getServices(env);
      if (!(env as Env & { _prisma?: PrismaClient })._prisma) requestPrisma = prisma;
      if (pathname === '/api/v1/occasions' && method === 'GET') {
        return jsonResponse(await new Occasions(prisma).list(), 200, request);
      }
      const publicOccasionCover = pathname.match(/^\/api\/v1\/occasions\/([^/]+)\/cover$/);
      if (publicOccasionCover && method === 'GET' && isOccasionSlug(publicOccasionCover[1])) {
        const occasions = new Occasions(prisma);
        const slug = publicOccasionCover[1];
        const cover = await occasions.exists(slug) ? await occasions.images.get(slug) : null;
        if (!cover?.contentBytes) return jsonResponse({ message: 'Cover not found.' }, 404, request);
        return new Response(new Uint8Array(cover.contentBytes), { headers: {
          ...corsHeaders(request), 'Content-Type': cover.mimeType, 'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'public, no-cache', ETag: `"${cover.checksum}"`,
        } });
      }
      const adminOccasion = pathname.match(/^\/api\/v1\/admin\/occasions(?:\/([^/]+)(\/cover|\/visibility)?)?$/);
      if (adminOccasion) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const denied = checkPermission(user, ['products.edit'], request);
        if (denied) return denied;
        const [, slug, action] = adminOccasion;
        const occasions = new Occasions(prisma);
        if (!slug && method === 'GET') return jsonResponse(await occasions.list(true), 200, request);
        if (slug && !isOccasionSlug(slug)) return jsonResponse({ message: 'Invalid occasion URL.' }, 400, request);
        if (!slug && method === 'POST') {
          const body = await request.json() as { slug?: string };
          return jsonResponse(await occasions.save(typeof body?.slug === 'string' ? body.slug : '', body, true, user.id), 201, request);
        }
        if (slug && !action && method === 'PUT') {
          return jsonResponse(await occasions.save(slug, await request.json(), false, user.id), 200, request);
        }
        if (slug && !action && method === 'DELETE') {
          await occasions.setVisibility(slug, 'deleted', user.id);
          return new Response(null, { status: 204, headers: corsHeaders(request) });
        }
        if (slug && action === '/visibility' && method === 'PUT') {
          const body = await request.json() as { hidden?: unknown };
          if (typeof body?.hidden !== 'boolean') return jsonResponse({ message: 'Choose whether to hide or show the occasion.' }, 400, request);
          await occasions.setVisibility(slug, body.hidden ? 'hidden' : 'visible', user.id);
          return new Response(null, { status: 204, headers: corsHeaders(request) });
        }
        if (slug && action === '/cover' && (method === 'POST' || method === 'DELETE')) {
          if (!await occasions.exists(slug)) return jsonResponse({ message: 'Occasion not found.' }, 404, request);
          if (method === 'POST') return jsonResponse(await occasions.images.upload(slug, request, user.id), 200, request);
          await occasions.images.reset(slug, user.id);
          return new Response(null, { status: 204, headers: corsHeaders(request) });
        }
      }
      if (pathname === '/api/v1/homepage-promotions' && method === 'GET') {
        return jsonResponse(await new HomepagePromotions(prisma).storefront(), 200, request);
      }
      // Activity log: who changed what. Read-only; audit rows can never be edited or deleted from the API.
      if (pathname === '/api/v1/audit-logs' && method === 'GET') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const denied = checkPermission(user, ['users.view'], request);
        if (denied) return denied;
        const q = (query.q || '').trim().slice(0, 60);
        const rows = await prisma.auditLog.findMany({
          where: q ? { OR: [{ action: { contains: q, mode: 'insensitive' } }, { entityType: { contains: q, mode: 'insensitive' } }] } : undefined,
          include: { adminUser: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: Math.min(Math.max(Number(query.take) || 200, 1), 500),
        });
        return jsonResponse(rows, 200, request);
      }
      if (pathname === '/api/v1/homepage-layout' && method === 'GET') {
        return jsonResponse(await new HomepageLayout(prisma).settings(), 200, request);
      }
      if (pathname === '/api/v1/admin/homepage-layout' && (method === 'GET' || method === 'PUT')) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const denied = checkPermission(user, [method === 'GET' ? 'products.view' : 'products.edit'], request);
        if (denied) return denied;
        const layout = new HomepageLayout(prisma);
        const result = method === 'GET' ? await layout.settings() : await layout.save(await request.json(), user.id);
        return jsonResponse(result, 200, request);
      }
      if (pathname === '/api/v1/admin/homepage-promotions' && (method === 'GET' || method === 'PUT')) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const denied = checkPermission(user, ['discounts.manage'], request);
        if (denied) return denied;
        const promotions = new HomepagePromotions(prisma);
        const result = method === 'GET' ? await promotions.settings() : await promotions.save(await request.json(), user.id);
        return jsonResponse(result, 200, request);
      }
      const heroImage = pathname.match(/^\/api\/v1\/(admin\/)?hero-images(?:\/([^/]+))?$/);
      if (heroImage) {
        const [, admin, requestedSlot] = heroImage;
        const slot = isHeroImageSlot(requestedSlot) ? requestedSlot : null;
        const images = new HeroImages(prisma);
        if (requestedSlot && !slot) {
          return jsonResponse({ message: 'Unknown hero image page.' }, 404, request);
        }
        if (!admin && slot && method === 'GET') {
          const image = await images.get(slot);
          if (!image?.contentBytes?.length) {
            const fallback = new URL(HERO_IMAGE_SLOTS[slot].fallback, 'https://canvassindia.com');
            if (slot === 'home' && query.mobile === '1') fallback.searchParams.set('w', '1200');
            return new Response(null, {
              status: 307,
              headers: { ...corsHeaders(request), Location: fallback.href, 'Cache-Control': 'no-store' },
            });
          }
          const etag = `"${image.checksum}"`;
          const headers = {
            ...corsHeaders(request),
            'Content-Type': image.mimeType,
            'X-Content-Type-Options': 'nosniff',
            'Cache-Control': 'public, no-cache',
            ETag: etag,
          };
          if (request.headers.get('If-None-Match') === etag) return new Response(null, { status: 304, headers });
          return new Response(new Uint8Array(image.contentBytes), { headers });
        }
        if (admin) {
          const { user, error } = await authenticate(request, env, prisma);
          if (error) return error;
          const denied = checkPermission(user, ['products.edit'], request);
          if (denied) return denied;
          if (!slot && method === 'GET') return jsonResponse(await images.list(), 200, request);
          if (slot && method === 'POST') return jsonResponse(await images.upload(slot, request, user.id), 200, request);
          if (slot && method === 'DELETE') {
            await images.reset(slot, user.id);
            return new Response(null, { status: 204, headers: corsHeaders(request) });
          }
        }
        return jsonResponse({ message: 'Hero image route not found.' }, 404, request);
      }
      const adminRead = method === 'GET' ? resolveAdminRead(pathname, prisma, services, query.status) : null;
      if (adminRead) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const denied = checkPermission(user, adminRead.permissions, request);
        if (denied) return denied;
        return jsonResponse(await adminRead.load(), 200, request);
      }
      if (pathname === '/api/v1/shapes' && method === 'GET') {
        return jsonResponse(await new WorkerShapes(prisma).approved(), 200, request);
      }
      if (pathname === '/api/v1/admin/shapes' || pathname.startsWith('/api/v1/admin/shapes/')) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const shapes = new WorkerShapes(prisma);
        const review = pathname.match(/^\/api\/v1\/admin\/shapes\/([^/]+)\/(approve|reject)$/);
        const upload = pathname === '/api/v1/admin/shapes/upload' && method === 'POST';
        const permission = upload || method === 'PATCH' || method === 'DELETE' ? 'shapes.create' : review && method === 'POST'
          ? `shapes.${review[2]}` : 'shapes.view';
        const denied = checkPermission(user, [permission], request);
        if (denied) return denied;
        if (upload) return jsonResponse(await shapes.upload(request, user.id), 201, request);
        if (review && method === 'POST') {
          const body = await request.json() as any;
          return jsonResponse(await shapes.review(review[1], review[2] === 'approve' ? 'APPROVED' : 'REJECTED', user.id, body.reason), 200, request);
        }
        if (method === 'GET' && pathname === '/api/v1/admin/shapes')
          return jsonResponse(await shapes.list(query.status), 200, request);
        const detail = pathname.match(/^\/api\/v1\/admin\/shapes\/([^/]+)$/);
        if (method === 'GET' && detail) return jsonResponse(await shapes.get(detail[1]), 200, request);
        if (method === 'PATCH' && detail) return jsonResponse(await shapes.updateMetadata(detail[1], await request.json(), user.id), 200, request);
        if (method === 'DELETE' && detail) return jsonResponse(await shapes.remove(detail[1], user.id), 200, request);
        return jsonResponse({ message: 'Not found' }, 404, request);
      }
      // -------------------------------------------------------------
      // Customize page options — admin-managed customizer tab content
      // (wrap style, hardware, clipart, etc.) the storefront live-fetches.
      // -------------------------------------------------------------
      if (pathname === '/api/v1/option-categories' && method === 'GET') {
        const baseKey = query.baseKey;
        const materialScope = query.material as 'ACRYLIC' | 'CANVAS' | undefined;
        if (!baseKey) return jsonResponse({ statusCode: 400, message: 'baseKey is required' }, 400, request);
        const categories = await prisma.optionCategory.findMany({
          where: {
            baseKey,
            isActive: true,
            ...(materialScope ? { materialScope: { in: [materialScope, 'BOTH'] } } : {}),
          },
          include: { items: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
        });
        return jsonResponse(categories, 200, request);
      }
      if (pathname === '/api/v1/admin/option-categories' || pathname.startsWith('/api/v1/admin/option-categories/')) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;

        const itemMatch = pathname.match(/^\/api\/v1\/admin\/option-categories\/items\/([^/]+)$/);
        const reorderMatch = pathname.match(/^\/api\/v1\/admin\/option-categories\/([^/]+)\/items\/reorder$/);
        const createItemMatch = pathname.match(/^\/api\/v1\/admin\/option-categories\/([^/]+)\/items$/);
        const detailMatch = pathname.match(/^\/api\/v1\/admin\/option-categories\/([^/]+)$/);

        const isManage = method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE';
        const denied = checkPermission(user, [isManage ? 'option_catalog.manage' : 'option_catalog.view'], request);
        if (denied) return denied;

        try {
          // Literal "items/..." routes must be checked before the ":id" pattern
          // below, since "items" would otherwise be greedily captured as an id.
          if (itemMatch && method === 'PATCH') {
            const body = (await request.json()) as any;
            const updated = await prisma.optionCategoryItem.update({ where: { id: itemMatch[1] }, data: body });
            await services.audit.record({ adminUserId: user.id, action: 'OPTION_CATEGORY_ITEM_UPDATED', entityType: 'OptionCategoryItem', entityId: itemMatch[1] });
            return jsonResponse(updated, 200, request);
          }
          if (itemMatch && method === 'DELETE') {
            await prisma.optionCategoryItem.delete({ where: { id: itemMatch[1] } });
            await services.audit.record({ adminUserId: user.id, action: 'OPTION_CATEGORY_ITEM_DELETED', entityType: 'OptionCategoryItem', entityId: itemMatch[1] });
            return jsonResponse({ success: true }, 200, request);
          }
          if (reorderMatch && method === 'PUT') {
            const body = (await request.json()) as any;
            const itemIds: string[] = body.itemIds || [];
            await prisma.$transaction(
              itemIds.map((itemId, index) =>
                prisma.optionCategoryItem.update({ where: { id: itemId, categoryId: reorderMatch[1] }, data: { sortOrder: index } }),
              ),
            );
            await services.audit.record({ adminUserId: user.id, action: 'OPTION_CATEGORY_ITEMS_REORDERED', entityType: 'OptionCategory', entityId: reorderMatch[1] });
            const category = await prisma.optionCategory.findUnique({
              where: { id: reorderMatch[1] },
              include: { items: { orderBy: { sortOrder: 'asc' } } },
            });
            return jsonResponse(category, 200, request);
          }
          if (createItemMatch && method === 'POST') {
            const body = (await request.json()) as any;
            const maxSortOrder = await prisma.optionCategoryItem.aggregate({
              where: { categoryId: createItemMatch[1] },
              _max: { sortOrder: true },
            });
            const item = await prisma.optionCategoryItem.create({
              data: { ...body, categoryId: createItemMatch[1], sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1 },
            });
            await services.audit.record({ adminUserId: user.id, action: 'OPTION_CATEGORY_ITEM_CREATED', entityType: 'OptionCategoryItem', entityId: item.id });
            return jsonResponse(item, 201, request);
          }
          if (method === 'GET' && pathname === '/api/v1/admin/option-categories') {
            // The overview only needs how many items each list has. Sending every item with its
            // images and settings made this response grow until it ran out of processing time.
            // Each list's full items are loaded one at a time when it is opened.
            const categories = await prisma.optionCategory.findMany({
              orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
              include: { items: { select: { id: true }, orderBy: { sortOrder: 'asc' } } },
            });
            return jsonResponse(categories, 200, request);
          }
          if (method === 'POST' && pathname === '/api/v1/admin/option-categories') {
            const body = (await request.json()) as any;
            const category = await prisma.optionCategory.create({ data: body });
            await services.audit.record({ adminUserId: user.id, action: 'OPTION_CATEGORY_CREATED', entityType: 'OptionCategory', entityId: category.id });
            return jsonResponse(category, 201, request);
          }
          if (detailMatch && method === 'GET') {
            const category = await prisma.optionCategory.findUnique({
              where: { id: detailMatch[1] },
              include: { items: { orderBy: { sortOrder: 'asc' } } },
            });
            if (!category) return jsonResponse({ statusCode: 404, message: `Option category ${detailMatch[1]} not found` }, 404, request);
            return jsonResponse(category, 200, request);
          }
          if (detailMatch && method === 'PATCH') {
            const body = (await request.json()) as any;
            const updated = await prisma.optionCategory.update({ where: { id: detailMatch[1] }, data: body });
            await services.audit.record({ adminUserId: user.id, action: 'OPTION_CATEGORY_UPDATED', entityType: 'OptionCategory', entityId: detailMatch[1] });
            return jsonResponse(updated, 200, request);
          }
          if (detailMatch && method === 'DELETE') {
            await prisma.optionCategory.delete({ where: { id: detailMatch[1] } });
            await services.audit.record({ adminUserId: user.id, action: 'OPTION_CATEGORY_DELETED', entityType: 'OptionCategory', entityId: detailMatch[1] });
            return jsonResponse({ success: true }, 200, request);
          }
        } catch (err: any) {
          if (err?.code === 'P2025') {
            return jsonResponse({ statusCode: 404, message: 'Record not found' }, 404, request);
          }
          throw err;
        }
        return jsonResponse({ message: 'Not found' }, 404, request);
      }
      // -------------------------------------------------------------
      // Pricing settings — admin-editable rates used directly in storefront
      // pricing formulas (shape area rate, acrylic thickness rates, etc.).
      // -------------------------------------------------------------
      if (pathname === '/api/v1/pricing-settings' && method === 'GET') {
        const settings = await prisma.pricingSetting.findMany({
          select: { key: true, value: true }, orderBy: { key: 'asc' },
        });
        return jsonResponse(settings, 200, request);
      }
      if (pathname === '/api/v1/admin/pricing-settings' || pathname.startsWith('/api/v1/admin/pricing-settings/')) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const isManage = method === 'PATCH' || method === 'POST' || method === 'DELETE';
        const denied = checkPermission(user, [isManage ? 'pricing.manage' : 'pricing.view'], request);
        if (denied) return denied;

        try {
          if (method === 'GET' && pathname === '/api/v1/admin/pricing-settings') {
            const settings = await prisma.pricingSetting.findMany({ orderBy: { key: 'asc' } });
            return jsonResponse(settings, 200, request);
          }
          // Add a new pricing method.
          if (method === 'POST' && pathname === '/api/v1/admin/pricing-settings') {
            const body = (await request.json()) as any;
            const key = String(body.key ?? '').trim().toLowerCase();
            if (!/^[a-z0-9_]{2,80}$/.test(key)) {
              return jsonResponse({ message: 'Key must be 2-80 characters: lowercase letters, numbers and underscores.' }, 400, request);
            }
            if (body.value === undefined || body.value === null || String(body.value).trim() === '' || !Number.isFinite(Number(body.value)) || Number(body.value) < 0) {
              return jsonResponse({ message: 'Rate must be a non-negative number' }, 400, request);
            }
            const existing = await prisma.pricingSetting.findUnique({ where: { key } });
            if (existing) return jsonResponse({ message: 'A pricing method with this key already exists.' }, 409, request);
            const created = await prisma.pricingSetting.create({
              data: {
                key,
                value: String(body.value),
                description: typeof body.description === 'string' && body.description.trim() ? body.description.trim() : null,
                updatedBy: user.id,
              },
            });
            await services.audit.record({
              adminUserId: user.id, action: 'PRICING_SETTING_CREATED', entityType: 'PricingSetting', entityId: key,
              reason: `Created with ${body.value}`,
            });
            return jsonResponse(created, 201, request);
          }
          const keyMatch = pathname.match(/^\/api\/v1\/admin\/pricing-settings\/([^/]+)$/);
          // Delete a pricing method.
          if (keyMatch && method === 'DELETE') {
            await prisma.pricingSetting.delete({ where: { key: keyMatch[1] } });
            await services.audit.record({
              adminUserId: user.id, action: 'PRICING_SETTING_DELETED', entityType: 'PricingSetting', entityId: keyMatch[1],
              reason: 'Deleted',
            });
            return jsonResponse({ success: true }, 200, request);
          }
          if (keyMatch && method === 'PATCH') {
            const body = (await request.json()) as any;
            if ((typeof body.value !== 'string' && typeof body.value !== 'number') || String(body.value).trim() === '' || !Number.isFinite(Number(body.value)) || Number(body.value) < 0) {
              return jsonResponse({ message: 'Rate must be a non-negative number' }, 400, request);
            }
            const key = keyMatch[1];
            const data: { value: string; updatedBy: string; description?: string | null } = { value: String(body.value), updatedBy: user.id };
            if (typeof body.description === 'string') data.description = body.description.trim() || null;
            const material = key === 'canvas_shape_area_rate_per_sqin' ? 'Canvas'
              : key === 'acrylic_shape_area_rate_per_sqin' ? 'Acrylic' : null;
            const updated = material
              ? await prisma.pricingSetting.upsert({
                  where: { key }, update: data,
                  create: { key, ...data, description: `${material} non-rectangular shape surcharge per square inch` },
                })
              : await prisma.pricingSetting.update({ where: { key }, data });
            await services.audit.record({
              adminUserId: user.id,
              action: 'PRICING_SETTING_UPDATED',
              entityType: 'PricingSetting',
              entityId: keyMatch[1],
              reason: `Set to ${body.value}`,
            });
            return jsonResponse(updated, 200, request);
          }
        } catch (err: any) {
          if (err?.code === 'P2025') {
            return jsonResponse({ statusCode: 404, message: 'Record not found' }, 404, request);
          }
          throw err;
        }
        return jsonResponse({ message: 'Not found' }, 404, request);
      }
      // -------------------------------------------------------------
      // Size presets — admin-managed size/panel options the storefront
      // customize page live-fetches per product type.
      // -------------------------------------------------------------
      if (pathname === '/api/v1/size-presets' && method === 'GET') {
        const productTypeId = query.productTypeId;
        const shapeId = query.shapeId;
        if (!productTypeId) return jsonResponse({ statusCode: 400, message: 'productTypeId is required' }, 400, request);
        const presets = await prisma.sizePreset.findMany({
          where: { productTypeId, isActive: true, ...(shapeId ? { shapeId } : {}) },
          orderBy: { sortOrder: 'asc' },
        });
        return jsonResponse(presets, 200, request);
      }
      if (pathname === '/api/v1/admin/size-presets' || pathname.startsWith('/api/v1/admin/size-presets/')) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const isManage = method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE';
        const denied = checkPermission(user, [isManage ? 'size_presets.manage' : 'size_presets.view'], request);
        if (denied) return denied;

        try {
          if (method === 'PUT' && pathname === '/api/v1/admin/size-presets/reorder') {
            const body = (await request.json()) as any;
            const itemIds: string[] = body.itemIds || [];
            await prisma.$transaction(
              itemIds.map((presetId, index) =>
                prisma.sizePreset.update({ where: { id: presetId, productTypeId: body.productTypeId }, data: { sortOrder: index } }),
              ),
            );
            await services.audit.record({ adminUserId: user.id, action: 'SIZE_PRESETS_REORDERED', entityType: 'SizePreset', entityId: body.productTypeId });
            const presets = await prisma.sizePreset.findMany({
              where: { productTypeId: body.productTypeId },
              orderBy: { sortOrder: 'asc' },
            });
            return jsonResponse(presets, 200, request);
          }
          if (method === 'GET' && pathname === '/api/v1/admin/size-presets') {
            const presets = await prisma.sizePreset.findMany({
              where: query.productTypeId ? { productTypeId: query.productTypeId } : undefined,
              orderBy: [{ productTypeId: 'asc' }, { sortOrder: 'asc' }],
            });
            return jsonResponse(presets, 200, request);
          }
          if (method === 'POST' && pathname === '/api/v1/admin/size-presets') {
            const body = (await request.json()) as any;
            const maxSortOrder = await prisma.sizePreset.aggregate({
              where: { productTypeId: body.productTypeId },
              _max: { sortOrder: true },
            });
            const preset = await prisma.sizePreset.create({
              data: { ...body, sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1 },
            });
            await services.audit.record({ adminUserId: user.id, action: 'SIZE_PRESET_CREATED', entityType: 'SizePreset', entityId: preset.id });
            return jsonResponse(preset, 201, request);
          }
          const detailMatch = pathname.match(/^\/api\/v1\/admin\/size-presets\/([^/]+)$/);
          if (detailMatch && method === 'GET') {
            const preset = await prisma.sizePreset.findUnique({ where: { id: detailMatch[1] } });
            if (!preset) return jsonResponse({ statusCode: 404, message: `Size preset ${detailMatch[1]} not found` }, 404, request);
            return jsonResponse(preset, 200, request);
          }
          if (detailMatch && method === 'PATCH') {
            const body = (await request.json()) as any;
            const updated = await prisma.sizePreset.update({ where: { id: detailMatch[1] }, data: body });
            await services.audit.record({ adminUserId: user.id, action: 'SIZE_PRESET_UPDATED', entityType: 'SizePreset', entityId: detailMatch[1] });
            return jsonResponse(updated, 200, request);
          }
          if (detailMatch && method === 'DELETE') {
            await prisma.sizePreset.delete({ where: { id: detailMatch[1] } });
            await services.audit.record({ adminUserId: user.id, action: 'SIZE_PRESET_DELETED', entityType: 'SizePreset', entityId: detailMatch[1] });
            return jsonResponse({ success: true }, 200, request);
          }
        } catch (err: any) {
          if (err?.code === 'P2025') {
            return jsonResponse({ statusCode: 404, message: 'Record not found' }, 404, request);
          }
          throw err;
        }
        return jsonResponse({ message: 'Not found' }, 404, request);
      }
      // -------------------------------------------------------------
      // Customizer product types — the cards on the customizer's PRODUCTS
      // tab (Single Print, Wall Display, ...), per material.
      // -------------------------------------------------------------
      if (pathname === '/api/v1/customizer-layouts' && method === 'GET') {
        const material = query.material === 'ACRYLIC' ? 'ACRYLIC' : 'CANVAS';
        return jsonResponse(await new StyleLayouts(prisma).list(material), 200, request);
      }
      const styleLayouts = pathname.match(/^\/api\/v1\/admin\/customizer-product-types\/([a-zA-Z0-9-]+)\/layouts(?:\/([a-zA-Z0-9-]+))?$/);
      if (styleLayouts) {
        const [, styleId, layoutId] = styleLayouts;
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const denied = checkPermission(user, [method === 'GET' ? 'option_catalog.view' : 'option_catalog.manage'], request);
        if (denied) return denied;
        const layouts = new StyleLayouts(prisma);
        if (!layoutId && method === 'GET') return jsonResponse(await layouts.list('CANVAS', styleId), 200, request);
        if (layoutId && method === 'PUT') {
          return jsonResponse(await layouts.save(styleId, layoutId, await request.json(), user.id), 200, request);
        }
        if (layoutId && method === 'DELETE') {
          await layouts.remove(styleId, layoutId, user.id);
          return new Response(null, { status: 204, headers: corsHeaders(request) });
        }
      }
      if (pathname === '/api/v1/customizer-product-types' && method === 'GET') {
        const material = query.material as 'ACRYLIC' | 'CANVAS' | undefined;
        const types = await prisma.customizerProductType.findMany({
          where: { isActive: true, ...(material ? { material } : {}) },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        });
        return jsonResponse(types, 200, request);
      }
      if (pathname === '/api/v1/admin/customizer-product-types' || pathname.startsWith('/api/v1/admin/customizer-product-types/')) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const isManage = method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE';
        const denied = checkPermission(user, [isManage ? 'option_catalog.manage' : 'option_catalog.view'], request);
        if (denied) return denied;

        try {
          if (method === 'PUT' && pathname === '/api/v1/admin/customizer-product-types/reorder') {
            const body = (await request.json()) as any;
            const ids: string[] = body.itemIds || [];
            await prisma.$transaction(
              ids.map((typeId, index) =>
                prisma.customizerProductType.update({ where: { id: typeId }, data: { sortOrder: index } }),
              ),
            );
            await services.audit.record({ adminUserId: user.id, action: 'CUSTOMIZER_PRODUCT_TYPES_REORDERED', entityType: 'CustomizerProductType', entityId: body.material ?? 'all' });
            const types = await prisma.customizerProductType.findMany({
              where: body.material ? { material: body.material } : undefined,
              orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
            });
            return jsonResponse(types, 200, request);
          }
          if (method === 'GET' && pathname === '/api/v1/admin/customizer-product-types') {
            const types = await prisma.customizerProductType.findMany({
              where: query.material ? { material: query.material as 'ACRYLIC' | 'CANVAS' } : undefined,
              orderBy: [{ material: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
            });
            return jsonResponse(types, 200, request);
          }
          if (method === 'POST' && pathname === '/api/v1/admin/customizer-product-types') {
            const body = (await request.json()) as any;
            if (body.material !== 'ACRYLIC' && body.material !== 'CANVAS') {
              return jsonResponse({ statusCode: 400, message: 'material must be ACRYLIC or CANVAS' }, 400, request);
            }
            const maxSort = await prisma.customizerProductType.aggregate({
              where: { material: body.material },
              _max: { sortOrder: true },
            });
            const created = await prisma.customizerProductType.create({
              data: { ...body, sortOrder: (maxSort._max.sortOrder ?? -1) + 1 },
            });
            await services.audit.record({ adminUserId: user.id, action: 'CUSTOMIZER_PRODUCT_TYPE_CREATED', entityType: 'CustomizerProductType', entityId: created.id });
            return jsonResponse(created, 201, request);
          }
          const detailMatch = pathname.match(/^\/api\/v1\/admin\/customizer-product-types\/([^/]+)$/);
          if (detailMatch && method === 'GET') {
            const found = await prisma.customizerProductType.findUnique({ where: { id: detailMatch[1] } });
            if (!found) return jsonResponse({ statusCode: 404, message: `Product type ${detailMatch[1]} not found` }, 404, request);
            return jsonResponse(found, 200, request);
          }
          if (detailMatch && method === 'PATCH') {
            const body = (await request.json()) as any;
            const { material: _ignored, ...rest } = body;
            const updated = await prisma.customizerProductType.update({ where: { id: detailMatch[1] }, data: rest });
            await services.audit.record({ adminUserId: user.id, action: 'CUSTOMIZER_PRODUCT_TYPE_UPDATED', entityType: 'CustomizerProductType', entityId: detailMatch[1] });
            return jsonResponse(updated, 200, request);
          }
          if (detailMatch && method === 'DELETE') {
            await prisma.customizerProductType.delete({ where: { id: detailMatch[1] } });
            await services.audit.record({ adminUserId: user.id, action: 'CUSTOMIZER_PRODUCT_TYPE_DELETED', entityType: 'CustomizerProductType', entityId: detailMatch[1] });
            return jsonResponse({ success: true }, 200, request);
          }
        } catch (err: any) {
          if (err?.code === 'P2025') {
            return jsonResponse({ statusCode: 404, message: 'Record not found' }, 404, request);
          }
          if (err?.code === 'P2002') {
            return jsonResponse({ statusCode: 409, message: 'A style with that identifier already exists for this material' }, 409, request);
          }
          throw err;
        }
        return jsonResponse({ message: 'Not found' }, 404, request);
      }
      // -------------------------------------------------------------
      // 1. Health check
      // -------------------------------------------------------------
      if (pathname === '/api/v1/health' || pathname === '/health' || pathname === '/') {
        return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() }, 200, request);
      }

      // -------------------------------------------------------------
      // 2. Auth Module
      // -------------------------------------------------------------
      if (pathname === '/api/v1/auth/login' && method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as any;
        const { email, password } = body;
        if (!email || !password) {
          return jsonResponse({ statusCode: 400, message: 'email and password are required' }, 400, request);
        }

        const adminUser = await prisma.adminUser.findUnique({
          where: { email },
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        });

        if (!adminUser || !adminUser.isActive) {
          return jsonResponse({ statusCode: 401, message: 'Invalid credentials' }, 401, request);
        }

        const verifyResult = await verifyPassword(adminUser.passwordHash, password);
        if (verifyResult.migrationRequired) {
          return jsonResponse(
            {
              statusCode: 403,
              error: 'Forbidden',
              message: 'Your account requires a one-time password update for the upgraded authentication engine.',
              code: 'PASSWORD_MIGRATION_REQUIRED',
            },
            403,
            request,
          );
        }

        if (!verifyResult.valid) {
          return jsonResponse({ statusCode: 401, message: 'Invalid credentials' }, 401, request);
        }

        const accessToken = await signJwt({ sub: adminUser.id }, env.JWT_ACCESS_SECRET || 'change-me', 15 * 60);
        const refreshToken = randomBytes(48).toString('hex');
        const refreshTokenHash = await sha256Hex(refreshToken);

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await prisma.session.create({
          data: {
            adminUserId: adminUser.id,
            refreshTokenHash,
            userAgent: request.headers.get('user-agent') || undefined,
            ipAddress: request.headers.get('cf-connecting-ip') || undefined,
            expiresAt,
          },
        });

        await services.audit.record({
          adminUserId: adminUser.id,
          action: 'LOGIN',
          entityType: 'AdminUser',
          entityId: adminUser.id,
        });

        return jsonResponse(
          {
            accessToken,
            refreshToken,
            user: {
              id: adminUser.id,
              email: adminUser.email,
              roleId: adminUser.roleId,
              roleName: adminUser.role.name,
              permissions: adminUser.role.permissions.map((rp) => rp.permission.key),
            },
          },
          200,
          request,
        );
      }

      if (pathname === '/api/v1/auth/me' && method === 'GET') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        return jsonResponse(user, 200, request);
      }

      if (pathname === '/api/v1/auth/refresh' && method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as any;
        const { refreshToken } = body;
        if (!refreshToken) {
          return jsonResponse({ statusCode: 400, message: 'refreshToken is required' }, 400, request);
        }

        if (typeof refreshToken !== 'string' || !/^[a-f0-9]{96}$/i.test(refreshToken)) {
          return jsonResponse({ statusCode: 401, message: 'Invalid or expired refresh token' }, 401, request);
        }
        const tokenHash = await sha256Hex(refreshToken);
        const now = new Date();
        const newRefreshToken = createHmac('sha384', env.JWT_ACCESS_SECRET)
          .update('admin-refresh-successor:' + refreshToken).digest('hex');
        const newRefreshTokenHash = await sha256Hex(newRefreshToken);
        const adminUserId = await prisma.$transaction(async tx => {
          const previous = await tx.session.findFirst({
            where: { refreshTokenHash: tokenHash, expiresAt: { gt: now }, adminUser: { isActive: true } },
          });
          if (!previous) return null;
          const rotated = await tx.session.updateMany({
            where: { id: previous.id, revokedAt: null },
            data: { revokedAt: now },
          });
          if (rotated.count) {
            await tx.session.create({ data: {
              adminUserId: previous.adminUserId,
              refreshTokenHash: newRefreshTokenHash,
              expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
            } });
            return previous.adminUserId;
          }
          // A retry can recover a recently rotated token if the first response was lost.
          // An explicitly logged-out token has no active successor to recover.
          const successor = await tx.session.findFirst({
            where: { adminUserId: previous.adminUserId, refreshTokenHash: newRefreshTokenHash,
              revokedAt: null, expiresAt: { gt: now }, createdAt: { gte: new Date(now.getTime() - 60000) } },
          });
          return successor?.adminUserId ?? null;
        });
        if (!adminUserId) {
          return jsonResponse({ statusCode: 401, message: 'Invalid or expired refresh token' }, 401, request);
        }
        const accessToken = await signJwt({ sub: adminUserId }, env.JWT_ACCESS_SECRET, 15 * 60);
        return jsonResponse({ accessToken, refreshToken: newRefreshToken }, 200, request);
      }

      if (pathname === '/api/v1/auth/logout' && method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as any;
        const { refreshToken } = body;
        if (refreshToken) {
          const tokenHash = await sha256Hex(refreshToken);
          await prisma.session.updateMany({ where: { refreshTokenHash: tokenHash, revokedAt: null }, data: { revokedAt: new Date() } });
        }
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      }

      if (pathname === '/api/v1/auth/change-password' && method === 'POST') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;

        const body = (await request.json().catch(() => ({}))) as any;
        const { currentPassword, newPassword } = body;
        if (!currentPassword || !newPassword) {
          return jsonResponse({ statusCode: 400, message: 'currentPassword and newPassword are required' }, 400, request);
        }

        const adminUser = await prisma.adminUser.findUniqueOrThrow({ where: { id: user.id } });
        const verifyResult = await verifyPassword(adminUser.passwordHash, currentPassword);
        if (verifyResult.migrationRequired) {
          return jsonResponse(
            {
              statusCode: 403,
              error: 'Forbidden',
              message: 'Your account requires a one-time password update for the upgraded authentication engine.',
              code: 'PASSWORD_MIGRATION_REQUIRED',
            },
            403,
            request,
          );
        }

        if (!verifyResult.valid) {
          return jsonResponse({ statusCode: 401, message: 'Current password is incorrect' }, 401, request);
        }

        const newPasswordHash = await hashPassword(newPassword);
        await prisma.adminUser.update({
          where: { id: user.id },
          data: { passwordHash: newPasswordHash },
        });

        await prisma.session.updateMany({
          where: { adminUserId: user.id, revokedAt: null },
          data: { revokedAt: new Date() },
        });

        await services.audit.record({
          adminUserId: user.id,
          action: 'PASSWORD_CHANGE',
          entityType: 'AdminUser',
          entityId: user.id,
        });

        return new Response(null, { status: 204, headers: corsHeaders(request) });
      }

      // -------------------------------------------------------------
      // 3. Warehouses Module
      // -------------------------------------------------------------
      if (pathname === '/api/v1/warehouses') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;

        if (method === 'GET') {
          const permError = checkPermission(user, ['warehouses.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.warehouses.findAll(), 200, request);
        }
        if (method === 'POST') {
          const permError = checkPermission(user, ['warehouses.manage'], request);
          if (permError) return permError;
          const body = await request.json();
          return jsonResponse(await services.warehouses.create(body), 201, request);
        }
      }

      const warehouseMatch = pathname.match(/^\/api\/v1\/warehouses\/([^/]+)$/);
      if (warehouseMatch) {
        const id = warehouseMatch[1];
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;

        if (method === 'GET') {
          const permError = checkPermission(user, ['warehouses.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.warehouses.findOne(id), 200, request);
        }
        if (method === 'DELETE') {
          const permError = checkPermission(user, ['warehouses.manage'], request);
          if (permError) return permError;
          return jsonResponse(await services.warehouses.deactivate(id), 200, request);
        }
      }

      // -------------------------------------------------------------
      // 4. Inventory Module
      // -------------------------------------------------------------
      if (pathname === '/api/v1/inventory') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['inventory.view'], request);
        if (permError) return permError;
        return jsonResponse(await services.inventory.findAll(), 200, request);
      }

      if (pathname === '/api/v1/inventory/adjust' && method === 'POST') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['inventory.adjust'], request);
        if (permError) return permError;
        const body = await request.json();
        return jsonResponse(await services.inventory.adjust(body.variantId, body.quantity, user.id, body.reason), 201, request);
      }

      // -------------------------------------------------------------
      // 5. Catalog: Products, Categories, Collections, Product-Types, Variants, Options
      // -------------------------------------------------------------
      if (pathname === '/api/v1/products') {
        if (method === 'GET') {
          // Admin list: the admin app asks for it explicitly with ?admin=1, which
          // needs a login with products.view. A signed-in admin who calls without
          // the flag gets the same (so an older cached admin page keeps working).
          // Everyone else only sees what is live on the website.
          if (query.admin === '1') {
            const { user, error } = await authenticate(request, env, prisma);
            if (error) return error;
            const denied = checkPermission(user, ['products.view'], request);
            if (denied) return denied;
            const products = query.view === 'summary'
              ? await services.products.findAdminSummaries()
              : await services.products.findAll(true);
            return jsonResponse(products, 200, request);
          }
          if (await isSignedInAdmin(request, env, prisma)) {
            return jsonResponse(await services.products.findAll(true), 200, request);
          }
          return jsonResponse(await findPublicProducts(prisma), 200, request);
        }
        if (method === 'POST') {
          const { user, error } = await authenticate(request, env, prisma);
          if (error) return error;
          const permError = checkPermission(user, ['products.create'], request);
          if (permError) return permError;
          const body = await request.json() as import('./catalog/products/dto/create-product.dto.js').CreateProductDto;
          if (body.status === 'ACTIVE') {
            const denied = checkPermission(user, ['products.edit'], request);
            if (denied) return denied;
          }
          return jsonResponse(await services.products.create(body), 201, request);
        }
      }

      const productMatch = pathname.match(/^\/api\/v1\/products\/([^/]+)$/);
      if (productMatch) {
        const id = productMatch[1];
        if (method === 'GET') {
          const product: any = await services.products.findOne(id);
          if (!(await isSignedInAdmin(request, env, prisma)) && !isPubliclyVisible(product)) {
            return jsonResponse({ statusCode: 404, message: `Product ${id} not found` }, 404, request);
          }
          return jsonResponse(product, 200, request);
        }
        if (method === 'PATCH') {
          const { user, error } = await authenticate(request, env, prisma);
          if (error) return error;
          const permError = checkPermission(user, ['products.edit'], request);
          if (permError) return permError;
          const body = await request.json();
          return jsonResponse(await services.products.update(id, body, user.id), 200, request);
        }
        if (method === 'DELETE') {
          const { user, error } = await authenticate(request, env, prisma);
          if (error) return error;
          const permError = checkPermission(user, ['products.delete'], request);
          if (permError) return permError;
          return jsonResponse(await services.products.softDelete(id, user.id), 200, request);
        }
      }

      if (pathname === '/api/v1/categories') {
        if (method === 'GET') return jsonResponse(await services.categories.findAll(), 200, request);
        if (method === 'POST') {
          const { user, error } = await authenticate(request, env, prisma);
          if (error) return error;
          const permError = checkPermission(user, ['products.edit'], request);
          if (permError) return permError;
          const body = await request.json();
          return jsonResponse(await services.categories.create(body.name, body.slug), 201, request);
        }
      }

      if (pathname === '/api/v1/collections') {
        if (method === 'GET') return jsonResponse(await services.collections.findAll(), 200, request);
        if (method === 'POST') {
          const { user, error } = await authenticate(request, env, prisma);
          if (error) return error;
          const permError = checkPermission(user, ['products.edit'], request);
          if (permError) return permError;
          const body = await request.json();
          return jsonResponse(await services.collections.create(body.name, body.slug), 201, request);
        }
      }

      if (pathname === '/api/v1/product-types') {
        if (method === 'POST') {
          const { user, error } = await authenticate(request, env, prisma);
          if (error) return error;
          const denied = checkPermission(user, ['products.edit'], request);
          if (denied) return denied;
          const body = await request.json() as { name?: unknown };
          const category = await services.productTypes.create(body?.name);
          return jsonResponse(category, 201, request);
        }

        if (method === 'GET') {
          if (!(await isSignedInAdmin(request, env, prisma))) {
            return jsonResponse(await findPublicProductTypes(prisma), 200, request);
          }
          const [types, counts] = await Promise.all([
            services.productTypes.findAll(),
            prisma.product.groupBy({ by: ['productTypeId', 'status'], where: { deletedAt: null }, _count: { _all: true } }),
          ]);
          return jsonResponse(
            types.map((type: any) => {
              const own = counts.filter((c) => c.productTypeId === type.id);
              return {
                ...type,
                productCount: own.reduce((sum, c) => sum + c._count._all, 0),
                liveCount: own.filter((c) => c.status === 'ACTIVE').reduce((sum, c) => sum + c._count._all, 0),
              };
            }),
            200,
            request,
          );
        }
      }

      const productTypeMatch = pathname.match(/^\/api\/v1\/product-types\/([^/]+)$/);
      if (productTypeMatch && method === 'DELETE') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const denied = checkPermission(user, ['products.edit'], request);
        if (denied) return denied;
        try {
          await services.productTypes.deleteEmpty(decodeURIComponent(productTypeMatch[1]));
        } catch (error) {
          if ((error as { code?: string }).code === 'P2003') {
            return jsonResponse({ message: 'This category is linked to products. Hide it from the website instead.' }, 409, request);
          }
          throw error;
        }
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      }
      if (productTypeMatch && method === 'PATCH') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['products.edit'], request);
        if (permError) return permError;
        const body = (await request.json()) as any;
        if (typeof body.isActive !== 'boolean') {
          return jsonResponse({ statusCode: 400, message: 'isActive (true or false) is required' }, 400, request);
        }
        try {
          const updated = await prisma.productType.update({ where: { id: productTypeMatch[1] }, data: { isActive: body.isActive } });
          await services.audit.record({
            adminUserId: user.id,
            action: body.isActive ? 'CATEGORY_SHOWN_ON_WEBSITE' : 'CATEGORY_HIDDEN_FROM_WEBSITE',
            entityType: 'ProductType',
            entityId: updated.id,
            reason: updated.name,
          });
          return jsonResponse(updated, 200, request);
        } catch (err: any) {
          if (err?.code === 'P2025') return jsonResponse({ statusCode: 404, message: 'Category not found' }, 404, request);
          throw err;
        }
      }

      const variantsMatch = pathname.match(/^\/api\/v1\/products\/([^/]+)\/variants$/);
      if (variantsMatch) {
        const productId = variantsMatch[1];
        if (method === 'GET') return jsonResponse(await services.variants.findByProduct(productId), 200, request);
        if (method === 'POST') {
          const { user, error } = await authenticate(request, env, prisma);
          if (error) return error;
          const permError = checkPermission(user, ['products.edit'], request);
          if (permError) return permError;
          const body = await request.json();
          return jsonResponse(await services.variants.create(productId, body.sku, body.price, body.optionValueIds), 201, request);
        }
      }

      if (pathname === '/api/v1/option-groups') {
        if (method === 'GET') return jsonResponse(await services.options.findAllGroups(), 200, request);
        if (method === 'POST') {
          const { user, error } = await authenticate(request, env, prisma);
          if (error) return error;
          const permError = checkPermission(user, ['products.edit'], request);
          if (permError) return permError;
          const body = await request.json();
          return jsonResponse(await services.options.createGroup(body.name), 201, request);
        }
      }

      // -------------------------------------------------------------
      // 6. Commerce: Cart, Orders, Returns
      // -------------------------------------------------------------
      const cartMatch = pathname.match(/^\/api\/v1\/customers\/([^/]+)\/cart$/);
      if (cartMatch) {
        const customerId = cartMatch[1];
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['orders.view'], request);
        if (permError) return permError;

        if (method === 'GET') {
          const cart = await services.cart.getOrCreateForCustomer(customerId);
          return jsonResponse(await services.cart.priceCart(cart.id), 200, request);
        }
      }

      const cartItemMatch = pathname.match(/^\/api\/v1\/customers\/([^/]+)\/cart\/items$/);
      if (cartItemMatch && method === 'POST') {
        const customerId = cartItemMatch[1];
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['orders.create'], request);
        if (permError) return permError;

        const cart = await services.cart.getOrCreateForCustomer(customerId);
        const body = await request.json();
        await services.cart.addItem(cart.id, body.variantId, body.quantity, body.configuration, body.designVersionId);
        return jsonResponse(await services.cart.priceCart(cart.id), 201, request);
      }

      const cartItemDeleteMatch = pathname.match(/^\/api\/v1\/customers\/([^/]+)\/cart\/items\/([^/]+)$/);
      if (cartItemDeleteMatch && method === 'DELETE') {
        const customerId = cartItemDeleteMatch[1];
        const itemId = cartItemDeleteMatch[2];
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['orders.create'], request);
        if (permError) return permError;

        await services.cart.removeItem(itemId);
        const cart = await services.cart.getOrCreateForCustomer(customerId);
        return jsonResponse(await services.cart.priceCart(cart.id), 200, request);
      }

      const cartDiscountMatch = pathname.match(/^\/api\/v1\/customers\/([^/]+)\/cart\/discount$/);
      if (cartDiscountMatch) {
        const customerId = cartDiscountMatch[1];
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['orders.create'], request);
        if (permError) return permError;

        if (method === 'POST') {
          const cart = await services.cart.getOrCreateForCustomer(customerId);
          const body = await request.json();
          return jsonResponse(await services.cart.applyDiscount(cart.id, body.code), 200, request);
        }
        if (method === 'DELETE') {
          const cart = await services.cart.getOrCreateForCustomer(customerId);
          return jsonResponse(await services.cart.removeDiscount(cart.id), 200, request);
        }
      }

      // -------------------------------------------------------------
      // 6b. Storefront Public API: Customer Sync & Checkout Orders
      // -------------------------------------------------------------
      if (pathname === '/api/v1/storefront/customers/sync' && method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as any;
        const email = body.email ? String(body.email).trim().toLowerCase() : null;
        const phone = body.phone ? String(body.phone).trim() : null;
        const name = body.name ? String(body.name).trim() : (email ? email.split('@')[0] : 'Customer');
        const customId = body.id && typeof body.id === 'string' && body.id.length >= 20 ? body.id : undefined;

        let customer = null;
        if (customId) {
          customer = await prisma.customer.findUnique({ where: { id: customId } }).catch(() => null);
        }
        if (!customer && email) {
          customer = await prisma.customer.findFirst({ where: { email } }).catch(() => null);
        }
        if (!customer && phone) {
          customer = await prisma.customer.findFirst({ where: { phone } }).catch(() => null);
        }

        if (customer) {
          const updates: any = {};
          if (name && (!customer.name || customer.name === 'Customer')) updates.name = name;
          if (phone && !customer.phone) updates.phone = phone;
          if (email && !customer.email) updates.email = email;
          if (Object.keys(updates).length > 0) {
            customer = await prisma.customer.update({ where: { id: customer.id }, data: updates });
          }
          return jsonResponse(customer, 200, request);
        }

        customer = await prisma.customer.create({
          data: {
            ...(customId ? { id: customId } : {}),
            name: name || 'Customer',
            email: email || null,
            phone: phone || null,
            isGuest: false,
          },
        });
        return jsonResponse(customer, 201, request);
      }

      if (pathname === '/api/v1/storefront/orders' && method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as any;
        let items: any[] = Array.isArray(body.items) ? body.items : [];
        const isCod = body.paymentMethod === 'COD';
        let codAmounts: { subtotal: number; shipping: number; tax: number; total: number } | undefined;
        const codId = typeof body.requestId === 'string' ? body.requestId : '';
        const codReceipt = (order: { id: string; orderNumber: string; total: unknown }) => ({
          id: order.id, orderNumber: order.orderNumber, total: order.total,
        });
        const findCodOrder = () => prisma.order.findFirst({
          where: { id: codId, payments: { some: { provider: 'COD' } } },
          select: { id: true, orderNumber: true, total: true },
        });
        if (isCod) {
          if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(codId)) {
            return jsonResponse({ message: 'Invalid checkout request. Refresh and try again.' }, 400, request);
          }
          const existing = await findCodOrder();
          if (existing) return jsonResponse(codReceipt(existing), 200, request);

          const address = body.shippingAddress;
          const pin = address?.postal_code;
          if (!/^[1-9][0-9]{5}$/.test(pin ?? '') ||
              !/^[0-9]{10}$/.test(String(address?.phone ?? '').replace(/\D/g, '')) ||
              ![address?.name, address?.street_address, address?.city, address?.state].every(value =>
                typeof value === 'string' && value.trim() && value.length <= 250)) {
            return jsonResponse({ message: 'Enter a complete delivery address and phone number for Cash on Delivery.' }, 400, request);
          }
          if (body.discount || body.couponCode || items.length > 100 || items.some(item =>
            !item || typeof item.productId !== 'string' || item.customizationDetails || item.imageUrl ||
            !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100)) {
            return jsonResponse({ message: 'Cash on Delivery is available for catalog items without coupons or custom artwork.' }, 400, request);
          }
          if (items.length) {
            const products = await prisma.product.findMany({
              where: { id: { in: items.map(item => item.productId) }, status: 'ACTIVE', deletedAt: null, productType: { isActive: true } },
              select: { id: true, name: true, basePrice: true, storefront: true },
            });
            const byId = new Map(products.map(product => [product.id, product]));
            if (items.some(item => {
              const product = byId.get(item.productId);
              return !product || Number(product.basePrice) !== Number(item.price) ||
                Number(product.basePrice) <= 0 ||
                (product.storefront as { stockStatus?: string } | null)?.stockStatus === 'Out of Stock';
            })) {
              return jsonResponse({ message: 'An item or price changed. Refresh your cart before placing a Cash on Delivery order.' }, 409, request);
            }
            items = items.map(item => {
              const product = byId.get(item.productId)!;
              return { productId: product.id, title: product.name, price: Number(product.basePrice), quantity: item.quantity,
                imageUrl: (product.storefront as { image?: string } | null)?.image };
            });
            const subtotal = Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
            const shipping = subtotal >= 999 ? 0 : 99;
            codAmounts = { subtotal, shipping, tax: Math.round(subtotal * 0.18), total: subtotal + shipping };
            if (Math.round(Number(body.total) * 100) !== Math.round(codAmounts.total * 100)) {
              return jsonResponse({ message: 'The order total changed. Review your cart and try again.' }, 409, request);
            }
            if (!env.DELHIVERY_API_TOKEN?.trim()) {
              return jsonResponse({ message: 'Cash on Delivery is temporarily unavailable.' }, 503, request);
            }
            const postalCode = await delhiveryPostalCode(pin, env.DELHIVERY_API_TOKEN).catch(() => undefined);
            if (postalCode === undefined) return jsonResponse({ message: 'Could not check Cash on Delivery. Try again or pay online.' }, 503, request);
            if (postalCode?.cod !== 'Y') return jsonResponse({ message: 'Cash on Delivery is unavailable for this PIN code.' }, 422, request);
          }
        }
        if (items.length === 0) {
          return jsonResponse({ statusCode: 400, message: 'Order items are required' }, 400, request);
        }

        const email = body.customerEmail ? String(body.customerEmail).trim().toLowerCase() : null;
        const phone = body.customerPhone ? String(body.customerPhone).trim() : null;
        const name = body.customerName || (body.shippingAddress && body.shippingAddress.name) || (email ? email.split('@')[0] : 'Guest Customer');

        let customer = null;
        if (!isCod && body.customerId) {
          customer = await prisma.customer.findUnique({ where: { id: body.customerId } }).catch(() => null);
        }
        if (!customer && email) {
          customer = await prisma.customer.findFirst({ where: { email } }).catch(() => null);
        }
        if (!customer && phone) {
          customer = await prisma.customer.findFirst({ where: { phone } }).catch(() => null);
        }
        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              ...(!isCod && body.customerId && body.customerId.length >= 20 ? { id: body.customerId } : {}),
              name,
              email: email || null,
              phone: phone || null,
              isGuest: isCod || !body.customerId,
            },
          });
        }

        const mirroredNumber = !isCod && /^CI-\d{8}-\d{4}$/.test(String(body.orderNumber ?? '')) ? String(body.orderNumber) : null;
        if (mirroredNumber) {
          const already = await prisma.order.findUnique({ where: { orderNumber: mirroredNumber }, include: { items: true, addresses: true, customer: true } });
          if (already) return jsonResponse(already, 200, request);
        }
        const orderCount = isCod || mirroredNumber ? 0 : await prisma.order.count();
        const orderNumber = isCod ? `CC-COD-${codId}` : (mirroredNumber ?? `CC${10000 + orderCount + 1}`);

        const subtotal = codAmounts?.subtotal ?? (Number(body.subtotal) || 0);
        let discount = isCod ? 0 : Number(body.discount) || 0;
        // A coupon is re-checked on the server: the discount is what the code is really worth,
        // never just what the browser claims.
        let appliedDiscountId: string | null = null;
        if (!isCod && typeof body.couponCode === 'string' && body.couponCode.trim()) {
          const checked = await services.discounts.validateDiscount({
            code: body.couponCode, subtotal, customerId: customer.id,
          });
          discount = Math.round(Number(checked.discountAmount) * 100) / 100;
          appliedDiscountId = checked.discountId;
        } else if (!isCod && discount > 0) {
          return jsonResponse({ message: 'A discount needs a valid coupon code.' }, 400, request);
        }
        const shippingFee = codAmounts?.shipping ?? (Number(body.shippingFee) || 0);
        const tax = codAmounts?.tax ?? (Number(body.tax) || 0);
        const total = codAmounts?.total ?? (appliedDiscountId
          ? Math.max(0, subtotal - discount + shippingFee)
          : (Number(body.total) || (subtotal - discount + shippingFee + tax)));

        const isFree = !isCod && !!appliedDiscountId && total <= 0;
        if (!isCod && !isFree && total <= 0) {
          return jsonResponse({ message: 'A zero-total order needs a valid coupon.' }, 400, request);
        }
        if (!isCod && !isFree && !mirroredNumber) {
          return jsonResponse({ message: 'A valid storefront order number is required.' }, 400, request);
        }
        const paymentRef = isCod || isFree ? null : body.payment?.razorpayPaymentId;
        if (!isCod && !isFree) {
          await verifyCapturedOrderPayment(env, paymentRef, orderNumber, total);
        }
        const isPaid = !isCod;

        const newOrder = await prisma.$transaction(async (tx) => {
          const order = await tx.order.create({
            data: {
              ...(isCod ? { id: codId } : {}),
              orderNumber,
              customerId: customer.id,
              orderStatus: 'CONFIRMED',
              paymentStatus: isPaid ? 'PAID' : 'PENDING',
              shippingStatus: 'NOT_SHIPPED',
              subtotal,
              discount,
              tax,
              shipping: shippingFee,
              total,
              items: {
                create: items.map((item: any, idx: number) => {
                  const itemTitle = item.title || item.product?.name || `Item ${idx + 1}`;
                  const itemPrice = Number(item.price) || 0;
                  const itemQty = Number(item.quantity) || 1;
                  const custDetails = item.customizationDetails || {};
                  return {
                    productNameSnapshot: itemTitle,
                    variantSnapshot: {
                      sku: item.sku || `PROD-${idx + 1}`,
                      options: [
                        { group: 'Size', value: custDetails.size || custDetails.dimensions || 'Standard' },
                        { group: 'Style', value: custDetails.wrap || custDetails.style || custDetails.frame || 'Standard' },
                      ],
                      imageUrl: item.imageUrl || null,
                    },
                    priceSnapshot: itemPrice,
                    configurationSnapshot: custDetails,
                    designVersionSnapshot: custDetails,
                    taxSnapshot: 0,
                    quantity: itemQty,
                  };
                }),
              },
              addresses: {
                create: [
                  {
                    type: 'SHIPPING',
                    name: (body.shippingAddress && body.shippingAddress.name) || name,
                    line1: (body.shippingAddress && (body.shippingAddress.street_address || body.shippingAddress.line1)) || 'Delivery Address',
                    line2: (body.shippingAddress && (body.shippingAddress.apartment || body.shippingAddress.line2)) || null,
                    city: (body.shippingAddress && body.shippingAddress.city) || 'City',
                    state: (body.shippingAddress && body.shippingAddress.state) || 'State',
                    postalCode: (body.shippingAddress && (body.shippingAddress.postal_code || body.shippingAddress.postalCode)) || '500001',
                    country: (body.shippingAddress && body.shippingAddress.country) || 'IN',
                    phone: (body.shippingAddress && body.shippingAddress.phone) || phone,
                  },
                  {
                    type: 'BILLING',
                    name: (body.shippingAddress && body.shippingAddress.name) || name,
                    line1: (body.shippingAddress && (body.shippingAddress.street_address || body.shippingAddress.line1)) || 'Billing Address',
                    line2: (body.shippingAddress && (body.shippingAddress.apartment || body.shippingAddress.line2)) || null,
                    city: (body.shippingAddress && body.shippingAddress.city) || 'City',
                    state: (body.shippingAddress && body.shippingAddress.state) || 'State',
                    postalCode: (body.shippingAddress && (body.shippingAddress.postal_code || body.shippingAddress.postalCode)) || '500001',
                    country: (body.shippingAddress && body.shippingAddress.country) || 'IN',
                    phone: (body.shippingAddress && body.shippingAddress.phone) || phone,
                  },
                ],
              },
              events: {
                create: [
                  { type: 'order.created', message: `Order ${orderNumber} placed via storefront checkout` },
                  ...(isCod ? [{ type: 'order.cod', message: 'Cash on Delivery · collect payment on delivery' }] : []),
                  ...(isPaid ? [{ type: 'order.paid', message: isFree ? `Order fully covered by coupon ${body.couponCode}` : `Payment verified via Razorpay (${paymentRef})` }] : []),
                ],
              },
              ...(isCod || (isPaid && !isFree) ? {
                payments: {
                  create: [
                    {
                      provider: isCod ? 'COD' : 'RAZORPAY',
                      status: isCod ? 'PENDING' : 'PAID',
                      amount: total,
                      currency: 'INR',
                      providerRef: paymentRef,
                    },
                  ],
                },
              } : {}),
            },
            include: {
              items: true,
              addresses: true,
              customer: true,
            },
          });
          if (appliedDiscountId) {
            await services.discounts.recordRedemption(appliedDiscountId, customer.id, new Prisma.Decimal(discount), order.id, undefined, tx);
          }
          return order;
        }).catch(async error => {
          if (isCod && error?.code === 'P2002') {
            const existing = await findCodOrder();
            if (existing) return existing;
          }
          if (mirroredNumber && error?.code === 'P2002') {
            const existing = await prisma.order.findUnique({ where: { orderNumber: mirroredNumber }, include: { items: true, addresses: true, customer: true } });
            if (existing) return existing;
          }
          throw error;
        });

        // Confirmation only once the order is really confirmed: Cash on Delivery, or payment received.
        if (isCod || (newOrder as { paymentStatus?: string }).paymentStatus === 'PAID') {
          background(Promise.all([sendOrderEmail(prisma, env as OrderEmailEnv, newOrder.id, 'confirmed'), sendOrderEmail(prisma, env as OrderEmailEnv, newOrder.id, 'admin_new')]));
        }
        return jsonResponse(isCod ? codReceipt(newOrder) : newOrder, 201, request);
      }

      if (pathname === '/api/v1/storefront/orders' && method === 'GET') {
        const customerId = query.customerId;
        const email = query.email ? String(query.email).trim().toLowerCase() : undefined;
        let whereClause: any = {};
        if (customerId) {
          whereClause = { customerId };
        } else if (email) {
          const cust = await prisma.customer.findFirst({ where: { email } });
          if (!cust) return jsonResponse([], 200, request);
          whereClause = { customerId: cust.id };
        } else {
          return jsonResponse([], 200, request);
        }
        const orders = await prisma.order.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          include: {
            items: true,
            addresses: true,
            payments: true,
          },
        });
        return jsonResponse(orders, 200, request);
      }

      if (pathname === '/api/v1/orders') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        if (method === 'GET') {
          const permError = checkPermission(user, ['orders.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.orders.findAll(), 200, request);
        }
        if (method === 'POST') {
          const permError = checkPermission(user, ['orders.create'], request);
          if (permError) return permError;
          const body = await request.json();
          return jsonResponse(await services.orders.createFromCart(body.customerId, body.cartId), 201, request);
        }
      }

      const invoiceMatch = pathname.match(/^\/api\/v1\/orders\/([^/]+)\/invoice$/);
      if (invoiceMatch && method === 'GET') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['orders.view'], request);
        if (permError) return permError;
        const invoiceOrder = await prisma.order.findUnique({
          where: { id: invoiceMatch[1] },
          include: { items: true, addresses: true, customer: true, payments: true },
        });
        if (!invoiceOrder) return jsonResponse({ statusCode: 404, message: 'Order not found' }, 404, request);
        return jsonResponse(buildInvoice(invoiceOrder as never, loadBusinessProfile(env)), 200, request);
      }

      const orderMatch = pathname.match(/^\/api\/v1\/orders\/([^/]+)$/);
      if (orderMatch && method === 'GET') {
        const orderId = orderMatch[1];
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['orders.view'], request);
        if (permError) return permError;
        return jsonResponse(await services.orders.findOne(orderId), 200, request);
      }

      if (method === 'GET' && ['/api/v1/admin/orders/catalog', '/api/v1/admin/orders/customers'].includes(pathname)) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permission = pathname.endsWith('/customers') || !user.permissions.includes('orders.edit')
          ? 'orders.create' : 'orders.edit';
        const denied = checkPermission(user, [permission], request);
        if (denied) return denied;
        const entries = pathname.endsWith('/catalog')
          ? await prisma.product.findMany({ where: { status: 'ACTIVE', deletedAt: null },
              select: { id: true, name: true, basePrice: true }, orderBy: { name: 'asc' } })
          : await prisma.customer.findMany({ select: { id: true, name: true, email: true }, orderBy: { name: 'asc' } });
        return jsonResponse(entries, 200, request);
      }

      const orderManagement = pathname.match(/^\/api\/v1\/admin\/orders(?:\/([^/]+)(\/visibility)?)?$/);
      if (orderManagement) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const [, orderId, visibility] = orderManagement;
        const management = new AdminOrders(prisma);
        const denied = checkPermission(user, [orderId ? 'orders.edit' : 'orders.create'], request);
        if (denied) return denied;
        if (!orderId && method === 'POST') {
          return jsonResponse(await management.create(await request.json(), user.id), 201, request);
        }
        if (orderId && !visibility && method === 'PATCH') {
          await management.edit(orderId, await request.json(), user.id);
          return new Response(null, { status: 204, headers: corsHeaders(request) });
        }
        if (orderId && visibility && method === 'PUT') {
          const body = await request.json() as { action?: unknown };
          await management.setVisibility(orderId, body?.action, user.id);
          return new Response(null, { status: 204, headers: corsHeaders(request) });
        }
      }

      const orderActionMatch = pathname.match(/^\/api\/v1\/orders\/([^/]+)\/(accept|cancel|refund)$/);
      if (orderActionMatch && method === 'POST') {
        const [, orderId, action] = orderActionMatch;
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, [action === 'accept' ? 'orders.edit' : action === 'refund' ? 'orders.refund' : 'orders.cancel'], request);
        if (permError) return permError;
        if (action === 'refund') {
          const body = (await request.json().catch(() => ({}))) as { amount?: string; reason?: string };
          return jsonResponse(await services.orders.refund(orderId, String(body.amount ?? ''), body.reason), 200, request);
        }
        const actionResult = action === 'accept' ? await services.orders.accept(orderId, user.id) : await services.orders.cancel(orderId, user.id);
        if (action === 'cancel') background(sendOrderEmail(prisma, env as OrderEmailEnv, orderId, 'cancelled'));
        return jsonResponse(actionResult, 200, request);
      }

      // Storefront: live order status, and customer cancellation (only before production starts).
      if (pathname === '/api/v1/storefront/orders/status' && (method === 'GET' || method === 'POST')) {
        const body = method === 'POST' ? ((await request.json().catch(() => ({}))) as any) : {};
        const orderNumber = String(method === 'POST' ? body.orderNumber ?? '' : query.orderNumber ?? '').trim();
        const email = String(method === 'POST' ? body.email ?? '' : query.email ?? '').trim().toLowerCase();
        if (!orderNumber || !email) return jsonResponse({ message: 'orderNumber and email are required' }, 400, request);
        const order = await prisma.order.findFirst({ where: { orderNumber, customer: { email } } });
        if (!order) return jsonResponse(method === 'GET' ? { found: false } : { message: 'Order not found for this customer' }, method === 'GET' ? 200 : 404, request);
        if (method === 'POST') {
          await services.orders.cancelByCustomer(order.id);
          background(sendOrderEmail(prisma, env as OrderEmailEnv, order.id, 'cancelled'));
          return jsonResponse({ cancelled: true }, 200, request);
        }
        return jsonResponse({
          found: true, orderStatus: order.orderStatus, shippingStatus: order.shippingStatus,
          cancellable: services.orders.isCustomerCancellable(order),
        }, 200, request);
      }

      const orderPaymentsMatch = pathname.match(/^\/api\/v1\/orders\/([^/]+)\/payments$/);
      if (orderPaymentsMatch) {
        const orderId = orderPaymentsMatch[1];
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['finance.view'], request);
        if (permError) return permError;

        if (method === 'GET') return jsonResponse(await services.payments.findByOrder(orderId), 200, request);
        if (method === 'POST') {
          const body = await request.json();
          return jsonResponse(await services.payments.createForOrder(orderId, body.provider, body.amount), 201, request);
        }
      }

      if (pathname === '/api/v1/returns-replacements/returns') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        if (method === 'GET') {
          const permError = checkPermission(user, ['returns.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.returnsReplacements.findReturnRequests(), 200, request);
        }
        if (method === 'POST') {
          const permError = checkPermission(user, ['returns.manage'], request);
          if (permError) return permError;
          return jsonResponse(await services.returnsReplacements.createReturnRequest(await request.json()), 201, request);
        }
      }

      if (pathname === '/api/v1/returns-replacements/replacements') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        if (method === 'GET') {
          const permError = checkPermission(user, ['returns.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.returnsReplacements.findReplacementRequests(), 200, request);
        }
        if (method === 'POST') {
          const permError = checkPermission(user, ['returns.manage'], request);
          if (permError) return permError;
          return jsonResponse(await services.returnsReplacements.createReplacementRequest(await request.json()), 201, request);
        }
      }

      // Per-request admin actions: detail, accept / reject / mark received / refund, delete.
      const aftercareMatch = pathname.match(/^\/api\/v1\/returns-replacements\/(returns|replacements)\/([^/]+)(?:\/([a-z]+))?$/);
      if (aftercareMatch) {
        const [, kind, id, action] = aftercareMatch;
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const svc = services.returnsReplacements;
        if (method === 'GET' && !action) {
          const permError = checkPermission(user, ['returns.view'], request);
          if (permError) return permError;
          return jsonResponse(
            kind === 'returns' ? await svc.findReturnRequestDetail(id) : await svc.findReplacementRequestDetail(id), 200, request);
        }
        const manageError = checkPermission(user, ['returns.manage'], request);
        if (method === 'DELETE' && !action) {
          if (manageError) return manageError;
          return jsonResponse(kind === 'returns' ? await svc.deleteReturn(id) : await svc.deleteReplacement(id), 200, request);
        }
        if (method === 'POST' && action) {
          if (manageError) return manageError;
          const returnActions: Record<string, (id: string) => Promise<unknown>> = {
            approve: (x) => svc.approveReturn(x), reject: (x) => svc.rejectReturn(x),
            returned: (x) => svc.markReturned(x), refund: (x) => svc.refundReturn(x),
          };
          const replacementActions: Record<string, (id: string) => Promise<unknown>> = {
            approve: (x) => svc.approveReplacement(x), reject: (x) => svc.rejectReplacement(x),
            complete: (x) => svc.completeReplacement(x),
          };
          const handler = (kind === 'returns' ? returnActions : replacementActions)[action];
          if (handler) return jsonResponse(await handler(id), 200, request);
        }
      }

      // Public coupon check used by storefront checkout.
      if (pathname === '/api/v1/discounts/validate' && method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as any;
        return jsonResponse(await services.discounts.validateDiscount({
          code: String(body.code ?? ''),
          subtotal: body.subtotal === undefined ? undefined : Number(body.subtotal),
          customerId: typeof body.customerId === 'string' ? body.customerId : undefined,
        }), 200, request);
      }

      // Storefront: a customer looks up their order (by order number + the email on it),
      // files a return (saved immediately, shown to admins) and tracks its status.
      const aftercareStoreMatch = pathname.match(/^\/api\/v1\/storefront\/(returns|replacements)$/);
      if (aftercareStoreMatch && (method === 'GET' || method === 'POST')) {
        const isReturn = aftercareStoreMatch[1] === 'returns';
        const body = method === 'POST' ? ((await request.json().catch(() => ({}))) as any) : {};
        const orderNumber = String(method === 'POST' ? body.orderNumber ?? '' : query.orderNumber ?? '').trim();
        const email = String(method === 'POST' ? body.email ?? '' : query.email ?? '').trim().toLowerCase();
        if (!orderNumber || !email) return jsonResponse({ message: 'orderNumber and email are required' }, 400, request);
        const order = await prisma.order.findFirst({
          where: { orderNumber, customer: { email } },
          include: { items: { select: { id: true, productNameSnapshot: true, quantity: true } } },
        });
        if (method === 'GET') {
          if (!order) return jsonResponse({ found: false }, 200, request);
          const requests = isReturn
            ? await prisma.returnRequest.findMany({
                where: { orderId: order.id }, orderBy: { createdAt: 'desc' },
                select: { id: true, orderItemId: true, reason: true, status: true, createdAt: true },
              })
            : (await prisma.replacementRequest.findMany({
                where: { orderId: order.id }, orderBy: { createdAt: 'desc' },
                select: { id: true, orderItemId: true, complaintReason: true, status: true, createdAt: true },
              })).map((r) => ({ id: r.id, orderItemId: r.orderItemId, reason: r.complaintReason, status: r.status, createdAt: r.createdAt }));
          return jsonResponse({
            found: true, orderId: order.id, delivered: order.shippingStatus === 'DELIVERED',
            items: order.items, returns: requests,
          }, 200, request);
        }
        if (!order) return jsonResponse({ message: 'Order not found for this customer' }, 404, request);
        if (order.shippingStatus !== 'DELIVERED') {
          return jsonResponse({ message: `${isReturn ? 'Returns' : 'Replacements'} can be requested once the order has been delivered.` }, 400, request);
        }
        const orderItemId = String(body.orderItemId ?? '');
        const reason = String(body.reason ?? '');
        return jsonResponse(isReturn
          ? await services.returnsReplacements.createReturnForCustomer(order.customerId, { orderId: order.id, orderItemId, reason })
          : await services.returnsReplacements.createReplacementForCustomer(order.customerId, { orderId: order.id, orderItemId, complaintReason: reason }),
        201, request);
      }

      // -------------------------------------------------------------
      // 7. Users, Roles, Customers
      // -------------------------------------------------------------
      if (pathname === '/api/v1/users') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        if (method === 'GET') {
          const permError = checkPermission(user, ['users.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.users.findAll(), 200, request);
        }
        if (method === 'POST') {
          const permError = checkPermission(user, ['users.manage'], request);
          if (permError) return permError;
          const body = await request.json();
          return jsonResponse(await services.users.create(body.name, body.email, body.password, body.roleId, user.id), 201, request);
        }
      }

      // Deactivating a team member. The Super Admin holds the highest access, and nobody can
      // lock themselves out, so those two cases are refused here, not just hidden in the screen.
      const deactivateUserMatch = pathname.match(/^\/api\/v1\/users\/([^/]+)\/deactivate$/);
      if (deactivateUserMatch && method === 'PATCH') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['users.manage'], request);
        if (permError) return permError;
        const targetId = deactivateUserMatch[1];
        if (targetId === user.id) {
          return jsonResponse({ statusCode: 400, message: 'You cannot deactivate your own account.' }, 400, request);
        }
        const target = await prisma.adminUser.findUnique({ where: { id: targetId }, include: { role: true } });
        if (!target) {
          return jsonResponse({ statusCode: 404, message: 'Team member not found.' }, 404, request);
        }
        if (target.role?.name === 'Super Admin') {
          return jsonResponse({ statusCode: 403, message: 'The Super Admin cannot be deactivated.' }, 403, request);
        }
        return jsonResponse(await services.users.deactivate(targetId, user.id), 200, request);
      }

      if (pathname === '/api/v1/roles') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        if (method === 'GET') {
          const permError = checkPermission(user, ['roles.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.roles.findAll(), 200, request);
        }
        if (method === 'POST') {
          const permError = checkPermission(user, ['roles.manage'], request);
          if (permError) return permError;
          const body = await request.json();
          return jsonResponse(await services.roles.create(body.name, body.description, body.permissionKeys), 201, request);
        }
      }

      if (pathname === '/api/v1/customers') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        if (method === 'GET') {
          const permError = checkPermission(user, ['customers.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.customers.findAll(), 200, request);
        }
        if (method === 'POST') {
          const permError = checkPermission(user, ['customers.create'], request);
          if (permError) return permError;
          return jsonResponse(await services.customers.create(await request.json()), 201, request);
        }
      }

      // -------------------------------------------------------------
      // 8. Production: Jobs, Machines, Materials, Stages, Batches, BOM
      // -------------------------------------------------------------
      if (pathname === '/api/v1/production/jobs') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['production.view'], request);
        if (permError) return permError;
        return jsonResponse(await services.jobs.findAll(), 200, request);
      }

      if (pathname === '/api/v1/production/machines') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        if (method === 'GET') {
          const permError = checkPermission(user, ['machines.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.machines.findAll(), 200, request);
        }
        if (method === 'POST') {
          const permError = checkPermission(user, ['machines.manage'], request);
          if (permError) return permError;
          return jsonResponse(await services.machines.create(await request.json()), 201, request);
        }
      }

      if (pathname === '/api/v1/production/materials') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['materials.view'], request);
        if (permError) return permError;
        return jsonResponse(await services.materials.findAll(), 200, request);
      }

      if (pathname === '/api/v1/production/batches') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['production.view'], request);
        if (permError) return permError;
        return jsonResponse(await services.batches.findAll(), 200, request);
      }

      // -------------------------------------------------------------
      // 9. Shipping & NDR/RTO
      // -------------------------------------------------------------
      // -------------------------------------------------------------
      // Delivery: Delhivery bookings, tracking, labels, pickups, failed-delivery actions
      // -------------------------------------------------------------
      if (pathname === '/api/v1/shipping/webhook/delhivery' && method === 'POST') {
        // Public endpoint for Delhivery's push tracking. Refuses to run unless a shared secret is configured.
        const secret = env.DELHIVERY_WEBHOOK_SECRET?.trim();
        if (!secret) return jsonResponse({ message: 'Webhook is not enabled' }, 503, request);
        const given = (request.headers.get('Authorization') || '').replace(/^Token\s+/i, '').trim() || url.searchParams.get('token') || '';
        if (given !== secret) return jsonResponse({ message: 'Unauthorized' }, 401, request);
        const result = await new WorkerShipping(prisma, env, undefined, (kind, orderId) => background(sendOrderEmail(prisma, env as OrderEmailEnv, orderId, kind))).applyWebhook(await request.json().catch(() => ({})));
        return jsonResponse({ success: true, ...result }, 200, request);
      }
      const shipRoute = pathname.match(/^\/api\/v1\/shipping(?:\/(config|summary|pickups|sync|shipments|test-connection)|\/preview\/([0-9a-fA-F-]{36})|\/([0-9a-fA-F-]{36})(?:\/(refresh|cancel|label|ndr-action|rto-received))?)?$/);
      if (shipRoute) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const [, named, previewOrderId, shipmentId, action] = shipRoute;
        const writes = method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE';
        const perm =
          action === 'cancel' ? 'shipping.cancel'
          : action === 'ndr-action' || action === 'rto-received' ? 'ndr.action'
          : writes ? 'shipping.create'
          : 'shipping.view';
        const denied = checkPermission(user, [perm], request);
        if (denied) return denied;
        const ship = new WorkerShipping(prisma, env, undefined, (kind, orderId) => background(sendOrderEmail(prisma, env as OrderEmailEnv, orderId, kind)));
        if (!named && !previewOrderId && !shipmentId && method === 'GET') return jsonResponse(await ship.list(query), 200, request);
        if (named === 'config' && method === 'GET') return jsonResponse(ship.config(), 200, request);
        if (named === 'summary' && method === 'GET') return jsonResponse(await ship.summary(), 200, request);
        if (named === 'test-connection' && method === 'POST') return jsonResponse(await ship.testConnection(), 200, request);
        if (named === 'pickups' && method === 'GET') return jsonResponse(await ship.recentPickups(), 200, request);
        if (named === 'pickups' && method === 'POST') return jsonResponse(await ship.requestPickup(user.id, await request.json().catch(() => ({}))), 201, request);
        if (named === 'sync' && method === 'POST') return jsonResponse(await ship.syncActive(30), 200, request);
        if (named === 'shipments' && method === 'POST') {
          const body = (await request.json().catch(() => ({}))) as any;
          if (!body.orderId) return jsonResponse({ statusCode: 400, message: 'orderId is required' }, 400, request);
          return jsonResponse(await ship.createForOrder(String(body.orderId), body, user.id), 201, request);
        }
        if (previewOrderId && method === 'GET') return jsonResponse(await ship.preview(previewOrderId), 200, request);
        if (shipmentId && !action && method === 'GET') return jsonResponse(await ship.get(shipmentId), 200, request);
        if (shipmentId && action === 'refresh' && method === 'POST') return jsonResponse(await ship.refresh(shipmentId), 200, request);
        if (shipmentId && action === 'cancel' && method === 'POST') return jsonResponse(await ship.cancel(shipmentId, user.id), 200, request);
        if (shipmentId && action === 'label' && method === 'GET') return jsonResponse(await ship.label(shipmentId), 200, request);
        if (shipmentId && action === 'ndr-action' && method === 'POST') return jsonResponse(await ship.ndrAction(shipmentId, await request.json().catch(() => ({})), user.id), 200, request);
        if (shipmentId && action === 'rto-received' && method === 'POST') return jsonResponse(await ship.markRtoReceived(shipmentId, user.id), 200, request);
      }

      if (pathname === '/api/v1/shipping/ndr') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['ndr.view'], request);
        if (permError) return permError;
        return jsonResponse(await services.ndrRto.findNdrCases(), 200, request);
      }

      // -------------------------------------------------------------
      // 10. Growth: Promotions, Discounts, Segments, Campaigns, Abandoned Carts
      // -------------------------------------------------------------
      if (pathname === '/api/v1/growth/promotions') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        if (method === 'GET') {
          const permError = checkPermission(user, ['promotions.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.promotions.findAll(), 200, request);
        }
        if (method === 'POST') {
          const permError = checkPermission(user, ['promotions.manage'], request);
          if (permError) return permError;
          return jsonResponse(await services.promotions.create(await request.json()), 201, request);
        }
      }

      if (pathname === '/api/v1/growth/discounts') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        if (method === 'GET') {
          const permError = checkPermission(user, ['discounts.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.discounts.findAll(), 200, request);
        }
        if (method === 'POST') {
          const permError = checkPermission(user, ['discounts.manage'], request);
          if (permError) return permError;
          return jsonResponse(await services.discounts.create(await request.json()), 201, request);
        }
      }

      const discountIdMatch = pathname.match(/^\/api\/v1\/growth\/discounts\/([^/]+)$/);
      if (discountIdMatch && (method === 'PATCH' || method === 'DELETE')) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['discounts.manage'], request);
        if (permError) return permError;
        const id = decodeURIComponent(discountIdMatch[1]);
        if (method === 'PATCH') {
          return jsonResponse(await services.discounts.update(id, await request.json()), 200, request);
        }
        await services.discounts.delete(id);
        return jsonResponse({ success: true }, 200, request);
      }

      if (pathname === '/api/v1/growth/segments') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        if (method === 'GET') {
          const permError = checkPermission(user, ['segments.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.customerSegments.findAll(), 200, request);
        }
        if (method === 'POST') {
          const permError = checkPermission(user, ['segments.manage'], request);
          if (permError) return permError;
          return jsonResponse(await services.customerSegments.create(await request.json()), 201, request);
        }
      }

      if (pathname === '/api/v1/growth/campaigns') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        if (method === 'GET') {
          const permError = checkPermission(user, ['campaigns.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.campaigns.findAll(), 200, request);
        }
        if (method === 'POST') {
          const permError = checkPermission(user, ['campaigns.manage'], request);
          if (permError) return permError;
          return jsonResponse(await services.campaigns.create(await request.json()), 201, request);
        }
      }

      if (pathname === '/api/v1/growth/abandoned-carts') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['abandoned_carts.view'], request);
        if (permError) return permError;
        return jsonResponse(await services.abandonedCarts.findAll(), 200, request);
      }

      // -------------------------------------------------------------
      // 11. Analytics (7 business domains)
      // -------------------------------------------------------------
      if (pathname.startsWith('/api/v1/analytics/')) {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['analytics.view'], request);
        if (permError) return permError;

        if (pathname === '/api/v1/analytics/sales') return jsonResponse(await services.analytics.getSalesAnalytics(query), 200, request);
        if (pathname === '/api/v1/analytics/products') return jsonResponse(await services.analytics.getProductAnalytics(query), 200, request);
        if (pathname === '/api/v1/analytics/customers') return jsonResponse(await services.analytics.getCustomerAnalytics(query), 200, request);
        if (pathname === '/api/v1/analytics/production') return jsonResponse(await services.analytics.getProductionAnalytics(query), 200, request);
        if (pathname === '/api/v1/analytics/inventory') return jsonResponse(await services.analytics.getInventoryAnalytics(query), 200, request);
        if (pathname === '/api/v1/analytics/shipping') return jsonResponse(await services.analytics.getShippingAnalytics(query), 200, request);
        if (pathname === '/api/v1/analytics/profitability') return jsonResponse(await services.analytics.getProfitabilityAnalytics(query), 200, request);
      }

      // -------------------------------------------------------------
      // 12. Customization: Designs
      // -------------------------------------------------------------
      const designMatch = pathname.match(/^\/api\/v1\/customization\/designs\/([^/]+)$/);
      if (designMatch) {
        const designId = designMatch[1];
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['designs.view'], request);
        if (permError) return permError;
        return jsonResponse(await services.designs.findOne(designId), 200, request);
      }

      // -------------------------------------------------------------
      // 13. Payments: Razorpay
      // -------------------------------------------------------------
      if (pathname === '/api/v1/payments/razorpay/order' && method === 'POST') {
        const body: any = await request.json().catch(() => ({}));
        const amount = Number(body?.amount);
        if (!amount || amount <= 0) {
          return jsonResponse({ statusCode: 400, message: 'Valid amount is required' }, 400, request);
        }

        if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
          return jsonResponse({ statusCode: 500, message: 'Razorpay credentials are not configured' }, 500, request);
        }
        const keyId = env.RAZORPAY_KEY_ID.trim();
        const keySecret = env.RAZORPAY_KEY_SECRET.trim();
        const auth = btoa(`${keyId}:${keySecret}`);

        try {
          const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              amount: Math.round(amount * 100),
              currency: body?.currency || 'INR',
              receipt: body?.receipt || `CI-${Date.now()}`,
            }),
          });

          const rzpData: any = await rzpRes.json().catch(() => ({}));

          if (!rzpRes.ok) {
            return jsonResponse(
              {
                statusCode: rzpRes.status,
                message: rzpData?.error?.description || 'Razorpay order creation failed',
                error: rzpData?.error?.code || 'PaymentError',
              },
              rzpRes.status,
              request,
            );
          }

          return jsonResponse(
            {
              providerRef: rzpData.id,
              clientSecretOrOrderId: rzpData.id,
            },
            200,
            request,
          );
        } catch (fetchErr: any) {
          return jsonResponse(
            {
              statusCode: 502,
              message: fetchErr?.message || 'Failed to reach Razorpay API',
            },
            502,
            request,
          );
        }
      }

      if (pathname === '/api/v1/payments/razorpay/verify' && method === 'POST') {
        const body: any = await request.json().catch(() => ({}));
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return jsonResponse(
            { statusCode: 400, message: 'Missing payment signature verification parameters' },
            400,
            request,
          );
        }

        if (!env.RAZORPAY_KEY_SECRET) {
          return jsonResponse({ statusCode: 500, message: 'Razorpay credentials are not configured' }, 500, request);
        }
        const keySecret = env.RAZORPAY_KEY_SECRET.trim();
        const generatedSignature = createHmac('sha256', keySecret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex');

        if (generatedSignature !== razorpay_signature) {
          return jsonResponse(
            { statusCode: 400, message: 'Invalid Razorpay payment signature', verified: false },
            400,
            request,
          );
        }

        return jsonResponse(
          {
            verified: true,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
          },
          200,
          request,
        );
      }

      // -------------------------------------------------------------
      // 14. Shipping: Delhivery Express
      // -------------------------------------------------------------
      if (pathname === '/api/v1/shipping/serviceability' && method === 'GET') {
        const pin = (query.pincode || '').trim();
        if (!pin || pin.length !== 6) {
          return jsonResponse({ statusCode: 400, message: 'Valid 6-digit pincode is required' }, 400, request);
        }

        if (!env.DELHIVERY_API_TOKEN) {
          return jsonResponse({ statusCode: 500, message: 'Delhivery credentials are not configured' }, 500, request);
        }
        try {
          const code = await delhiveryPostalCode(pin, env.DELHIVERY_API_TOKEN);

          if (!code) {
            return jsonResponse({
              serviceable: false,
              pincode: pin,
              message: 'Pincode not serviceable via Delhivery',
            }, 200, request);
          }

          return jsonResponse({
            serviceable: true,
            pincode: pin,
            city: code.district || code.city,
            state: code.state_code,
            cod: code.cod === 'Y',
            prepaid: code.pre_paid === 'Y',
            estimatedDays: 3,
            courier: 'Delhivery Express',
          }, 200, request);
        } catch (fetchErr: any) {
          return jsonResponse({
            serviceable: true,
            pincode: pin,
            estimatedDays: 3,
            courier: 'Delhivery Express',
          }, 200, request);
        }
      }

      const trackMatch = pathname.match(/^\/api\/v1\/shipping\/track\/([^/]+)$/);
      if (trackMatch && method === 'GET') {
        const awb = trackMatch[1];
        if (!env.DELHIVERY_API_TOKEN) {
          return jsonResponse({ statusCode: 500, message: 'Delhivery credentials are not configured' }, 500, request);
        }
        const token = env.DELHIVERY_API_TOKEN.trim();

        try {
          const res = await fetch(`https://track.delhivery.com/api/v1/packages/json/?waybill=${awb}`, {
            headers: { Authorization: `Token ${token}`, Accept: 'application/json' },
          });
          const data: any = await res.json().catch(() => ({}));
          const shipment = data?.ShipmentData?.[0]?.Shipment;

          if (!shipment) {
            return jsonResponse({
              success: false,
              awb,
              status: 'MANIFESTED',
              message: 'Shipment created and awaiting pickup scan by Delhivery.',
            }, 200, request);
          }

          return jsonResponse({
            success: true,
            awb,
            status: shipment?.Status?.Status || 'IN_TRANSIT',
            instructions: shipment?.Status?.Instructions || '',
            location: shipment?.Status?.StatusLocation || '',
            expectedDate: shipment?.ExpectedDeliveryDate || null,
            scans: shipment?.Scans || [],
          }, 200, request);
        } catch (err: any) {
          return jsonResponse({
            success: true,
            awb,
            status: 'IN_TRANSIT',
            message: 'In transit with Delhivery Express',
          }, 200, request);
        }
      }

      return jsonResponse({ statusCode: 404, message: `Cannot ${method} ${pathname}`, error: 'Not Found' }, 404, request);
    } catch (err: any) {
      const status = typeof err?.getStatus === 'function' ? err.getStatus() : err?.status
        || (err?.code === 'P2025' ? 404 : isDatabaseUnavailable(err) ? 503 : 500);
      if (status >= 500) {
        console.error('API request failed', { method, pathname, status, code: err?.code, ray: request.headers.get('cf-ray') });
      }
      const message = status >= 500 && env.NODE_ENV !== 'development'
        ? status === 503 ? 'The service is temporarily unavailable. Try again shortly.' : 'The server could not complete the request.'
        : err?.message || 'Internal server error';
      return jsonResponse({ statusCode: status, message, stack: env.NODE_ENV === 'development' ? err?.stack : undefined }, status, request);
    } finally {
      if (requestPrisma) {
        const cleanup = requestPrisma.$disconnect().catch(() => {
          console.warn('Database cleanup failed', { method, pathname, ray: request.headers.get('cf-ray') });
        });
        if (ctx) ctx.waitUntil(cleanup);
        else await cleanup;
      }
    }
  },

  /** Cron: pull Delhivery tracking for active shipments so statuses move on their own. */
  async scheduled(_event: unknown, env: Env, ctx: any): Promise<void> {
    const run = async () => {
      try {
        const { prisma } = await getServices(env);
        const result = await new WorkerShipping(prisma, env, undefined, (kind, orderId) => {
          const task = sendOrderEmail(prisma, env as OrderEmailEnv, orderId, kind);
          if (ctx?.waitUntil) ctx.waitUntil(task);
        }).syncActive(20);
        console.log('delivery sync', JSON.stringify(result));
      } catch (err) {
        console.error('delivery sync failed', err);
      }
    };
    if (ctx?.waitUntil) ctx.waitUntil(run());
    else await run();
  },
};

function isDatabaseUnavailable(error: any) {
  const code = error?.code ?? error?.cause?.code;
  return /^(?:P100[12]|P1017|P2024|08\d{3}|53300|57P0[123]|ECONNRESET|ECONNREFUSED|ETIMEDOUT)$/.test(String(code))
    || /^(?:timeout exceeded when trying to connect|connection terminated(?: unexpectedly)?)$/i.test(String(error?.message));
}
