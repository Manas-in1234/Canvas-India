import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service.js';
import { DiscountsController } from './discounts.controller.js';
import { DatabaseModule } from '../../database/database.module.js';
import { CustomerSegmentsModule } from '../customer-segments/customer-segments.module.js';

@Module({
  imports: [DatabaseModule, CustomerSegmentsModule],
  controllers: [DiscountsController],
  providers: [DiscountsService],
  exports: [DiscountsService],
})
export class DiscountsModule {}
