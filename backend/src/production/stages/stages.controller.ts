import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StagesService } from './stages.service.js';
import { StartStageDto } from './dto/start-stage.dto.js';
import { CompleteStageDto } from './dto/complete-stage.dto.js';
import { QcResultDto } from './dto/qc-result.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.js';

@Controller('production/stages')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Get(':id')
  @RequirePermissions('production.view')
  findOne(@Param('id') id: string) {
    return this.stagesService.findOne(id);
  }

  @Post(':id/start')
  @RequirePermissions('production.assign')
  start(@Param('id') id: string, @Body() dto: StartStageDto) {
    return this.stagesService.start(id, dto.machineId);
  }

  @Post(':id/complete')
  @RequirePermissions('production.complete')
  complete(@Param('id') id: string, @Body() dto: CompleteStageDto) {
    return this.stagesService.complete(id, dto.notes);
  }

  @Post(':id/qc')
  @RequirePermissions('production.qc')
  recordQc(@Param('id') id: string, @Body() dto: QcResultDto, @CurrentUser() user: AuthenticatedUser) {
    return this.stagesService.recordQc(id, dto, user.id);
  }
}
