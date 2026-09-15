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
import { CustomerSegmentsService } from './customer-segments.service.js';
import { CreateCustomerSegmentDto } from './dto/create-customer-segment.dto.js';
import { UpdateCustomerSegmentDto } from './dto/update-customer-segment.dto.js';
import { AddSegmentMembersDto } from './dto/add-segment-members.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('growth/segments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CustomerSegmentsController {
  constructor(private readonly segmentsService: CustomerSegmentsService) {}

  @Get()
  @RequirePermissions('segments.view')
  findAll(@Query('isActive') isActive?: string) {
    const activeFilter = isActive !== undefined ? isActive === 'true' : undefined;
    return this.segmentsService.findAll(activeFilter);
  }

  @Get(':id')
  @RequirePermissions('segments.view')
  findOne(@Param('id') id: string) {
    return this.segmentsService.findOne(id);
  }

  @Post()
  @RequirePermissions('segments.manage')
  create(@Body() dto: CreateCustomerSegmentDto) {
    return this.segmentsService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('segments.manage')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerSegmentDto) {
    return this.segmentsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('segments.manage')
  delete(@Param('id') id: string) {
    return this.segmentsService.delete(id);
  }

  @Post(':id/evaluate')
  @RequirePermissions('segments.manage')
  evaluate(@Param('id') id: string) {
    return this.segmentsService.evaluateSegment(id);
  }

  @Post(':id/members')
  @RequirePermissions('segments.manage')
  addMembers(@Param('id') id: string, @Body() dto: AddSegmentMembersDto) {
    return this.segmentsService.addMembers(id, dto.customerIds);
  }

  @Delete(':id/members/:customerId')
  @RequirePermissions('segments.manage')
  removeMember(@Param('id') id: string, @Param('customerId') customerId: string) {
    return this.segmentsService.removeMember(id, customerId);
  }
}
