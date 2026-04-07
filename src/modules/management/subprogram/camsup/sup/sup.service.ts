import { BadRequestException, Injectable } from '@nestjs/common';
import { Sup } from '@prisma/client';
import { CreateSupDto, FilterSupDto, UpdateSupDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { filterSup } from './helpers';

@Injectable()
export class SupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSupDto): Promise<Sup> {
    await this.checkDniUnique(dto.dni);
    const sup = await this.prisma.sup.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getSupById(sup.id);
  }

  async findAll(dto: FilterSupDto): Promise<any> {
    const { where, pagination } = filterSup(dto);
    return paginationHelper(
      this.prisma.sup,
      {
        where,
        orderBy: { lastname: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Sup> {
    return await this.getSupById(id);
  }

  async update(id: string, dto: UpdateSupDto): Promise<Sup> {
    await this.getSupById(id);
    if (dto.dni) await this.checkDniUnique(dto.dni, id);
    await this.prisma.sup.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getSupById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const sup = await this.getSupById(id, true);
    const inactive = sup.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.sup.update({
      data: {
        updated_at: timezoneHelper(),
        deleted_at,
      },
      where: { id },
    });
    return {
      action: inactive ? 'Restore' : 'Delete',
      id,
    };
  }

  private async getSupById(id: string, toggle: boolean = false): Promise<any> {
    const sup = await this.prisma.sup.findUnique({ where: { id } });
    if (!sup) throw new BadRequestException('Sup no encontrado');
    if (sup.deleted_at && !toggle)
      throw new BadRequestException('Sup eliminado');
    return sup;
  }

  private async checkDniUnique(dni: string, excludeId?: string): Promise<void> {
    const existing = await this.prisma.sup.findUnique({ where: { dni } });
    if (existing && existing.id !== excludeId)
      throw new BadRequestException('El DNI ya está registrado');
  }
}