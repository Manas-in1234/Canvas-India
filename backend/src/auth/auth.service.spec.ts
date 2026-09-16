import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service.js';
import type { PrismaService } from '../database/prisma.service.js';
import type { JwtService } from '@nestjs/jwt';
import type { ConfigService } from '@nestjs/config';
import type { AuditService } from '../audit/audit.service.js';

const TEST_PASSWORD = 'ChangeMe123!';

async function buildAdminUser(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'admin-1',
    email: 'admin@canvaschamp.in',
    isActive: true,
    roleId: 'role-1',
    passwordHash: await argon2.hash(TEST_PASSWORD),
    role: {
      id: 'role-1',
      name: 'Super Admin',
      permissions: [
        { permission: { key: 'orders.view' } },
        { permission: { key: 'orders.cancel' } },
      ],
    },
    ...overrides,
  };
}

function buildDeps(adminUser: Awaited<ReturnType<typeof buildAdminUser>> | null) {
  const prisma = {
    adminUser: { findUnique: vi.fn().mockResolvedValue(adminUser) },
    session: { create: vi.fn().mockResolvedValue({}) },
  } as unknown as PrismaService;

  const jwtService = {
    signAsync: vi.fn().mockResolvedValue('signed-access-token'),
  } as unknown as JwtService;

  const configService = {
    get: vi.fn((key: string) => {
      const values: Record<string, string> = {
        'jwt.accessSecret': 'secret',
        'jwt.accessExpiresIn': '15m',
        'jwt.refreshSecret': 'secret',
        'jwt.refreshExpiresIn': '7d',
      };
      return values[key];
    }),
  } as unknown as ConfigService;

  const auditService = {
    record: vi.fn().mockResolvedValue(undefined),
  } as unknown as AuditService;

  return { prisma, jwtService, configService, auditService };
}

describe('AuthService.login', () => {
  it('returns the user object with a flat permissions array and roleId (scope: admin-app auth contract)', async () => {
    const adminUser = await buildAdminUser();
    const { prisma, jwtService, configService, auditService } = buildDeps(adminUser);

    const service = new AuthService(prisma, jwtService, configService, auditService);
    const result = await service.login('admin@canvaschamp.in', TEST_PASSWORD);

    expect(result.user).toEqual({
      id: 'admin-1',
      email: 'admin@canvaschamp.in',
      roleId: 'role-1',
      roleName: 'Super Admin',
      permissions: ['orders.view', 'orders.cancel'],
    });
    expect(result.accessToken).toBe('signed-access-token');
    expect(typeof result.refreshToken).toBe('string');
  });

  it('rejects an inactive admin user', async () => {
    const adminUser = await buildAdminUser({ isActive: false });
    const { prisma, jwtService, configService, auditService } = buildDeps(adminUser);

    const service = new AuthService(prisma, jwtService, configService, auditService);
    await expect(service.login('admin@canvaschamp.in', TEST_PASSWORD)).rejects.toThrow(UnauthorizedException);
  });

  it('rejects an unknown email', async () => {
    const { prisma, jwtService, configService, auditService } = buildDeps(null);

    const service = new AuthService(prisma, jwtService, configService, auditService);
    await expect(service.login('missing@canvaschamp.in', 'whatever123')).rejects.toThrow(UnauthorizedException);
  });
});
