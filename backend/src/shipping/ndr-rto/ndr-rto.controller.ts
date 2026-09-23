import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { NdrRtoService } from './ndr-rto.service.js';
import { CreateNdrCaseDto } from './dto/create-ndr-case.dto.js';
import { CreateRtoCaseDto } from './dto/create-rto-case.dto.js';
import { ChangeNdrAddressDto } from './dto/change-ndr-address.dto.js';

@Controller('shipping')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class NdrRtoController {
  constructor(private readonly ndrRtoService: NdrRtoService) {}

  @Get('ndr')
  @RequirePermissions('ndr.view')
  findNdrCases() {
    return this.ndrRtoService.findNdrCases();
  }

  @Get('ndr/:id')
  @RequirePermissions('ndr.view')
  findNdrCase(@Param('id') id: string) {
    return this.ndrRtoService.findNdrCase(id);
  }

  @Post('ndr')
  @RequirePermissions('ndr.action')
  createNdrCase(@Body() dto: CreateNdrCaseDto) {
    return this.ndrRtoService.createNdrCase(dto);
  }

  @Post('ndr/:id/call-customer')
  @RequirePermissions('ndr.action')
  callCustomer(@Param('id') id: string) {
    return this.ndrRtoService.callCustomer(id);
  }

  @Post('ndr/:id/reattempt')
  @RequirePermissions('ndr.action')
  requestReattempt(@Param('id') id: string) {
    return this.ndrRtoService.requestReattempt(id);
  }

  @Post('ndr/:id/change-address')
  @RequirePermissions('ndr.action')
  changeAddress(
    @Param('id') id: string,
    @Body() dto: ChangeNdrAddressDto,
  ) {
    return this.ndrRtoService.changeAddress(id, dto);
  }

  @Post('ndr/:id/cancel')
  @RequirePermissions('ndr.action')
  cancel(@Param('id') id: string) {
    return this.ndrRtoService.cancel(id);
  }

  @Post('ndr/:id/return-to-origin')
  @RequirePermissions('ndr.action')
  returnToOrigin(@Param('id') id: string) {
    return this.ndrRtoService.returnToOrigin(id);
  }

  @Post('rto')
  @RequirePermissions('ndr.action')
  createRtoCase(@Body() dto: CreateRtoCaseDto) {
    return this.ndrRtoService.createRtoCase(dto);
  }

  @Post('rto/:id/land')
  @RequirePermissions('ndr.action')
  landRto(@Param('id') id: string) {
    return this.ndrRtoService.landRto(id);
  }
}
