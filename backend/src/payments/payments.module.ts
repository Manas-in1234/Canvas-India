import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { PaymentsController } from './payments.controller.js';
import { RazorpayAdapter } from './adapters/razorpay.adapter.js';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, RazorpayAdapter],
  exports: [PaymentsService],
})
export class PaymentsModule {}
