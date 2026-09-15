import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateMachineDto } from './dto/create-machine.dto.js';

@Injectable()
export class MachinesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.machine.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const machine = await this.prisma.machine.findUnique({ where: { id } });
    if (!machine) {
      throw new NotFoundException(`Machine ${id} not found`);
    }
    return machine;
  }

  create(dto: CreateMachineDto) {
    return this.prisma.machine.create({
      data: {
        name: dto.name,
        type: dto.type,
        capacity: dto.capacity,
        supportedMaterials: dto.supportedMaterials ?? [],
        warehouseId: dto.warehouseId,
      },
    });
  }

  updateStatus(id: string, status: 'AVAILABLE' | 'RUNNING' | 'MAINTENANCE' | 'OFFLINE') {
    return this.prisma.machine.update({ where: { id }, data: { status } });
  }
}
