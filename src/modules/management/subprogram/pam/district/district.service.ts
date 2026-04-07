import { BadRequestException, Injectable } from '@nestjs/common';
import { District } from '@prisma/client';
import * as xlsx from 'xlsx';
import { CreateDistrictDto, UpdateDistrictDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class DistrictService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDistrictDto): Promise<District> {
    const district = await this.prisma.district.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getDistrictById(district.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.code_num = Number(search);
    return paginationHelper(
      this.prisma.district,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<District> {
    return await this.getDistrictById(id);
  }

  async update(id: string, dto: UpdateDistrictDto): Promise<District> {
    await this.getDistrictById(id);
    await this.prisma.district.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getDistrictById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const district = await this.getDistrictById(id, true);
    const inactive = district.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.district.update({
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
    const count = await this.prisma.district.count();
    if (count > 0)
      throw new BadRequestException('Solo se puede realizar una vez');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const data = rows.map((row: any) => {
      return {
        name: String(row.name),
        country: String(row.country),
        department: String(row.department),
        province: String(row.province),
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      };
    });
    const result: any = [];
    for (const d of data) {
      const countryd = await this.prisma.country.findFirst({
        where: { name: d.country },
      });
      const departmentd = await this.prisma.department.findFirst({
        where: { name: d.department },
      });
      const provinced = await this.prisma.province.findFirst({
        where: { name: d.province },
      });
      if (!countryd)
        throw new BadRequestException(`No existe registro para ${d.country}`);
      if (!departmentd)
        throw new BadRequestException(
          `No existe registro para ${d.department}`,
        );
      if (!provinced)
        throw new BadRequestException(`No existe registro para ${d.province}`);
      const { country, department, province, ...res } = d;
      result.push({
        ...res,
        country_id: countryd.id,
        department_id: departmentd.id,
        province_id: provinced.id,
      });
    }
    await this.prisma.district.createMany({ data: result });
    return { success: true };
  }

  private async getDistrictById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const district = await this.prisma.district.findUnique({
      where: { id },
    });
    if (!district) throw new BadRequestException('Distrito no encontrado');
    if (district.deleted_at && !toogle)
      throw new BadRequestException('Distrito eliminado');
    return district;
  }
}
