import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
    });
  }

  findOne(id: string) {
    return this.prisma.role.findUniqueOrThrow({
      where: { id },
      include: { permissions: { include: { permission: true } } },
    });
  }

  create(name: string, description: string | undefined, permissionKeys: string[]) {
    return this.prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          create: permissionKeys.map((key) => ({
            permission: { connect: { key } },
          })),
        },
      },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async setPermissions(roleId: string, permissionKeys: string[]) {
    await this.prisma.rolePermission.deleteMany({ where: { roleId } });
    return this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          create: permissionKeys.map((key) => ({
            permission: { connect: { key } },
          })),
        },
      },
      include: { permissions: { include: { permission: true } } },
    });
  }

  listPermissions() {
    return this.prisma.permission.findMany({ orderBy: { key: 'asc' } });
  }
}
