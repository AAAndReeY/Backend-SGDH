import { BadRequestException, Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { paginationHelper, timezoneHelper } from '../../../common/helpers';
import { SearchDto } from '../../../common/dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePermissionDto): Promise<Permission> {
    const exists = await this.prisma.permission.findFirst({
      where: {
        ability: dto.ability,
        module_id: dto.module_id,
      },
    });
    if (exists) throw new BadRequestException('Este permiso ya existe para ese módulo');
    const permission = await this.prisma.permission.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getPermissionById(permission.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    return paginationHelper(
      this.prisma.permission,
      {
        where,
        orderBy: { ability: 'asc' },
        include: { module: true },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Permission> {
    return await this.getPermissionById(id);
  }

  async update(id: string, dto: UpdatePermissionDto): Promise<Permission> {
    await this.getPermissionById(id);
    await this.prisma.permission.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getPermissionById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const permission = await this.getPermissionById(id, true);
    const inactive = permission.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.permission.update({
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

  private async getPermissionById(id: string, toogle: boolean = false): Promise<any> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: { module: true }, // 👈
    });
    if (!permission) throw new BadRequestException('Permiso no encontrado');
    if (permission.deleted_at && !toogle)
      throw new BadRequestException('Permiso eliminado');
    return permission;
  }
}
