import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service.js';
import { CreateDiscountDto } from './dto/create-discount.dto.js';
import { UpdateDiscountDto } from './dto/update-discount.dto.js';
import { ValidateDiscountDto } from './dto/validate-discount.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('growth/discounts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get()
  @RequirePermissions('discounts.view')
  findAll(
    @Query('isActive') isActive?: string,
    @Query('campaignId') campaignId?: string,
  ) {
    const activeFilter = isActive !== undefined ? isActive === 'true' : undefined;
    return this.discountsService.findAll({ isActive: activeFilter, campaignId });
  }

  @Get(':id')
  @RequirePermissions('discounts.view')
  findOne(@Param('id') id: string) {
    return this.discountsService.findOne(id);
  }

  @Post()
  @RequirePermissions('discounts.manage')
  create(@Body() dto: CreateDiscountDto) {
    return this.discountsService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('discounts.manage')
  update(@Param('id') id: string, @Body() dto: UpdateDiscountDto) {
    return this.discountsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('discounts.manage')
  delete(@Param('id') id: string) {
    return this.discountsService.delete(id);
  }

  @Post('validate')
  @RequirePermissions('discounts.view')
  validate(@Body() dto: ValidateDiscountDto) {
    return this.discountsService.validateDiscount(dto);
  }
}
