import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.collection.findMany();
  }

  create(name: string, slug: string) {
    return this.prisma.collection.create({ data: { name, slug } });
  }
}
