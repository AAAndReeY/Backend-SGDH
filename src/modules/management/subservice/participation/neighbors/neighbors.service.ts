import { BadRequestException, Injectable } from '@nestjs/common';
import { Neighbors, President, Sex } from '@prisma/client';
import {
  CreateNeighborsDto,
  FilterNeighborsDto,
  UpdateNeighborsDto,
} from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { filterNeighbors } from './helpers';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { ObservationService } from 'src/common/services/observation.service';

@Injectable()
export class NeighborsService {
  constructor(private readonly prisma: PrismaService,
  private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateNeighborsDto): Promise<President> {
    const neighbors = await this.prisma.neighbors.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getNeighborsById(neighbors.id);
  }

  async findAll(dto: FilterNeighborsDto): Promise<any> {
    const { where, pagination } = filterNeighbors(dto);
    return paginationHelper(
      this.prisma.neighbors,
      {
        where,
        orderBy: { lastname: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Neighbors> {
    return await this.getNeighborsById(id);
  }

  async update(id: string, dto: UpdateNeighborsDto): Promise<Neighbors> {
    await this.getNeighborsById(id);
    const { observation, ...res } = dto
    await this.prisma.neighbors.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    await this.observationService.syncObservation(
      id,
      observation,
      'neighbors',
    )
    return await this.getNeighborsById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const neighbors = await this.getNeighborsById(id, true);
    const inactive = neighbors.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.neighbors.update({
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

  private async getNeighborsById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const neighbors = await this.prisma.neighbors.findUnique({
      where: { id },
    });
    if (!neighbors) throw new BadRequestException('Presidente no encontrado');
    if (neighbors.deleted_at && !toogle)
      throw new BadRequestException('Presidente eliminado');
    return neighbors;
  }
}
