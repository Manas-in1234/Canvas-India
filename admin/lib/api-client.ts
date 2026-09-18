const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Set by AuthProvider so the client can read the current access token and
// trigger a refresh without a circular import back into the auth context.
let accessTokenGetter: () => string | null = () => null;
let onUnauthorized: () => void = () => {};

export function configureApiClient(getters: { getAccessToken: () => string | null; onUnauthorized: () => void }) {
  accessTokenGetter = getters.getAccessToken;
  onUnauthorized = getters.onUnauthorized;
}

async function request<T>(path: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const token = accessTokenGetter();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401 && !isRetry) {
    // Let the auth layer attempt a silent refresh, then retry once.
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request<T>(path, options, true);
    }
    onUnauthorized();
    throw new ApiError(401, 'Session expired');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? response.statusText);
  }

  return data as T;
}

// Injected by AuthProvider to avoid a circular import; performs the actual
// refresh-token exchange and updates stored tokens on success.
let refreshFn: () => Promise<boolean> = async () => false;
export function setRefreshHandler(fn: () => Promise<boolean>) {
  refreshFn = fn;
}
async function tryRefresh(): Promise<boolean> {
  return refreshFn();
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
