import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { AuthenticatedUser } from './types/authenticated-user.js';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
  ) {}

  async login(email: string, password: string, userAgent?: string, ipAddress?: string): Promise<LoginResult> {
    const adminUser = await this.prisma.adminUser.findUnique({
      where: { email },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });

    if (!adminUser || !adminUser.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await argon2.verify(adminUser.passwordHash, password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.signAccessToken(adminUser.id);
    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = await argon2.hash(refreshToken);

    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn')!;
    await this.prisma.session.create({
      data: {
        adminUserId: adminUser.id,
        refreshTokenHash,
        userAgent,
        ipAddress,
        expiresAt: this.addDuration(new Date(), refreshExpiresIn),
      },
    });

    await this.auditService.record({
      adminUserId: adminUser.id,
      action: 'LOGIN',
      entityType: 'AdminUser',
      entityId: adminUser.id,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        roleId: adminUser.roleId,
        roleName: adminUser.role.name,
        permissions: adminUser.role.permissions.map((rp) => rp.permission.key),
      },
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const candidates = await this.prisma.session.findMany({
      where: { revokedAt: null, expiresAt: { gt: new Date() } },
    });

    let matchedSession: (typeof candidates)[number] | undefined;
    for (const session of candidates) {
      if (await argon2.verify(session.refreshTokenHash, refreshToken)) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Rotate: revoke the used token and issue a new one.
    await this.prisma.session.update({
      where: { id: matchedSession.id },
      data: { revokedAt: new Date() },
    });

    const newRefreshToken = this.generateRefreshToken();
    const refreshTokenHash = await argon2.hash(newRefreshToken);
    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn')!;

    await this.prisma.session.create({
      data: {
        adminUserId: matchedSession.adminUserId,
        refreshTokenHash,
        expiresAt: this.addDuration(new Date(), refreshExpiresIn),
      },
    });

    const accessToken = await this.signAccessToken(matchedSession.adminUserId);
    return { accessToken, refreshToken: newRefreshToken };
  }

  /**
   * Changes the caller's own password. Requires the current password (not
   * just a valid access token) so a hijacked-but-not-yet-expired session
   * can't silently lock the real owner out. Revokes every other session on
   * success — a password change should invalidate tokens issued under the
   * old credential, not just future logins.
   */
  async changePassword(adminUserId: string, currentPassword: string, newPassword: string): Promise<void> {
    const adminUser = await this.prisma.adminUser.findUniqueOrThrow({ where: { id: adminUserId } });

    const currentValid = await argon2.verify(adminUser.passwordHash, currentPassword);
    if (!currentValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const newPasswordHash = await argon2.hash(newPassword);

    await this.prisma.adminUser.update({
      where: { id: adminUserId },
      data: { passwordHash: newPasswordHash },
    });

    await this.prisma.session.updateMany({
      where: { adminUserId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await this.auditService.record({
      adminUserId,
      action: 'PASSWORD_CHANGE',
      entityType: 'AdminUser',
      entityId: adminUserId,
    });
  }

  async logout(refreshToken: string): Promise<void> {
    const candidates = await this.prisma.session.findMany({
      where: { revokedAt: null },
    });

    for (const session of candidates) {
      if (await argon2.verify(session.refreshTokenHash, refreshToken)) {
        await this.prisma.session.update({
          where: { id: session.id },
          data: { revokedAt: new Date() },
        });
        return;
      }
    }
  }

  private async signAccessToken(adminUserId: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: adminUserId },
      {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get<string>('jwt.accessExpiresIn') as `${number}${'s' | 'm' | 'h' | 'd'}`,
      },
    );
  }

  private generateRefreshToken(): string {
    return randomBytes(48).toString('hex');
  }

  private addDuration(base: Date, duration: string): Date {
    const match = /^(\d+)([smhd])$/.exec(duration);
    if (!match) {
      throw new Error(`Invalid duration format: ${duration}`);
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multiplier = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit]!;
    return new Date(base.getTime() + value * multiplier);
  }
}
