import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ShippingService } from './shipping.service.js';
import { CreateShipmentDto } from './dto/create-shipment.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../common/guards/permissions.guard.js';
import { RequirePermissions } from '../common/decorators/permissions.decorator.js';

@Controller('shipping')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get()
  @RequirePermissions('shipping.view')
  findAll() {
    return this.shippingService.findAll();
  }

  @Get(':id')
  @RequirePermissions('shipping.view')
  findOne(@Param('id') id: string) {
    return this.shippingService.findOne(id);
  }

  @Post('shipments')
  @RequirePermissions('shipping.create')
  create(@Body() dto: CreateShipmentDto) {
    return this.shippingService.create(dto);
  }

  @Delete('shipments/:id')
  @RequirePermissions('shipping.cancel')
  cancel(@Param('id') id: string) {
    return this.shippingService.cancel(id);
  }
}
