import { Module } from '@nestjs/common';
import { AbandonedCartsService } from './abandoned-carts.service.js';
import { AbandonedCartsController } from './abandoned-carts.controller.js';
import { DatabaseModule } from '../../database/database.module.js';
import { DiscountsModule } from '../discounts/discounts.module.js';

@Module({
  imports: [DatabaseModule, DiscountsModule],
  controllers: [AbandonedCartsController],
  providers: [AbandonedCartsService],
  exports: [AbandonedCartsService],
})
export class AbandonedCartsModule {}
