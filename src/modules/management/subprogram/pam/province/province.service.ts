import { BadRequestException, Injectable } from '@nestjs/common';
import { Province } from '@prisma/client';
import * as xlsx from 'xlsx';
import { CreateProvinceDto, UpdateProvinceDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class ProvinceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProvinceDto): Promise<Province> {
    const province = await this.prisma.province.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getProvinceById(province.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.code_num = Number(search);
    return paginationHelper(
      this.prisma.province,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Province> {
    return await this.getProvinceById(id);
  }

  async update(id: string, dto: UpdateProvinceDto): Promise<Province> {
    await this.getProvinceById(id);
    await this.prisma.province.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getProvinceById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const province = await this.getProvinceById(id, true);
    const inactive = province.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.province.update({
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
    const count = await this.prisma.province.count();
    if (count > 0)
      throw new BadRequestException('Solo se puede realizar una vez');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const data = rows.map((row: any) => {
      return {
        name: String(row.name),
        country: row.country_id,
        department: row.department_id,
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
      if (!countryd)
        throw new BadRequestException(`No existe registro para ${d.country}`);
      if (!departmentd)
        throw new BadRequestException(
          `No existe registro para ${d.department}`,
        );
      const { country, department, ...res } = d;
      result.push({
        ...res,
        country_id: countryd.id,
        department_id: departmentd.id,
      });
    }
    await this.prisma.province.createMany({ data: result });
    return { success: true };
  }

  private async getProvinceById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const province = await this.prisma.province.findUnique({
      where: { id },
    });
    if (!province) throw new BadRequestException('Provincia no encontrada');
    if (province.deleted_at && !toogle)
      throw new BadRequestException('Provincia eliminada');
    return province;
  }
}
