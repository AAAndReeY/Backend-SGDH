import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
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
    const { ability, moduleName } = permission;
    const req = context.switchToHttp().getRequest();
    if (!req.user) throw new UnauthorizedException('No autenticado');

    // Super admin: el JWT ya trae is_super, no hace falta consultar la BD
    if (req.user.is_super) return true;

    const userId = req.user.sub;
    const assignment = await this.prisma.assignment.findFirst({
      where: {
        user_id: userId,
        deleted_at: null,
        OR: [
          // Asignación para un módulo específico que coincide
          {
            module: {
              name: moduleName,
              deleted_at: null,
            },
          },
          // Asignación para un programa que contiene ese módulo
          {
            program: {
              modules: {
                some: {
                  name: moduleName,
                  deleted_at: null,
                },
              },
            },
          },
          // Asignación global (sin módulo ni programa) — el rol define acceso
          {
            AND: [
              { module_id: null },
              { program_id: null },
            ],
          },
        ],
      },
      include: { role: true },
    });
    if (!assignment) {
      throw new ForbiddenException('No tiene rol asignado para este módulo');
    }
    if (assignment.role.is_super) return true;
    const access = await this.prisma.access.findFirst({
      where: {
        role_id: assignment.role_id,
        deleted_at: null,
        permission: {
          ability,
          deleted_at: null,
          module: {
            name: moduleName,
            deleted_at: null,
          },
        },
      },
    });
    if (!access) {
      throw new ForbiddenException('No tiene permisos para realizar esta acción');
    }
    return true;
  }
}