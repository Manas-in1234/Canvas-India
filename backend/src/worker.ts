import { HomepagePromotions } from './catalog/homepage-promotions.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import { getQueryCompilerWasm } from './common/prisma-wasm/wasm-loader.js';
import { createServicesContainer, ServicesContainer } from './common/services-container.js';
import { hashPassword, verifyPassword, sha256Hex } from './common/crypto/password.js';
import { randomBytes, createHmac } from 'node:crypto';
import { WorkerShapes } from './customization/shapes/worker-shapes.js';
import { resolveAdminRead } from './common/admin-read-routes.js';
import { HeroImages } from './catalog/hero-images.js';
import { HERO_IMAGE_SLOTS, isHeroImageSlot } from './catalog/hero-image-slots.js';

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
}

let cachedWasmModule: any = null;

async function getServices(env: Env): Promise<{ prisma: PrismaClient; services: ServicesContainer }> {
  if ((env as any)._services && (env as any)._prisma) {
    return { prisma: (env as any)._prisma, services: (env as any)._services };
  }
  const connectionString = env.HYPERDRIVE?.connectionString || env.DATABASE_URL;
  const adapter = new PrismaPg({ connectionString });
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
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, '') || '/';
    const method = request.method;
    const query = Object.fromEntries(url.searchParams.entries());

    const { prisma, services } = await getServices(env);

    try {
      if (pathname === '/api/v1/homepage-promotions' && method === 'GET') {
        return jsonResponse(await new HomepagePromotions(prisma).storefront(), 200, request);
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
        const permission = upload ? 'shapes.create' : review && method === 'POST'
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
            const categories = await prisma.optionCategory.findMany({
              orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
              include: { items: { orderBy: { sortOrder: 'asc' } } },
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
        const isManage = method === 'PATCH';
        const denied = checkPermission(user, [isManage ? 'pricing.manage' : 'pricing.view'], request);
        if (denied) return denied;

        try {
          if (method === 'GET' && pathname === '/api/v1/admin/pricing-settings') {
            const settings = await prisma.pricingSetting.findMany({ orderBy: { key: 'asc' } });
            return jsonResponse(settings, 200, request);
          }
          const keyMatch = pathname.match(/^\/api\/v1\/admin\/pricing-settings\/([^/]+)$/);
          if (keyMatch && method === 'PATCH') {
            const body = (await request.json()) as any;
            if ((typeof body.value !== 'string' && typeof body.value !== 'number') || String(body.value).trim() === '' || !Number.isFinite(Number(body.value)) || Number(body.value) < 0) {
              return jsonResponse({ message: 'Rate must be a non-negative number' }, 400, request);
            }
            const key = keyMatch[1];
            const data = { value: String(body.value), updatedBy: user.id };
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

        const tokenHash = await sha256Hex(refreshToken);
        const matchedSession = await prisma.session.findFirst({
          where: { refreshTokenHash: tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
        });

        if (!matchedSession) {
          return jsonResponse({ statusCode: 401, message: 'Invalid or expired refresh token' }, 401, request);
        }

        await prisma.session.update({ where: { id: matchedSession.id }, data: { revokedAt: new Date() } });

        const newRefreshToken = randomBytes(48).toString('hex');
        const newRefreshTokenHash = await sha256Hex(newRefreshToken);
        await prisma.session.create({
          data: {
            adminUserId: matchedSession.adminUserId,
            refreshTokenHash: newRefreshTokenHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });

        const accessToken = await signJwt({ sub: matchedSession.adminUserId }, env.JWT_ACCESS_SECRET || 'change-me', 15 * 60);
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
            return jsonResponse(await services.products.findAll(true), 200, request);
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
          const body = await request.json();
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

        const orderCount = isCod ? 0 : await prisma.order.count();
        const orderNumber = isCod ? `CC-COD-${codId}` : `CC${10000 + orderCount + 1}`;

        const subtotal = codAmounts?.subtotal ?? (Number(body.subtotal) || 0);
        const discount = isCod ? 0 : Number(body.discount) || 0;
        const shippingFee = codAmounts?.shipping ?? (Number(body.shippingFee) || 0);
        const tax = codAmounts?.tax ?? (Number(body.tax) || 0);
        const total = codAmounts?.total ?? (Number(body.total) || (subtotal - discount + shippingFee + tax));

        const isPaid = !isCod && (body.payment?.status === 'captured' || Boolean(body.payment?.razorpayPaymentId));

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
                  ...(isPaid ? [{ type: 'order.paid', message: `Payment verified via Razorpay (${body.payment?.razorpayPaymentId || 'PAID'})` }] : []),
                ],
              },
              ...(isCod || isPaid ? {
                payments: {
                  create: [
                    {
                      provider: isCod ? 'COD' : 'RAZORPAY',
                      status: isCod ? 'PENDING' : 'PAID',
                      amount: total,
                      currency: 'INR',
                      providerRef: isCod ? null : body.payment?.razorpayPaymentId || null,
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
          return order;
        }).catch(async error => {
          if (isCod && error?.code === 'P2002') {
            const existing = await findCodOrder();
            if (existing) return existing;
          }
          throw error;
        });

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

      const storefrontPaymentMatch = pathname.match(/^\/api\/v1\/storefront\/orders\/([^/]+)\/payment$/);
      if (storefrontPaymentMatch && method === 'POST') {
        const orderId = storefrontPaymentMatch[1];
        const body = (await request.json().catch(() => ({}))) as any;
        const status = body.status === 'captured' ? 'PAID' : (body.status === 'failed' ? 'FAILED' : 'PENDING');

        await prisma.payment.create({
          data: {
            orderId,
            provider: 'RAZORPAY',
            status: status as any,
            amount: Number(body.amount) || 0,
            currency: body.currency || 'INR',
            providerRef: body.razorpayPaymentId || null,
          },
        }).catch(() => null);

        if (status === 'PAID') {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: 'PAID',
              orderStatus: 'CONFIRMED',
            },
          }).catch(() => null);

          await prisma.orderEvent.create({
            data: {
              orderId,
              type: 'order.paid',
              message: `Payment confirmed via Razorpay: ${body.razorpayPaymentId || 'PAID'}`,
            },
          }).catch(() => null);
        }

        return jsonResponse({ success: true }, 200, request);
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

      const orderMatch = pathname.match(/^\/api\/v1\/orders\/([^/]+)$/);
      if (orderMatch) {
        const orderId = orderMatch[1];
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        const permError = checkPermission(user, ['orders.view'], request);
        if (permError) return permError;
        return jsonResponse(await services.orders.findOne(orderId), 200, request);
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
      if (pathname === '/api/v1/shipping') {
        const { user, error } = await authenticate(request, env, prisma);
        if (error) return error;
        if (method === 'GET') {
          const permError = checkPermission(user, ['shipping.view'], request);
          if (permError) return permError;
          return jsonResponse(await services.shipping.findAll(), 200, request);
        }
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
      console.error('API Error Stack:', err?.stack || err);
      const status = typeof err?.getStatus === 'function' ? err.getStatus() : err?.status || (err?.code === 'P2025' ? 404 : 500);
      const message = err?.message || 'Internal server error';
      return jsonResponse({ statusCode: status, message, stack: env.NODE_ENV === 'development' ? err?.stack : undefined }, status, request);
    }
  },
};
