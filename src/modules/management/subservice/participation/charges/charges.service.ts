import { BadRequestException, Injectable } from '@nestjs/common';
import { Charges } from '@prisma/client';
import { CreateChargesDto, UpdateChargesDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { SearchDto } from '../../../../../common/dto';

@Injectable()
export class ChargesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChargesDto): Promise<Charges> {
    const charges = await this.prisma.charges.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getChargesById(charges.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = String(search);
    return paginationHelper(
      this.prisma.charges,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Charges> {
    return await this.getChargesById(id);
  }

  async update(id: string, dto: UpdateChargesDto): Promise<Charges> {
    await this.getChargesById(id);
    await this.prisma.charges.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getChargesById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const charges = await this.getChargesById(id, true);
    const inactive = charges.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.charges.update({
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

  private async getChargesById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const charges = await this.prisma.charges.findUnique({
      where: { id },
    });
    if (!charges) throw new BadRequestException('Padrón no encontrado');
    if (charges.deleted_at && !toogle)
      throw new BadRequestException('Padrón eliminado');
    return charges;
  }
}
