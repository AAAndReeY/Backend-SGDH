import { BadRequestException, Injectable } from '@nestjs/common';
import { Disabled } from '@prisma/client';
import { CreateDisabledDto, FilterDisabledDto, UpdateDisabledDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { filterDisabled, selectDisabled } from './helpers';
import { ObservationService } from 'src/common/services/observation.service';

@Injectable()
export class DisabledService {
  constructor(private readonly prisma: PrismaService,
  private readonly observationService: ObservationService,
  ) {}
  async create(dto: CreateDisabledDto): Promise<Disabled> {
    const disabled = await this.prisma.disabled.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getDisabledById(disabled.id);
  }

  async findAll(dto: FilterDisabledDto): Promise<any> {
    const { where, pagination } = filterDisabled(dto);
    return paginationHelper(
      this.prisma.disabled,
      {
        where,
        orderBy: { lastname: 'asc' },
        select: selectDisabled(true),
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Disabled> {
    return await this.getDisabledById(id);
  }

  async update(id: string, dto: UpdateDisabledDto): Promise<Disabled> {
    await this.getDisabledById(id);
    const { observation, ...res } = dto
    await this.prisma.disabled.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    await this.observationService.syncObservation(
      id,
      observation,
      'disabled',
    );
    return await this.getDisabledById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const disabled = await this.getDisabledById(id, true);
    const inactive = disabled.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.disabled.update({
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

  private async getDisabledById(
    id: string,
    toggle: boolean = false,
  ): Promise<any> {
    const disabled = await this.prisma.disabled.findUnique({
      where: { id },
      select: selectDisabled(),
    });
    if (!disabled)
      throw new BadRequestException('Persona con discapacidad no encontrada');
    if (disabled.deleted_at && !toggle)
      throw new BadRequestException('Persona con discapacidad eliminada');
    return disabled;
  }
}
