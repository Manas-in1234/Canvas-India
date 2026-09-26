import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { PaymentsService } from './payments.service.js';
import { RazorpayAdapter } from './adapters/razorpay.adapter.js';
import { CreateRazorpayOrderDto } from './dto-create-razorpay-order.js';
import { VerifyRazorpayPaymentDto } from './dto-verify-razorpay-payment.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../common/guards/permissions.guard.js';
import { RequirePermissions } from '../common/decorators/permissions.decorator.js';

@Controller('payments')
export class RazorpayPaymentsController {
  constructor(
    private readonly razorpayAdapter: RazorpayAdapter,
  ) {}

  @Post('razorpay/order')
  createRazorpayOrder(
    @Body() dto: CreateRazorpayOrderDto,
  ) {
    return this.razorpayAdapter.createPaymentIntent(
      dto.amount,
      dto.currency ?? 'INR',
      dto.receipt ?? `CI-${Date.now()}`,
    );
  }

  @Post('razorpay/verify')
  verifyRazorpayPayment(
    @Body() dto: VerifyRazorpayPaymentDto,
  ) {
    const verified =
      this.razorpayAdapter.verifyPaymentSignature(
        dto.razorpay_order_id,
        dto.razorpay_payment_id,
        dto.razorpay_signature,
      );

    if (!verified) {
      throw new BadRequestException(
        'Invalid Razorpay payment signature',
      );
    }

    return {
      verified: true,
      razorpayOrderId: dto.razorpay_order_id,
      razorpayPaymentId: dto.razorpay_payment_id,
    };
  }
}

@Controller('orders/:orderId/payments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get()
  @RequirePermissions('finance.view')
  findByOrder(
    @Param('orderId') orderId: string,
  ) {
    return this.paymentsService.findByOrder(orderId);
  }
}
