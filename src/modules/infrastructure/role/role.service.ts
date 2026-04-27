import { BadRequestException, Injectable } from '@nestjs/common';
import { Ability, Role } from '@prisma/client';
import { CreateRoleDto, SetRolePermissionsDto, UpdateRoleDto } from './dto';
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

  async getPermissionsMatrix(roleId: string): Promise<any> {
    const role = await this.getRoleById(roleId);

    const [modules, accesses] = await Promise.all([
      this.prisma.module.findMany({
        where: { deleted_at: null },
        orderBy: [{ program: { name: 'asc' } }, { name: 'asc' }],
        include: { program: true },
      }),
      this.prisma.access.findMany({
        where: { role_id: roleId, deleted_at: null },
        include: { permission: true },
      }),
    ]);

    const abilities: Ability[] = ['CREATE', 'READ', 'UPDATE', 'DELETE'];

    return {
      role,
      modules: modules.map((mod) => ({
        id: mod.id,
        name: mod.name,
        program: mod.program?.name ?? null,
        permissions: Object.fromEntries(
          abilities.map((ability) => {
            const access = accesses.find(
              (a) =>
                a.permission.module_id === mod.id &&
                a.permission.ability === ability,
            );
            return [
              ability,
              { access_id: access?.id ?? null, enabled: !!access },
            ];
          }),
        ),
      })),
    };
  }

  async setPermissions(
    roleId: string,
    dto: SetRolePermissionsDto,
  ): Promise<any> {
    const role = await this.getRoleById(roleId);
    if (role.is_super)
      throw new BadRequestException(
        'No se pueden modificar permisos del super admin',
      );

    // Hard-delete all existing accesses for this role
    await this.prisma.access.deleteMany({ where: { role_id: roleId } });

    for (const item of dto.permissions) {
      // Find or create the Permission record
      let permission = await this.prisma.permission.findFirst({
        where: { module_id: item.module_id, ability: item.ability },
      });

      if (!permission) {
        permission = await this.prisma.permission.create({
          data: {
            module_id: item.module_id,
            ability: item.ability,
            created_at: timezoneHelper(),
            updated_at: timezoneHelper(),
          },
        });
      } else if (permission.deleted_at) {
        permission = await this.prisma.permission.update({
          where: { id: permission.id },
          data: { deleted_at: null, updated_at: timezoneHelper() },
        });
      }

      // Create the Access record
      await this.prisma.access.create({
        data: {
          role_id: roleId,
          permission_id: permission.id,
          created_at: timezoneHelper(),
          updated_at: timezoneHelper(),
        },
      });
    }

    return this.getPermissionsMatrix(roleId);
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
