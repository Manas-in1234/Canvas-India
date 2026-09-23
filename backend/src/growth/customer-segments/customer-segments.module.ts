import { Module } from '@nestjs/common';
import { CustomerSegmentsService } from './customer-segments.service.js';
import { CustomerSegmentsController } from './customer-segments.controller.js';
import { DatabaseModule } from '../../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomerSegmentsController],
  providers: [CustomerSegmentsService],
  exports: [CustomerSegmentsService],
})
export class CustomerSegmentsModule {}
