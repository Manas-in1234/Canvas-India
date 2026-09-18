import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

/**
 * Resolves the guest customer identified by the X-Customer-Token header
 * (issued by POST /storefront/session) — no admin JWT involved. This is the
 * only identity mechanism storefront endpoints use, deliberately separate
 * from the admin JwtAuthGuard used everywhere else in this API.
 */
@Injectable()
export class StorefrontCustomerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-customer-token'];

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Missing X-Customer-Token header');
    }

    const customer = await this.prisma.customer.findFirst({
      where: { guestToken: token, deletedAt: null },
    });

    if (!customer) {
      throw new UnauthorizedException('Invalid or expired customer session');
    }

    request.storefrontCustomer = customer;
    return true;
  }
}
