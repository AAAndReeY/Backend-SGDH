import { BadRequestException, Injectable } from '@nestjs/common';
import { Box } from '@prisma/client';
import * as xlsx from 'xlsx';
import { CreateBoxDto, UpdateBoxDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class BoxService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBoxDto): Promise<Box> {
    const box = await this.prisma.box.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getBoxById(box.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.code_num = Number(search);
    return paginationHelper(
      this.prisma.box,
      {
        where,
        orderBy: { code_num: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Box> {
    return await this.getBoxById(id);
  }

  async update(id: string, dto: UpdateBoxDto): Promise<Box> {
    await this.getBoxById(id);
    await this.prisma.box.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getBoxById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const box = await this.getBoxById(id, true);
    const inactive = box.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.box.update({
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
    const count = await this.prisma.box.count();
    if (count > 0)
      throw new BadRequestException('Solo se puede realizar una vez');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const data = rows.map((row: any) => {
      return {
        code_num: Number(row.code),
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      };
    });
    await this.prisma.box.createMany({ data });
    return { success: true };
  }

  private async getBoxById(id: string, toogle: boolean = false): Promise<any> {
    const box = await this.prisma.box.findUnique({
      where: { id },
    });
    if (!box) throw new BadRequestException('Caja no encontrada');
    if (box.deleted_at && !toogle)
      throw new BadRequestException('Caja eliminada');
    return box;
  }
}
