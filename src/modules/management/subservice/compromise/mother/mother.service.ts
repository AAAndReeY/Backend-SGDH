import { BadRequestException, Injectable } from '@nestjs/common';
import { Mother } from '@prisma/client';
import { CreateMotherDto, FilterMotherDto, UpdateMotherDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  parseDate,
  timezoneHelper,
} from '../../../../../common/helpers';
import { filterMother } from './helpers';
import { ObservationService } from 'src/common/services/observation.service';

@Injectable()
export class MotherService {
  constructor(private readonly prisma: PrismaService,
  private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateMotherDto): Promise<Mother> {
    const { birthday, ...res } = dto;
    const mother = await this.prisma.mother.create({
      data: {
        ...res,
        ...(birthday && { birthday: parseDate(birthday) }),
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getMotherById(mother.id);
  }

  async findAll(dto: FilterMotherDto): Promise<any> {
    const { where, pagination } = filterMother(dto);
    return paginationHelper(
      this.prisma.mother,
      {
        where,
        orderBy: { lastname: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Mother> {
    return await this.getMotherById(id);
  }

  async update(id: string, dto: UpdateMotherDto): Promise<Mother> {
    await this.getMotherById(id);
    const { observation, birthday, ...res } = dto;
    await this.prisma.mother.update({
      data: {
        ...res,
        ...(birthday && { birthday: parseDate(birthday) }),
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    await this.observationService.syncObservation(
      id,
      observation,
      'mother',
    );
    return await this.getMotherById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const mother = await this.getMotherById(id, true);
    const inactive = mother.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.mother.update({
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

  private async getMotherById(
    id: string,
    toggle: boolean = false,
  ): Promise<any> {
    const mother = await this.prisma.mother.findUnique({
      where: { id },
    });
    if (!mother) throw new BadRequestException('Madre no encontrada');
    if (mother.deleted_at && !toggle)
      throw new BadRequestException('Madre eliminada');
    return mother;
  }
}
