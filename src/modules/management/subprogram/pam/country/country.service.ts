import { BadRequestException, Injectable } from '@nestjs/common';
import { Country } from '@prisma/client';
import * as xlsx from 'xlsx';
import { CreateCountryDto, UpdateCountryDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class CountryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCountryDto): Promise<Country> {
    const country = await this.prisma.country.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getCountryById(country.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.code_num = Number(search);
    return paginationHelper(
      this.prisma.country,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Country> {
    return await this.getCountryById(id);
  }

  async update(id: string, dto: UpdateCountryDto): Promise<Country> {
    await this.getCountryById(id);
    await this.prisma.country.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getCountryById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const country = await this.getCountryById(id, true);
    const inactive = country.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.country.update({
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
    const count = await this.prisma.country.count();
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
    await this.prisma.country.createMany({ data });
    return { success: true };
  }

  private async getCountryById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const country = await this.prisma.country.findUnique({
      where: { id },
    });
    if (!country) throw new BadRequestException('País no encontrado');
    if (country.deleted_at && !toogle)
      throw new BadRequestException('País eliminado');
    return country;
  }
}
