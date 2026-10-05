import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import { getQueryCompilerWasm } from './common/prisma-wasm/wasm-loader.js';
import { createServicesContainer, ServicesContainer } from './common/services-container.js';
import { hashPassword, verifyPassword, sha256Hex } from './common/crypto/password.js';
import { randomBytes, createHmac } from 'node:crypto';

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
          return jsonResponse(await services.products.findAll(), 200, request);
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
          return jsonResponse(await services.products.findOne(id), 200, request);
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
        if (method === 'GET') return jsonResponse(await services.productTypes.findAll(), 200, request);
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

        const keyId = (env.RAZORPAY_KEY_ID || 'rzp_live_TecyaExpRewIqU').trim();
        const keySecret = (env.RAZORPAY_KEY_SECRET || '3TloecMTBNgL4883iMCDlAjC').trim();
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

        const keySecret = (env.RAZORPAY_KEY_SECRET || '3TloecMTBNgL4883iMCDlAjC').trim();
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

      return jsonResponse({ statusCode: 404, message: `Cannot ${method} ${pathname}`, error: 'Not Found' }, 404, request);
    } catch (err: any) {
      console.error('API Error Stack:', err?.stack || err);
      const status = typeof err?.getStatus === 'function' ? err.getStatus() : err?.status || 500;
      const message = err?.message || 'Internal server error';
      return jsonResponse({ statusCode: status, message, stack: env.NODE_ENV === 'development' ? err?.stack : undefined }, status, request);
    }
  },
};
