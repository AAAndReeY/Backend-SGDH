import { BadRequestException, Injectable } from '@nestjs/common';
import { Department } from '@prisma/client';
import * as xlsx from 'xlsx';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const department = await this.prisma.department.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getDepartmentById(department.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.code_num = Number(search);
    return paginationHelper(
      this.prisma.department,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Department> {
    return await this.getDepartmentById(id);
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    await this.getDepartmentById(id);
    await this.prisma.department.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getDepartmentById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const department = await this.getDepartmentById(id, true);
    const inactive = department.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.department.update({
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
    const count = await this.prisma.department.count();
    if (count > 0)
      throw new BadRequestException('Solo se puede realizar una vez');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const data = rows.map((row: any) => {
      return {
        name: String(row.name),
        country: row.country_id,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      };
    });
    const result: any = [];
    for (const d of data) {
      const countryd = await this.prisma.country.findFirst({
        where: { id: String(d.country) },
      });
      if (!countryd)
        throw new BadRequestException(`No existe registro para ${d.country}`);
      const { country, ...res } = d;
      result.push({
        ...res,
        country_id: countryd.id,
      });
    }
    await this.prisma.department.createMany({ data: result });
    return { success: true };
  }

  private async getDepartmentById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });
    if (!department)
      throw new BadRequestException('Departamento no encontrado');
    if (department.deleted_at && !toogle)
      throw new BadRequestException('Departamento eliminado');
    return department;
  }
}
