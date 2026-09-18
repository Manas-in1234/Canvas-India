'use client';

import { useAuth } from './auth-context';

/**
 * Mirrors the backend's PermissionsGuard AND-semantics exactly (see
 * backend/src/common/guards/permissions.guard.ts) — every listed permission
 * must be present, not just one.
 */
export function usePermission() {
  const { user } = useAuth();

  const hasAllPermissions = (keys: string[]): boolean => {
    if (!user) return false;
    return keys.every((key) => user.permissions.includes(key));
  };

  const hasPermission = (key: string): boolean => hasAllPermissions([key]);

  return { hasPermission, hasAllPermissions };
}
