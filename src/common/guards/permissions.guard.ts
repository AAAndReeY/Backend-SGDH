import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { REQUIRE_PERMISSION_KEY } from '../decorators/require-permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get(
      REQUIRE_PERMISSION_KEY,
      context.getHandler(),
    );

    if (!permission) return true;
    const { ability, module } = permission;
    const req = context.switchToHttp().getRequest();
    const userId = req.user.user_id;
    const assignment = await this.prisma.assignment.findFirst({
      where: {
        user_id: userId,
        deleted_at: null,
      },
      include: {
        role: true,
      },
    });
    if (!assignment) {
      throw new ForbiddenException('No tiene rol asignado');
    }
    if (assignment.role.is_super) {
      return true;
    }
    const access = await this.prisma.access.findFirst({
      where: {
        role_id: assignment.role_id,
        permission: {
          ability,
          module: {
            name: module,
          },
        },
      },
    });
    if (!access) {
      throw new ForbiddenException('No tiene permisos');
    }
    return true;
  }
}