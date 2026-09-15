import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { ReturnsReplacementsModule } from './returns-replacements/returns-replacements.module.js';

@Module({
  imports: [CartModule, OrdersModule, ReturnsReplacementsModule],
  exports: [CartModule, OrdersModule, ReturnsReplacementsModule],
})
export class CommerceModule {}
