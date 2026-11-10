import { Controller, Post, Body } from '@nestjs/common';
import { DiscountsService } from './discounts.service.js';
import { ValidateDiscountDto } from './dto/validate-discount.dto.js';

/**
 * Public, unauthenticated: the storefront checkout calls this to validate a
 * coupon code against the real admin-managed Discount records, replacing
 * what used to be a hardcoded CANVAS10/FIRSTPRINT check client-side. Guest
 * checkout is supported — customerId is optional on ValidateDiscountDto,
 * and only customer-segment-restricted discounts actually require it.
 */
@Controller('discounts')
export class DiscountsPublicController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Post('validate')
  validate(@Body() dto: ValidateDiscountDto) {
    return this.discountsService.validateDiscount(dto);
  }
}
