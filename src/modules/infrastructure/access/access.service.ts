import { BadRequestException, Injectable } from '@nestjs/common';
import { Access } from '@prisma/client';
import { CreateAccessDto, UpdateAccessDto } from './dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { paginationHelper, timezoneHelper } from '../../../common/helpers';
import { SearchDto } from '../../../common/dto';

@Injectable()
export class AccessService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAccessDto): Promise<Access> {
    const access = await this.prisma.access.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getAccessById(access.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = String(search);
    return paginationHelper(
      this.prisma.access,
      {
        where,
        orderBy: { role_id: 'asc' },
        select: {
          id: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          permission: true,
          role: true,
        },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Access> {
    return await this.getAccessById(id);
  }

  async update(id: string, dto: UpdateAccessDto): Promise<Access> {
    await this.getAccessById(id);
    await this.prisma.access.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getAccessById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const access = await this.getAccessById(id, true);
    const inactive = access.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.access.update({
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

  private async getAccessById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const access = await this.prisma.access.findUnique({
      where: { id },
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        permission: true,
        role: true,
      },
    });
    if (!access) throw new BadRequestException('Rol-Permiso no encontrado');
    if (access.deleted_at && !toogle)
      throw new BadRequestException('Rol-Permiso eliminado');
    return access;
  }
}
