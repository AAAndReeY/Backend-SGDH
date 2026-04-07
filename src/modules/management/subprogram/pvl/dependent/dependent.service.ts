import { BadRequestException, Injectable } from '@nestjs/common';
import { Dependent } from '@prisma/client';
import {
  CreateDependentDto,
  FilterDependentDto,
  UpdateDependentDto,
} from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  parseDate,
  timezoneHelper,
} from '../../../../../common/helpers';
import { filterDependent, selectDependent } from './helpers';
import { ObservationService } from 'src/common/services/observation.service';

@Injectable()
export class DependentService {
  constructor(private readonly prisma: PrismaService,
  private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateDependentDto): Promise<Dependent> {
    const { birthday, breastfeeding_end_at, due_at, start_at, ...res } = dto;
    const dependent = await this.prisma.dependent.create({
      data: {
        ...res,
        ...(birthday && { birthday: parseDate(birthday) }),
        ...(breastfeeding_end_at && {
          breastfeeding_end_at: parseDate(breastfeeding_end_at),
        }),
        ...(due_at && { due_at: parseDate(due_at) }),
        ...(start_at && { start_at: parseDate(start_at) }),
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getDependentById(dependent.id);
  }

  async findAll(dto: FilterDependentDto): Promise<any> {
    const { where, pagination } = filterDependent(dto);
    return paginationHelper(
      this.prisma.dependent,
      {
        where,
        orderBy: { lastname: 'asc' },
        select: selectDependent(true),
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Dependent> {
    return await this.getDependentById(id);
  }

  async update(id: string, dto: UpdateDependentDto): Promise<Dependent> {
    await this.getDependentById(id);
    const { observation, birthday, breastfeeding_end_at, due_at, start_at, ...res } = dto;
    await this.prisma.dependent.update({
      data: {
        ...res,
        ...(birthday && { birthday: parseDate(birthday) }),
        ...(breastfeeding_end_at && {
          breastfeeding_end_at: parseDate(breastfeeding_end_at),
        }),
        ...(due_at && { due_at: parseDate(due_at) }),
        ...(start_at && { start_at: parseDate(start_at) }),
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    await this.observationService.syncObservation(
      id,
      observation,
      'dependent',
    )
    return await this.getDependentById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const dependent = await this.getDependentById(id, true);
    const inactive = dependent.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.dependent.update({
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

  private async getDependentById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const dependent = await this.prisma.dependent.findUnique({
      where: { id },
      select: selectDependent(),
    });
    if (!dependent)
      throw new BadRequestException(
        'Beneficiario de Vaso de Leche no encontrado',
      );
    if (dependent.deleted_at && !toogle)
      throw new BadRequestException('Beneficiario de Vaso de Leche eliminado');
    return dependent;
  }
}
