import { Module } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { CartController } from './cart.controller.js';
import { PricingModule } from '../../catalog/pricing/pricing.module.js';
import { DiscountsModule } from '../../growth/discounts/discounts.module.js';

@Module({
  imports: [PricingModule, DiscountsModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
