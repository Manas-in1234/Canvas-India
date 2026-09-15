import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { CartModule } from '../cart/cart.module.js';
import { InventoryModule } from '../../inventory/inventory.module.js';
import { DiscountsModule } from '../../growth/discounts/discounts.module.js';
import { AbandonedCartsModule } from '../../growth/abandoned-carts/abandoned-carts.module.js';

@Module({
  imports: [CartModule, InventoryModule, DiscountsModule, AbandonedCartsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
