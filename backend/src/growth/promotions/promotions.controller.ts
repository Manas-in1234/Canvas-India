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
import { PromotionsService } from './promotions.service.js';
import { CreatePromotionDto } from './dto/create-promotion.dto.js';
import { UpdatePromotionDto } from './dto/update-promotion.dto.js';
import { EvaluatePromotionsDto } from './dto/evaluate-promotions.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('growth/promotions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @RequirePermissions('promotions.view')
  findAll(
    @Query('isActive') isActive?: string,
    @Query('campaignId') campaignId?: string,
  ) {
    const activeFilter = isActive !== undefined ? isActive === 'true' : undefined;
    return this.promotionsService.findAll({ isActive: activeFilter, campaignId });
  }

  @Get(':id')
  @RequirePermissions('promotions.view')
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @Post()
  @RequirePermissions('promotions.manage')
  create(@Body() dto: CreatePromotionDto) {
    return this.promotionsService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('promotions.manage')
  update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    return this.promotionsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('promotions.manage')
  delete(@Param('id') id: string) {
    return this.promotionsService.delete(id);
  }

  @Post('evaluate')
  @RequirePermissions('promotions.view')
  evaluate(@Body() dto: EvaluatePromotionsDto) {
    return this.promotionsService.evaluatePromotions(dto);
  }
}
