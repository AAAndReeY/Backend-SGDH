import { BadRequestException, Injectable } from '@nestjs/common';
import { Housing } from '@prisma/client';
import * as xlsx from 'xlsx';
import { CreateHousingDto, UpdateHousingDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class HousingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateHousingDto): Promise<Housing> {
    const housing = await this.prisma.housing.create({
      data: {
        ...dto,
        name: String(),
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getHousingById(housing.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = String(search);
    return paginationHelper(
      this.prisma.housing,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Housing> {
    return await this.getHousingById(id);
  }

  async update(id: string, dto: UpdateHousingDto): Promise<Housing> {
    await this.getHousingById(id);
    await this.prisma.housing.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getHousingById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const housing = await this.getHousingById(id, true);
    const inactive = housing.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.housing.update({
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
    const count = await this.prisma.housing.count();
    if (count > 0)
      throw new BadRequestException('Solo se puede realizar una vez');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const data = rows.map((row: any) => {
      return {
        name: String(row.name),
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      };
    });
    await this.prisma.housing.createMany({ data });
    return { success: true };
  }

  private async getHousingById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const housing = await this.prisma.housing.findUnique({
      where: { id },
    });
    if (!housing) throw new BadRequestException('pais no encontrada');
    if (housing.deleted_at && !toogle)
      throw new BadRequestException('pais eliminada');
    return housing;
  }
}
