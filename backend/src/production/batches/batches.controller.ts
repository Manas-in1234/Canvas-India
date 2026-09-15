import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BatchesService } from './batches.service.js';
import { CreateBatchDto } from './dto/create-batch.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('production/batches')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Get()
  @RequirePermissions('production.view')
  findAll() {
    return this.batchesService.findAll();
  }

  @Get(':id')
  @RequirePermissions('production.view')
  findOne(@Param('id') id: string) {
    return this.batchesService.findOne(id);
  }

  @Post()
  @RequirePermissions('production.assign')
  create(@Body() dto: CreateBatchDto) {
    return this.batchesService.create(dto.name, dto.productionJobIds, dto.machineId);
  }
}
