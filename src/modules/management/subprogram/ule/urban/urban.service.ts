import { BadRequestException, Injectable } from '@nestjs/common';
import { Urban } from '@prisma/client';
import * as xlsx from 'xlsx';
import { CreateUrbanDto, UpdateUrbanDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class UrbanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUrbanDto): Promise<Urban> {
    const urban = await this.prisma.urban.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getUrbanById(urban.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    return paginationHelper(
      this.prisma.urban,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Urban> {
    return await this.getUrbanById(id);
  }

  async update(id: string, dto: UpdateUrbanDto): Promise<Urban> {
    await this.getUrbanById(id);
    await this.prisma.urban.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getUrbanById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const urban = await this.getUrbanById(id, true);
    const inactive = urban.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.urban.update({
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

  async upload(file: Express.Multer.File) {
    const count = await this.prisma.urban.count();
    if (count > 0)
      throw new BadRequestException('Solo se puede realizar una vez');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const data = rows.map((row: any) => {
      return {
        name: row.name,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      };
    });
    await this.prisma.urban.createMany({ data });
    return { success: true };
  }

  private async getUrbanById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const urban = await this.prisma.urban.findUnique({
      where: { id },
    });
    if (!urban) throw new BadRequestException('Núcleo urbano no encontrado');
    if (urban.deleted_at && !toogle)
      throw new BadRequestException('Núcleo urbano eliminado');
    return urban;
  }
}
