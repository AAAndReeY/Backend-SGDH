import { BadRequestException, Injectable } from '@nestjs/common';
import { Census } from '@prisma/client';
import { CreateCensusDto, UpdateCensusDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class CensusService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCensusDto): Promise<Census> {
    const census = await this.prisma.census.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getCensusById(census.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = String(search);
    return paginationHelper(
      this.prisma.census,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Census> {
    return await this.getCensusById(id);
  }

  async update(id: string, dto: UpdateCensusDto): Promise<Census> {
    await this.getCensusById(id);
    await this.prisma.census.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getCensusById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const census = await this.getCensusById(id, true);
    const inactive = census.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.census.update({
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

  private async getCensusById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const census = await this.prisma.census.findUnique({
      where: { id },
    });
    if (!census) throw new BadRequestException('Padrón no encontrado');
    if (census.deleted_at && !toogle)
      throw new BadRequestException('Padrón eliminado');
    return census;
  }
}
