import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('production/jobs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @RequirePermissions('production.view')
  findAll() {
    return this.jobsService.findAll();
  }

  @Get('board')
  @RequirePermissions('production.view')
  board() {
    return this.jobsService.board();
  }

  @Get(':id')
  @RequirePermissions('production.view')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }
}
