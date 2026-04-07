import { BadRequestException, Injectable } from '@nestjs/common';
import { Declaration } from '@prisma/client';
import * as xlsx from 'xlsx';
import { CreateDeclarationDto, UpdateDeclarationDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class DeclarationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDeclarationDto): Promise<Declaration> {
    const declaration = await this.prisma.declaration.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getDeclarationById(declaration.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    return paginationHelper(
      this.prisma.declaration,
      {
        where,
        orderBy: { code: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Declaration> {
    return await this.getDeclarationById(id);
  }

  async update(id: string, dto: UpdateDeclarationDto): Promise<Declaration> {
    await this.getDeclarationById(id);
    await this.prisma.declaration.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getDeclarationById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const declaration = await this.getDeclarationById(id, true);
    const inactive = declaration.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.declaration.update({
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
    const count = await this.prisma.declaration.count();
    if (count > 0)
      throw new BadRequestException('Solo se puede realizar una vez');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const data = rows.map((row: any) => {
      return {
        code: String(row.code),
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      };
    });
    await this.prisma.declaration.createMany({ data });
    return { success: true };
  }

  private async getDeclarationById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const declaration = await this.prisma.declaration.findUnique({
      where: { id },
    });
    if (!declaration)
      throw new BadRequestException('Declaración Jurada no encontrada');
    if (declaration.deleted_at && !toogle)
      throw new BadRequestException('Declaración Jurada eliminada');
    return declaration;
  }
}
