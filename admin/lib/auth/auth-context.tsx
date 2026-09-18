'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, configureApiClient, setRefreshHandler, ApiError } from '../api-client';
import type { AuthenticatedUser, LoginResponse, RefreshResponse } from '../types/auth';

const REFRESH_TOKEN_KEY = 'canvaschamp_admin_refresh_token';

interface AuthContextValue {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessTokenRef = useRef<string | null>(null);
  const router = useRouter();

  const clearSession = useCallback(() => {
    accessTokenRef.current = null;
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, []);

  const refresh = useCallback(async (): Promise<boolean> => {
    const storedRefreshToken = typeof window !== 'undefined' ? window.localStorage.getItem(REFRESH_TOKEN_KEY) : null;
    if (!storedRefreshToken) return false;

    try {
      const result = await apiClient.post<RefreshResponse>('/auth/refresh', {
        refreshToken: storedRefreshToken,
      });
      accessTokenRef.current = result.accessToken;
      window.localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
      return true;
    } catch {
      clearSession();
      return false;
    }
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

  // On first load, try to rehydrate the session from a stored refresh token.
  useEffect(() => {
    (async () => {
      const refreshed = await refresh();
      if (refreshed) {
        try {
          const me = await apiClient.get<AuthenticatedUser>('/auth/me');
          setUser(me);
        } catch {
          clearSession();
        }
      }
      setIsLoading(false);
    })();
    // Intentionally run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    accessTokenRef.current = result.accessToken;
    window.localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
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

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export { ApiError };
