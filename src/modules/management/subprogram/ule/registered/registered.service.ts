import { BadRequestException, Injectable } from '@nestjs/common';
import { Level, Registered } from '@prisma/client';
import * as xlsx from 'xlsx';
import {
  CreateRegisteredDto,
  FilterRegisteredDto,
  UpdateRegisteredDto,
} from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  parseDate,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from 'src/common/dto';
import { filterRegistered } from './helpers';
import { ObservationService } from 'src/common/services/observation.service';

@Injectable()
export class RegisteredService {
  constructor(private readonly prisma: PrismaService,
  private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateRegisteredDto): Promise<Registered> {
    const { latitude, longitude, members, birthday, ...res } = dto;
    const data: any = {
      ...res,
      ...(latitude && { latitude: Number(latitude) }),
      ...(longitude && { longitude: Number(longitude) }),
      ...(members && { members: Number(members) }),
      ...(birthday && { birthday: parseDate(birthday) }),
      created_at: timezoneHelper(),
      updated_at: timezoneHelper(),
    };
    const registered = await this.prisma.registered.create({ data });
    return this.getRegisteredById(registered.id);
  }

  async findAll(dto: FilterRegisteredDto): Promise<any> {
    const { where, pagination } = filterRegistered(dto);
    return paginationHelper(
      this.prisma.registered,
      {
        where,
        orderBy: { dni: 'asc' },
        include: {
          enumerator: true,
          urban: true,
          box: true,
          declaration: true,
        },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Registered> {
    return await this.getRegisteredById(id);
  }

  async update(id: string, dto: UpdateRegisteredDto): Promise<Registered> {
    await this.getRegisteredById(id);
    const { observation,latitude, longitude, members, birthday, ...res } = dto;
    const data: any = {
      ...res,
      ...(latitude && { latitude: Number(latitude) }),
      ...(longitude && { longitude: Number(longitude) }),
      ...(members && { members: Number(members) }),
      ...(birthday && { birthday: parseDate(birthday) }),
      updated_at: timezoneHelper(),
    };
    await this.prisma.registered.update({
      data,
      where: { id },
    });
    await this.observationService.syncObservation(
      id,
      observation,
      'registered',
    )
    return await this.getRegisteredById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const registered = await this.getRegisteredById(id, true);
    const inactive = registered.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.registered.update({
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
    const count = await this.prisma.registered.count();
    if (count > 0)
      throw new BadRequestException('Solo se puede realizar una vez');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const data = rows.map((row: any) => {
      return {
        fsu: String(row.fsu),
        s100: String(row.s100),
        dni: String(row.dni),
        name: row.name,
        lastname: row.lastname,
        phone: row.phone ? String(row.phone) : null,
        birthday: row.birthday ? parseDate(row.birthday) : null,
        members: row.members ? Number(row.members) : 0,
        box: Number(row.box),
        declaration: String(row.declaration),
        enumerator: String(row.enumerator),
        urban: String(row.urban),
        format: row.format,
        level:
          row.level === 'P'
            ? Level.P
            : row.level === 'PE'
              ? Level.PE
              : row.level === 'PU'
                ? Level.PU
                : Level.NP,
        registered_at: row.registered_at ? parseDate(row.registered_at) : null,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      };
    });
    const result: any = [];
    for (const d of data) {
      const boxd = await this.prisma.box.findFirst({
        where: { code_num: d.box },
      });
      const declarationd = await this.prisma.declaration.findFirst({
        where: { code: d.declaration },
      });
      const enumratord = await this.prisma.enumerator.findFirst({
        where: { dni: d.enumerator },
      });
      const urband = await this.prisma.urban.findFirst({
        where: { name: d.urban },
      });
      if (!boxd)
        throw new BadRequestException(`No existe BOX con code_num: ${d.box}`);
      if (!declarationd)
        throw new BadRequestException(
          `No existe DECLARATION con code: ${d.declaration}`,
        );
      if (!enumratord)
        throw new BadRequestException(
          `No existe ENUMERATOR con dni: ${d.enumerator}`,
        );
      if (!urband)
        throw new BadRequestException(`No existe URBAN con name: ${d.urban}`);
      const { box, declaration, enumerator, urban, ...res } = d;
      result.push({
        ...res,
        box_id: boxd.id,
        declaration_id: declarationd.id,
        enumerator_id: enumratord.id,
        urban_id: urband.id,
      });
    }
    await this.prisma.registered.createMany({ data: result });
    return { success: true };
  }

  private async getRegisteredById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const registered = await this.prisma.registered.findUnique({
      where: { id },
    });
    if (!registered) throw new BadRequestException('Empadronado no encontrado');
    if (registered.deleted_at && !toogle)
      throw new BadRequestException('Empadronado eliminado');
    return registered;
  }
}
