import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service.js';
import type { AuthenticatedUser } from '../types/authenticated-user.js';

interface AccessTokenPayload {
  sub: string;
  iat: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret')!,
    });
  }

  async validate(payload: AccessTokenPayload): Promise<AuthenticatedUser> {
    const adminUser = await this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });

    if (!adminUser || !adminUser.isActive) {
      throw new UnauthorizedException('Account is inactive or no longer exists');
    }

    // Access tokens are otherwise stateless and would keep working for their
    // full lifetime even after a password change — reject any token issued
    // before the account's last update (password change, deactivation, role
    // change, etc.) rather than waiting for it to expire naturally.
    const tokenIssuedAt = payload.iat * 1000;
    if (tokenIssuedAt < adminUser.updatedAt.getTime()) {
      throw new UnauthorizedException('Session invalidated by a recent account change');
    }

    return {
      id: adminUser.id,
      email: adminUser.email,
      roleId: adminUser.roleId,
      roleName: adminUser.role.name,
      permissions: adminUser.role.permissions.map((rp) => rp.permission.key),
    };
  }
}
