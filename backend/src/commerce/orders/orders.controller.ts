import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { RefundOrderDto } from './dto/refund-order.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.js';

@Controller('orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @RequirePermissions('orders.view')
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @RequirePermissions('orders.view')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @RequirePermissions('orders.create')
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createFromCart(dto.customerId, dto.cartId);
  }

  @Post(':id/cancel')
  @RequirePermissions('orders.cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.cancel(id, user.id);
  }

  // Refund requires a live payment gateway adapter (scope §46-48), which is
  // deferred until gateway credentials are provisioned — see payments/adapters.
  @Post(':id/refund')
  @RequirePermissions('orders.refund')
  refund(@Param('id') id: string, @Body() dto: RefundOrderDto) {
    return this.ordersService.refund(id, dto.amount, dto.reason);
  }
}

