import { Module } from '@nestjs/common';
import { StorefrontService } from './storefront.service.js';
import { StorefrontController } from './storefront.controller.js';
import { StorefrontCustomerGuard } from './storefront-customer.guard.js';
import { CartModule } from '../commerce/cart/cart.module.js';
import { OrdersModule } from '../commerce/orders/orders.module.js';

@Module({
  imports: [CartModule, OrdersModule],
  controllers: [StorefrontController],
  providers: [StorefrontService, StorefrontCustomerGuard],
})
export class StorefrontModule {}
