import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

/** Batching (scope §34) is optimization metadata only — it never changes job/stage state. */
@Injectable()
export class BatchesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.productionBatch.findMany({
      include: { jobs: { include: { job: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const batch = await this.prisma.productionBatch.findUnique({
      where: { id },
      include: { jobs: { include: { job: true } } },
    });
    if (!batch) {
      throw new NotFoundException(`Production batch ${id} not found`);
    }
    return batch;
  }

  create(name: string, productionJobIds: string[], machineId?: string) {
    return this.prisma.productionBatch.create({
      data: {
        name,
        machineId,
        jobs: { create: productionJobIds.map((productionJobId) => ({ productionJobId })) },
      },
      include: { jobs: { include: { job: true } } },
    });
  }
}
