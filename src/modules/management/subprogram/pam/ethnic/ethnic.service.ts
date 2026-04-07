import { BadRequestException, Injectable } from '@nestjs/common';
import { Ethnic } from '@prisma/client';
import * as xlsx from 'xlsx';
import { CreateEthnicDto, UpdateEthnicDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class EthnicService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEthnicDto): Promise<Ethnic> {
    const ethnic = await this.prisma.ethnic.create({
      data: {
        ...dto,
        name: String(),
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getEthnicById(ethnic.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = String(search);
    return paginationHelper(
      this.prisma.ethnic,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Ethnic> {
    return await this.getEthnicById(id);
  }

  async update(id: string, dto: UpdateEthnicDto): Promise<Ethnic> {
    await this.getEthnicById(id);
    await this.prisma.ethnic.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getEthnicById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const ethnic = await this.getEthnicById(id, true);
    const inactive = ethnic.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.ethnic.update({
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
    const count = await this.prisma.ethnic.count();
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
    await this.prisma.ethnic.createMany({ data });
    return { success: true };
  }

  private async getEthnicById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const ethnic = await this.prisma.ethnic.findUnique({
      where: { id },
    });
    if (!ethnic) throw new BadRequestException('pais no encontrada');
    if (ethnic.deleted_at && !toogle)
      throw new BadRequestException('pais eliminada');
    return ethnic;
  }
}
