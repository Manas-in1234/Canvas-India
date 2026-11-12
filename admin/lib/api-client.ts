const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api/v1'
  : process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export const buildAdminApiUrl = (path: string) => `${API_BASE_URL}${path}`;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * ok: a fresh session was obtained.
 * rejected: the server explicitly refused the stored session (it expired or was revoked).
 * unavailable: the server could not answer (busy, offline) - the session may still be valid.
 */
export type RefreshOutcome = 'ok' | 'rejected' | 'unavailable';

// Set by AuthProvider so the client can read the current access token and
// trigger a refresh without a circular import back into the auth context.
let accessTokenGetter: () => string | null = () => null;
let onUnauthorized: () => void = () => {};

export function configureApiClient(getters: { getAccessToken: () => string | null; onUnauthorized: () => void }) {
  accessTokenGetter = getters.getAccessToken;
  onUnauthorized = getters.onUnauthorized;
}

const TRANSIENT_STATUSES = new Set([502, 503, 504]);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Only requests that are safe to repeat are retried: reads, and the session
 * refresh. A write that fails with a 503 may already have been applied, so
 * repeating it could create a duplicate; those surface the error instead.
 */
function maxAttempts(path: string, method: string | undefined) {
  return (method ?? 'GET') === 'GET' || path === '/auth/refresh' ? 3 : 1;
}

async function fetchWithRetry(path: string, init: RequestInit): Promise<Response> {
  const attempts = maxAttempts(path, init.method);
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(buildAdminApiUrl(path), { ...init, signal: init.signal ?? AbortSignal.timeout(30000) });
      if (!TRANSIENT_STATUSES.has(response.status) || attempt === attempts) return response;
    } catch (err) {
      lastError = err;
      if (attempt === attempts) {
        throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.');
      }
    }
    await sleep(350 * attempt);
  }
  throw lastError instanceof Error ? lastError : new ApiError(0, 'Cannot reach the server.');
}

async function request<T>(path: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const token = accessTokenGetter();

  const response = await fetchWithRetry(path, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const isAuthRequest = path === '/auth/login' || path === '/auth/refresh';
  if (response.status === 401 && !isRetry && !isAuthRequest) {
    // Let the auth layer attempt a silent refresh, then retry once.
    const outcome = await tryRefresh();
    if (outcome === 'ok') {
      return request<T>(path, options, true);
    }
    if (outcome === 'rejected') {
      onUnauthorized();
      throw new ApiError(401, 'Session expired');
    }
    // The server is just busy: keep the session and let the caller try again.
    throw new ApiError(503, 'The server is busy. Please try again in a moment.');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const fallback = TRANSIENT_STATUSES.has(response.status)
      ? 'The server is busy. Please try again in a moment.'
      : response.statusText;
    throw new ApiError(response.status, data?.message ?? fallback);
  }

  return data as T;
}

// Injected by AuthProvider to avoid a circular import; performs the actual
// refresh-token exchange and updates stored tokens on success.
let refreshFn: () => Promise<RefreshOutcome> = async () => 'rejected';
export function setRefreshHandler(fn: () => Promise<RefreshOutcome>) {
  refreshFn = fn;
}
async function tryRefresh(): Promise<RefreshOutcome> {
  return refreshFn();
}

export const apiClient = {
  upload: <T>(path: string, body: FormData) => request<T>(path, { method: 'POST', body }),
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
