import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { DesignsService } from './designs.service.js';
import { CreateDesignDto } from './dto/create-design.dto.js';
import { SaveVersionDto } from './dto/save-version.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('customization/designs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  @Get()
  @RequirePermissions('designs.view')
  findByCustomer(@Query('customerId') customerId: string) {
    return this.designsService.findByCustomer(customerId);
  }

  @Get(':id')
  @RequirePermissions('designs.view')
  findOne(@Param('id') id: string) {
    return this.designsService.findOne(id);
  }

  @Post()
  @RequirePermissions('designs.edit')
  create(@Body() dto: CreateDesignDto) {
    return this.designsService.create(dto);
  }

  @Post(':id/versions')
  @RequirePermissions('designs.edit')
  saveVersion(@Param('id') id: string, @Body() dto: SaveVersionDto) {
    return this.designsService.saveVersion(id, dto);
  }

  @Post(':id/submit')
  @RequirePermissions('designs.edit')
  submit(@Param('id') id: string) {
    return this.designsService.submit(id);
  }
}
