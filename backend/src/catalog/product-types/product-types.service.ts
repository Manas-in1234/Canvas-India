import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class ProductTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: unknown) {
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 80) {
      throw new BadRequestException('Enter a category name of up to 80 characters.');
    }
    const normalized = name.trim();
    const existing = await this.prisma.productType.findFirst({
      where: { name: { equals: normalized, mode: 'insensitive' } },
    });
    if (existing) throw new ConflictException('A category with that name already exists.');
    try {
      return await this.prisma.productType.create({ data: { name: normalized } });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        throw new ConflictException('A category with that name already exists.');
      }
      throw error;
    }
  }

  async deleteEmpty(id: string) {
    const removed = await this.prisma.productType.deleteMany({
      where: { id, products: { none: {} }, slaRules: { none: {} } },
    });
    if (removed.count) return;
    if (!await this.prisma.productType.findUnique({ where: { id }, select: { id: true } })) {
      throw new NotFoundException('Category not found.');
    }
    throw new ConflictException('This category is linked to products or production rules. Hide it from the website instead.');
  }

  findAll() {
    return this.prisma.productType.findMany({ orderBy: { name: 'asc' } });
  }
}
