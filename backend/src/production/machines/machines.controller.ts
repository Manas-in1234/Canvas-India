import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MachinesService } from './machines.service.js';
import { CreateMachineDto } from './dto/create-machine.dto.js';
import { UpdateMachineStatusDto } from './dto/update-machine-status.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('production/machines')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  @RequirePermissions('machines.view')
  findAll() {
    return this.machinesService.findAll();
  }

  @Get(':id')
  @RequirePermissions('machines.view')
  findOne(@Param('id') id: string) {
    return this.machinesService.findOne(id);
  }

  @Post()
  @RequirePermissions('machines.manage')
  create(@Body() dto: CreateMachineDto) {
    return this.machinesService.create(dto);
  }

  @Patch(':id/status')
  @RequirePermissions('machines.manage')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateMachineStatusDto) {
    return this.machinesService.updateStatus(id, dto.status);
  }
}
