import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AbandonedCartsService } from './abandoned-carts.service.js';
import { DetectAbandonedCartsDto } from './dto/detect-abandoned-carts.dto.js';
import { SendRecoveryNotificationDto } from './dto/send-recovery-notification.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('growth/abandoned-carts')
export class AbandonedCartsController {
  constructor(private readonly abandonedCartsService: AbandonedCartsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('abandoned_carts.view')
  findAll(
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
  ) {
    return this.abandonedCartsService.findAll({ status, customerId });
  }

  @Get('detail/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('abandoned_carts.view')
  findOne(@Param('id') id: string) {
    return this.abandonedCartsService.findOne(id);
  }

  @Post('detect')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('abandoned_carts.manage')
  detect(@Body() dto: DetectAbandonedCartsDto) {
    return this.abandonedCartsService.detectAbandonedCarts(dto);
  }

  @Post(':id/notify')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('abandoned_carts.manage')
  sendNotification(
    @Param('id') id: string,
    @Body() dto: SendRecoveryNotificationDto,
  ) {
    return this.abandonedCartsService.sendRecoveryNotification(id, dto);
  }

  // Customer recovery endpoint (accessible via one-click link with token)
  @Get('recover/:token')
  recoverCart(@Param('token') token: string) {
    return this.abandonedCartsService.recoverCart(token);
  }
}
