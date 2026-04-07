import { BadRequestException, Injectable } from '@nestjs/common';
import { Comunne } from '@prisma/client';
import { CreateComunneDto, UpdateComunneDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class ComunneService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateComunneDto): Promise<Comunne> {
    const comunne = await this.prisma.comunne.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getComunneById(comunne.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = String(search);
    return paginationHelper(
      this.prisma.comunne,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Comunne> {
    return await this.getComunneById(id);
  }

  async update(id: string, dto: UpdateComunneDto): Promise<Comunne> {
    await this.getComunneById(id);
    await this.prisma.comunne.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getComunneById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const comunne = await this.getComunneById(id, true);
    const inactive = comunne.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.comunne.update({
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

  private async getComunneById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const comunne = await this.prisma.comunne.findUnique({
      where: { id },
    });
    if (!comunne) throw new BadRequestException('Padrón no encontrado');
    if (comunne.deleted_at && !toogle)
      throw new BadRequestException('Padrón eliminado');
    return comunne;
  }
}
