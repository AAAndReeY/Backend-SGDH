import { BadRequestException, Injectable } from '@nestjs/common';
import { Workshop } from '@prisma/client';
import { CreateWorkshopDto, UpdateWorkshopDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class WorkshopService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWorkshopDto): Promise<Workshop> {
    const workshop = await this.prisma.workshop.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getWorkshopById(workshop.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = String(search);
    return paginationHelper(
      this.prisma.workshop,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Workshop> {
    return await this.getWorkshopById(id);
  }

  async update(id: string, dto: UpdateWorkshopDto): Promise<Workshop> {
    await this.getWorkshopById(id);
    await this.prisma.workshop.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getWorkshopById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const workshop = await this.getWorkshopById(id, true);
    const inactive = workshop.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.workshop.update({
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

  private async getWorkshopById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const workshop = await this.prisma.workshop.findUnique({
      where: { id },
    });
    if (!workshop) throw new BadRequestException('Taller no encontrado');
    if (workshop.deleted_at && !toogle)
      throw new BadRequestException('Taller eliminado');
    return workshop;
  }
}
