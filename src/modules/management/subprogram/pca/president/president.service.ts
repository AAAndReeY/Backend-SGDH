import { BadRequestException, Injectable } from '@nestjs/common';
import { President, Sex } from '@prisma/client';
import * as xlsx from 'xlsx';
import {
  CreatePresidentDto,
  FilterPresidentDto,
  UpdatePresidentDto,
} from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { filterPresident } from './helpers';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { ObservationService } from 'src/common/services/observation.service';

@Injectable()
export class PresidentService {
  constructor(private readonly prisma: PrismaService,
  private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreatePresidentDto): Promise<President> {
    const president = await this.prisma.president.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getPresidentById(president.id);
  }

  async findAll(dto: FilterPresidentDto): Promise<any> {
    const { where, pagination } = filterPresident(dto);
    return paginationHelper(
      this.prisma.president,
      {
        where,
        include: {
          centers: {
            select: {
              modality: true,
            },
          },
        },
        orderBy: { lastname: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<President> {
    return await this.getPresidentById(id);
  }

  async update(id: string, dto: UpdatePresidentDto): Promise<President> {
    await this.getPresidentById(id);
    const { observation, ...res } = dto
    await this.prisma.president.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    await this.observationService.syncObservation(
      id,
      observation,
      'president',
    );
    return await this.getPresidentById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const president = await this.getPresidentById(id, true);
    const inactive = president.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.president.update({
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
    const count = await this.prisma.president.count();
    if (count > 0)
      throw new BadRequestException('Solo se puede realizar una vez');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const data = rows.map((row: any) => {
      return {
        name: String(row.name),
        lastname: String(row.lastname) ?? String(row.name),
        dni: row.dni ? String(row.dni) : null,
        sex: row.sex === 'Masculino' ? Sex.MALE : Sex.FEMALE,
        phone: row.phone ? String(row.phone) : null,
        birthday: row.birthday ? String(row.birthday) : null,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      };
    });

    await this.prisma.president.createMany({ data });
    return { success: true };
  }

  private async getPresidentById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const president = await this.prisma.president.findUnique({
      where: { id },
    });
    if (!president) throw new BadRequestException('Presidente no encontrado');
    if (president.deleted_at && !toogle)
      throw new BadRequestException('Presidente eliminado');
    return president;
  }
}
