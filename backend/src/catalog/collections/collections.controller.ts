import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CollectionsService } from './collections.service.js';
import { CreateCollectionDto } from './dto/create-collection.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('collections')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @RequirePermissions('products.view')
  findAll() {
    return this.collectionsService.findAll();
  }

  @Post()
  @RequirePermissions('products.edit')
  create(@Body() dto: CreateCollectionDto) {
    return this.collectionsService.create(dto.name, dto.slug);
  }
}
