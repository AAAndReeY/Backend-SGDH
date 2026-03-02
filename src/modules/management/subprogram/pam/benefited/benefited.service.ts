import { BadRequestException, Injectable } from '@nestjs/common';
import { Benefited } from '@prisma/client';
import {
  CreateBenefitedDto,
  FilterBenefitedDto,
  UpdateBenefitedDto,
} from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { filterBenefited, selectBenefited } from './helpers';
import { ObservationService } from 'src/common/services/observation.service';

@Injectable()
export class BenefitedService {
  constructor(private readonly prisma: PrismaService,
  private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateBenefitedDto): Promise<Benefited> {
    const benefited = await this.prisma.benefited.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getBenefitedById(benefited.id);
  }

  async findAll(dto: FilterBenefitedDto): Promise<any> {
    const { where, pagination } = filterBenefited(dto);
    return paginationHelper(
      this.prisma.benefited,
      {
        where,
        orderBy: { name: 'asc' },
        select: selectBenefited(true),
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Benefited> {
    return await this.getBenefitedById(id);
  }

  async update(id: string, dto: UpdateBenefitedDto): Promise<Benefited> {
    await this.getBenefitedById(id);
    await this.prisma.benefited.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getBenefitedById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const benefited = await this.getBenefitedById(id, true);
    const inactive = benefited.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.benefited.update({
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

  private async getBenefitedById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const benefited = await this.prisma.benefited.findUnique({
      where: { id },
      select: selectBenefited(),
    });
    if (!benefited) throw new BadRequestException('Beneficiado no encontrado');
    if (benefited.deleted_at && !toogle)
      throw new BadRequestException('Beneficiado eliminado');
    return benefited;
  }
}
