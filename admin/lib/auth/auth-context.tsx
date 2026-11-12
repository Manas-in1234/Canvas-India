'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, configureApiClient, setRefreshHandler, ApiError, type RefreshOutcome } from '../api-client';
import type { AuthenticatedUser, LoginResponse, RefreshResponse } from '../types/auth';

const REFRESH_TOKEN_KEY = 'canvaschamp_admin_refresh_token';

// How many times to try to restore a saved session on page load before telling
// the user the server cannot be reached (it never sends them to the login page).
const RESTORE_ATTEMPTS = 4;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface AuthContextValue {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  /** True when a saved session exists but the server could not be reached to confirm it. */
  serverUnavailable: boolean;
  retrySession: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverUnavailable, setServerUnavailable] = useState(false);
  const accessTokenRef = useRef<string | null>(null);
  const refreshInFlight = useRef<Promise<RefreshOutcome> | null>(null);
  const router = useRouter();

  const clearSession = useCallback(() => {
    accessTokenRef.current = null;
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, []);

  // Refresh tokens rotate: a second refresh made with the same token while the
  // first is still running would be refused and log the user out. Every caller
  // therefore shares a single in-flight exchange.
  const refresh = useCallback((): Promise<RefreshOutcome> => {
    if (refreshInFlight.current) return refreshInFlight.current;

    const run = async (): Promise<RefreshOutcome> => {
      const storedRefreshToken = typeof window !== 'undefined' ? window.localStorage.getItem(REFRESH_TOKEN_KEY) : null;
      if (!storedRefreshToken) return 'rejected';

      try {
        const result = await apiClient.post<RefreshResponse>('/auth/refresh', {
          refreshToken: storedRefreshToken,
        });
        accessTokenRef.current = result.accessToken;
        window.localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
        return 'ok';
      } catch (err) {
        // Only an explicit refusal ends the session. A busy server, a dropped
        // connection or a timeout says nothing about whether the login is still
        // valid, so the saved token is kept.
        if (err instanceof ApiError && (err.status === 401 || err.status === 400 || err.status === 403)) {
          clearSession();
          return 'rejected';
        }
        return 'unavailable';
      }
    };

    const exchange = async (): Promise<RefreshOutcome> => navigator.locks
      ? await navigator.locks.request(REFRESH_TOKEN_KEY, run)
      : run();
    const promise = exchange().finally(() => {
      refreshInFlight.current = null;
    });
    refreshInFlight.current = promise;
    return promise;
  }, [clearSession]);

  // Wire the API client to this context once, on mount.
  useEffect(() => {
    configureApiClient({
      getAccessToken: () => accessTokenRef.current,
      onUnauthorized: () => {
        clearSession();
        router.replace('/login');
      },
    });
    setRefreshHandler(refresh);
  }, [clearSession, refresh, router]);

  const restoreSession = useCallback(async () => {
    setServerUnavailable(false);
    setIsLoading(true);

    let outcome: RefreshOutcome = 'unavailable';
    for (let attempt = 0; attempt < RESTORE_ATTEMPTS && outcome === 'unavailable'; attempt++) {
      if (attempt > 0) await sleep(1200 * attempt);
      outcome = await refresh();
    }

    if (outcome === 'ok') {
      try {
        setUser(await apiClient.get<AuthenticatedUser>('/auth/me'));
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearSession();
        } else {
          setServerUnavailable(true);
        }
      }
    } else if (outcome === 'unavailable') {
      setServerUnavailable(true);
    }

    setIsLoading(false);
  }, [clearSession, refresh]);

  // On first load, try to rehydrate the session from a stored refresh token.
  useEffect(() => {
    void restoreSession();
    // Intentionally run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!serverUnavailable) return;
    const reconnect = () => { void restoreSession(); };
    window.addEventListener('online', reconnect);
    return () => window.removeEventListener('online', reconnect);
  }, [serverUnavailable, restoreSession]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    accessTokenRef.current = result.accessToken;
    window.localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
    setServerUnavailable(false);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    const storedRefreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    if (storedRefreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken: storedRefreshToken });
      } catch {
        // Ignore — we clear local session regardless.
      }
    }
    clearSession();
    router.replace('/login');
  }, [clearSession, router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, serverUnavailable, retrySession: () => void restoreSession(), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export { ApiError };
