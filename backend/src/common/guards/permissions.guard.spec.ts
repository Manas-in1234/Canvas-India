import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard.js';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.js';

function buildContext(user?: AuthenticatedUser): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext;
}

describe('PermissionsGuard', () => {
  const baseUser: AuthenticatedUser = {
    id: 'admin-1',
    email: 'admin@canvaschamp.in',
    roleId: 'role-1',
    roleName: 'Order Manager',
    permissions: ['orders.view', 'orders.create'],
  };

  it('allows the request when no permissions are required', () => {
    const reflector = { getAllAndOverride: () => undefined } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);
    expect(guard.canActivate(buildContext(baseUser))).toBe(true);
  });

  it('allows the request when the user has every required permission', () => {
    const reflector = { getAllAndOverride: () => ['orders.view'] } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);
    expect(guard.canActivate(buildContext(baseUser))).toBe(true);
  });

  it('rejects when the user is missing a required permission', () => {
    const reflector = { getAllAndOverride: () => ['orders.refund'] } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);
    expect(() => guard.canActivate(buildContext(baseUser))).toThrow(ForbiddenException);
  });

  it('rejects when multiple permissions are required and only some are present', () => {
    const reflector = { getAllAndOverride: () => ['orders.view', 'orders.refund'] } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);
    expect(() => guard.canActivate(buildContext(baseUser))).toThrow(ForbiddenException);
  });

  it('rejects when there is no authenticated user at all', () => {
    const reflector = { getAllAndOverride: () => ['orders.view'] } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);
    expect(() => guard.canActivate(buildContext(undefined))).toThrow(ForbiddenException);
  });
});
