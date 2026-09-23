import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateAdminUserDto } from './dto/create-admin-user.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../common/guards/permissions.guard.js';
import { RequirePermissions } from '../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.js';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('users.view')
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @RequirePermissions('users.manage')
  create(@Body() dto: CreateAdminUserDto, @CurrentUser() actingUser: AuthenticatedUser) {
    return this.usersService.create(dto.name, dto.email, dto.password, dto.roleId, actingUser.id);
  }

  @Patch(':id/deactivate')
  @RequirePermissions('users.manage')
  deactivate(@Param('id') id: string, @CurrentUser() actingUser: AuthenticatedUser) {
    return this.usersService.deactivate(id, actingUser.id);
  }
}
