import { BadRequestException, Injectable } from '@nestjs/common';
import { Enumerator } from '@prisma/client';
import * as xlsx from 'xlsx';
import { CreateEnumeratorDto, UpdateEnumeratorDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  parseDate,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';
import { ObservationService } from 'src/common/services/observation.service';

@Injectable()
export class EnumeratorService {
  constructor(private readonly prisma: PrismaService,
  private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateEnumeratorDto): Promise<Enumerator> {
    const { birthday, ...res } = dto;
    const data: any = {
      ...res,
      ...(birthday && { birthday: parseDate(birthday) }),
      created_at: timezoneHelper(),
      updated_at: timezoneHelper(),
    };
    const enumerator = await this.prisma.enumerator.create({ data });
    return await this.getEnumeratorById(enumerator.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search)
      where.OR = [
        { dni: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { lastname: { contains: search, mode: 'insensitive' } },
      ];
    return paginationHelper(
      this.prisma.enumerator,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Enumerator> {
    return await this.getEnumeratorById(id);
  }

  async update(id: string, dto: UpdateEnumeratorDto): Promise<Enumerator> {
    await this.getEnumeratorById(id);
    const { birthday, ...res } = dto;
    const data: any = {
      ...res,
      ...(birthday && { birthday: parseDate(birthday) }),
      updated_at: timezoneHelper(),
    };
    await this.prisma.enumerator.update({
      data,
      where: { id },
    });
    return await this.getEnumeratorById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const enumerator = await this.getEnumeratorById(id, true);
    const inactive = enumerator.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.enumerator.update({
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
    const count = await this.prisma.enumerator.count();
    if (count > 0)
      throw new BadRequestException('Solo se puede realizar una vez');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const data = rows.map((row: any) => {
      return {
        dni: row.dni,
        name: row.name,
        lastname: row.lastname,
        phone: String(row.phone) ?? null,
        birthday: row.birthday ? parseDate(row.birthday) : null,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      };
    });
    await this.prisma.enumerator.createMany({ data });
    return { success: true };
  }

  private async getEnumeratorById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const enumerator = await this.prisma.enumerator.findUnique({
      where: { id },
    });
    if (!enumerator)
      throw new BadRequestException('Empadronador no encontrado');
    if (enumerator.deleted_at && !toogle)
      throw new BadRequestException('Empradonador eliminado');
    return enumerator;
  }
}
