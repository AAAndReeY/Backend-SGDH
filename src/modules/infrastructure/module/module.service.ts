import { BadRequestException, Injectable } from '@nestjs/common';
import { Module, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { FilterModuleDto } from './dto';
import { paginationHelper } from '../../../common/helpers';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: FilterModuleDto): Promise<any> {
    const { search, program, ...pagination } = dto;
    const where: Prisma.ModuleWhereInput = {
      deleted_at: null,
      ...(search && {
        name: { contains: search, mode: 'insensitive' },
      }),
      ...(program != null && { program_id: program }),
    };
    return paginationHelper(
      this.prisma.module,
      {
        where,
        orderBy: { name: 'asc' },
        include: { program: true },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Module> {
    return await this.getModuleById(id);
  }

  private async getModuleById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: { program: true },
    });
    if (!module) throw new BadRequestException('Módulo no encontrado');
    if (module.deleted_at && !toogle)
      throw new BadRequestException('Módulo eliminado');
    return module;
  }
}
