import { BadRequestException, Injectable } from '@nestjs/common';
import { Module, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateModuleDto, FilterModuleDto } from './dto';
import { paginationHelper, timezoneHelper } from '../../../common/helpers';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateModuleDto): Promise<any> {
    const exists = await this.prisma.module.findFirst({
      where: { name: dto.name },
    });
    if (exists) throw new BadRequestException(`El módulo "${dto.name}" ya existe`);
    return this.prisma.module.create({
      data: {
        name: dto.name,
        program_id: dto.program_id,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
      include: { program: true },
    });
  }

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

  async update(id: string, dto: Partial<CreateModuleDto>): Promise<any> {
    await this.getModuleById(id);
    if (dto.name) {
      const exists = await this.prisma.module.findFirst({
        where: { name: dto.name, NOT: { id } },
      });
      if (exists) throw new BadRequestException(`El módulo "${dto.name}" ya existe`);
    }
    return this.prisma.module.update({
      where: { id },
      data: { ...dto, updated_at: timezoneHelper() },
      include: { program: true },
    });
  }

  async toggleDelete(id: string): Promise<any> {
    const module = await this.getModuleById(id, true);
    const deleted_at = module.deleted_at ? null : timezoneHelper();
    await this.prisma.module.update({
      where: { id },
      data: { deleted_at, updated_at: timezoneHelper() },
    });
    return { action: module.deleted_at ? 'Restore' : 'Delete', id };
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
