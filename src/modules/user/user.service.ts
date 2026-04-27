import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginationHelper, timezoneHelper } from 'src/common/helpers';
import { SearchDto } from 'src/common/dto';
import { UpdateUserDto } from './dto/update-user.dto';

const USER_SELECT = {
  id: true,
  username: true,
  name: true,
  lastname: true,
  email: true,
  dni: true,
  phone: true,
  created_at: true,
  deleted_at: true,
  assignments: {
    where: { deleted_at: null },
    include: {
      role: { select: { id: true, name: true, is_super: true } },
      module: { select: { id: true, name: true } },
      program: { select: { id: true, name: true } },
    },
  },
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: SearchDto) {
    const { search, ...pagination } = dto;
    const where: any = {};
    if (search) {
      where.OR = [
        { username: { contains: String(search), mode: 'insensitive' } },
        { name: { contains: String(search), mode: 'insensitive' } },
        { lastname: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    return paginationHelper(
      this.prisma.user,
      { where, orderBy: { created_at: 'desc' }, select: USER_SELECT },
      pagination,
    );
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
    if (!user) throw new BadRequestException('Usuario no encontrado');
    return user;
  }

  async update(id: string, dto: UpdateUserDto, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('Usuario no encontrado');

    await this.prisma.user.update({
      where: { id },
      data: { ...dto, updated_at: timezoneHelper() },
    });

    await this.prisma.audit.create({
      data: {
        description: `Usuario actualizado: ${user.username}`,
        register_id: id,
        action: 'UPDATE',
        status: 'SUCCESS',
        user_id: adminId,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });

    return this.findOne(id);
  }

  async toggleDelete(id: string, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('Usuario no encontrado');

    const deleted_at = user.deleted_at ? null : timezoneHelper();
    await this.prisma.user.update({
      where: { id },
      data: { deleted_at, updated_at: timezoneHelper() },
    });

    const action = user.deleted_at ? 'RESTORE' : 'DELETE';
    await this.prisma.audit.create({
      data: {
        description: `Usuario ${user.deleted_at ? 'restaurado' : 'eliminado'}: ${user.username}`,
        register_id: id,
        action,
        status: 'SUCCESS',
        user_id: adminId,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });

    return { action, id };
  }

  async getMyRoles(userId: string) {
    return this.prisma.assignment.findMany({
      where: { user_id: userId, deleted_at: null },
      include: { role: true, module: true, program: true },
    });
  }
}
