import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { paginationHelper, timezoneHelper } from '../../../common/helpers';
import { SearchDto } from '../../../common/dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const exists = await this.prisma.role.findUnique({
      where: { name: dto.name },
    });
    if (exists) throw new BadRequestException(`El rol "${dto.name}" ya existe`);
    const role = await this.prisma.role.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getRoleById(role.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = String(search);
    return paginationHelper(
      this.prisma.role,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Role> {
    return await this.getRoleById(id);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.getRoleById(id);
    if (role.is_super)
      throw new BadRequestException('Este rol no se puede actualizar');
    if (dto.name) {
      const exists = await this.prisma.role.findFirst({
        where: { name: dto.name, NOT: { id } },
      });
      if (exists) throw new BadRequestException(`El rol "${dto.name}" ya existe`);
    }
    await this.prisma.role.update({
      data: { ...dto, updated_at: timezoneHelper() },
      where: { id },
    });
    return await this.getRoleById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const role = await this.getRoleById(id, true);
    if (role.is_super)
      throw new BadRequestException('Este rol no se puede eliminar');
    const inactive = role.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.role.update({
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

  private async getRoleById(
    id: string,
    toogle: boolean = false,
  ): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!role) throw new BadRequestException('Rol no encontrado');
    if (role.deleted_at && !toogle)
      throw new BadRequestException('Rol eliminado');
    return role;
  }
}
