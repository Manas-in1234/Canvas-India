import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Customer } from '../generated/prisma/client.js';

export const CurrentStorefrontCustomer = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Customer => {
    const request = ctx.switchToHttp().getRequest();
    return request.storefrontCustomer;
  },
);
