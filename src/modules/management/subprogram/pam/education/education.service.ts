import { BadRequestException, Injectable } from '@nestjs/common';
import { Education } from '@prisma/client';
import * as xlsx from 'xlsx';
import { CreateEducationDto, UpdateEducationDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEducationDto): Promise<Education> {
    const education = await this.prisma.education.create({
      data: {
        ...dto,
        name: String(),
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getEducationById(education.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = String(search);
    return paginationHelper(
      this.prisma.education,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Education> {
    return await this.getEducationById(id);
  }

  async update(id: string, dto: UpdateEducationDto): Promise<Education> {
    await this.getEducationById(id);
    await this.prisma.education.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getEducationById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const education = await this.getEducationById(id, true);
    const inactive = education.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.education.update({
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
    const count = await this.prisma.education.count();
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
    await this.prisma.education.createMany({ data });
    return { success: true };
  }

  private async getEducationById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const education = await this.prisma.education.findUnique({
      where: { id },
    });
    if (!education) throw new BadRequestException('pais no encontrada');
    if (education.deleted_at && !toogle)
      throw new BadRequestException('pais eliminada');
    return education;
  }
}
