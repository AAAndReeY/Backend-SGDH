import { BadRequestException, Injectable } from '@nestjs/common';
import { Town } from '@prisma/client';
import * as xlsx from 'xlsx';
import { CreateTownDto, UpdateTownDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class TownService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTownDto): Promise<Town> {
    const town = await this.prisma.town.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getTownById(town.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search)
      where.OR = [
        { address: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    return paginationHelper(
      this.prisma.town,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Town> {
    return await this.getTownById(id);
  }

  async update(id: string, dto: UpdateTownDto): Promise<Town> {
    await this.getTownById(id);
    await this.prisma.town.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getTownById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const town = await this.getTownById(id, true);
    const inactive = town.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.town.update({
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
    const count = await this.prisma.town.count();
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
    await this.prisma.town.createMany({ data });
    return { success: true };
  }

  private async getTownById(id: string, toogle: boolean = false): Promise<any> {
    const town = await this.prisma.town.findUnique({
      where: { id },
    });
    if (!town) throw new BadRequestException('Pueblo no encontrado');
    if (town.deleted_at && !toogle)
      throw new BadRequestException('Pueblo eliminado');
    return town;
  }
}
