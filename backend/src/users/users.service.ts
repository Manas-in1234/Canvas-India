import { Injectable } from '@nestjs/common';
import { hashPassword } from '../common/crypto/password.js';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  findAll() {
    return this.prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        role: { select: { id: true, name: true } },
        createdAt: true,
      },
    });
  }

  async create(name: string, email: string, password: string, roleId: string, actingAdminId?: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new Error(`An admin user with email '${normalizedEmail}' already exists. Please use a different email.`);
    }

    const passwordHash = await hashPassword(password);
    const user = await this.prisma.adminUser.create({
      data: { name: name.trim(), email: normalizedEmail, passwordHash, roleId },
      select: { id: true, name: true, email: true, roleId: true, createdAt: true },
    });

    await this.auditService.record({
      adminUserId: actingAdminId,
      action: 'ADMIN_USER_CREATED',
      entityType: 'AdminUser',
      entityId: user.id,
    });

    return user;
  }

  async deactivate(id: string, actingAdminId?: string) {
    const user = await this.prisma.adminUser.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, isActive: true },
    });

    await this.auditService.record({
      adminUserId: actingAdminId,
      action: 'ADMIN_USER_DEACTIVATED',
      entityType: 'AdminUser',
      entityId: id,
    });

    return user;
  }
}
