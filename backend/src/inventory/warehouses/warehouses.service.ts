import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateWarehouseDto } from './dto/create-warehouse.dto.js';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.warehouse.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async create(dto: CreateWarehouseDto) {
    const existing = await this.prisma.warehouse.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(
        `Warehouse with code "${dto.code}" already exists`,
      );
    }

    return this.prisma.warehouse.create({
      data: {
        name: dto.name,
        code: dto.code,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
        country: dto.country ?? 'IN',
      },
    });
  }

  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.warehouse.update({
      where: { id },
      data: { isActive: false },
    });
  }
}