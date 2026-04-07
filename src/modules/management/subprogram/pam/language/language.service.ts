import { BadRequestException, Injectable } from '@nestjs/common';
import { Language } from '@prisma/client';
import * as xlsx from 'xlsx';
import { CreateLanguageDto, UpdateLanguageDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class LanguageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLanguageDto): Promise<Language> {
    const language = await this.prisma.language.create({
      data: {
        ...dto,
        name: String(),
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getLanguageById(language.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = String(search);
    return paginationHelper(
      this.prisma.language,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Language> {
    return await this.getLanguageById(id);
  }

  async update(id: string, dto: UpdateLanguageDto): Promise<Language> {
    await this.getLanguageById(id);
    await this.prisma.language.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getLanguageById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const language = await this.getLanguageById(id, true);
    const inactive = language.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.language.update({
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
    const count = await this.prisma.language.count();
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
    await this.prisma.language.createMany({ data });
    return { success: true };
  }

  private async getLanguageById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const language = await this.prisma.language.findUnique({
      where: { id },
    });
    if (!language) throw new BadRequestException('pais no encontrada');
    if (language.deleted_at && !toogle)
      throw new BadRequestException('pais eliminada');
    return language;
  }
}
