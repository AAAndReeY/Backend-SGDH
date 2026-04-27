import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException('Usuario o email ya existe');
    }

    const user = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: createUserDto.password,
        name: createUserDto.name,
        lastname: createUserDto.lastname,
        email: createUserDto.email,
      },
    });

    return {
      message: 'Usuario creado correctamente',
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const assignment = await this.prisma.assignment.findFirst({
      where: {
        user_id: user.id,
        deleted_at: null,
      },
      include: {
        role: true,
      },
    });
    if (!assignment) {
      throw new UnauthorizedException('Usuario sin rol asignado');
    }
    const payload = {
      sub: user.id,
      username: user.username,
      role: assignment.role.name,
      is_super: assignment.role.is_super,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getMyRoles(userId: string) {
  return this.prisma.assignment.findMany({
    where: {
      user_id: userId,
      deleted_at: null,
    },
    include: {
      role: true,
      module: true,
      program: true,
    },
  });
}

async getMe(userId: string) {
  const userRecord = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, name: true, lastname: true, email: true },
  });

  const assignments = await this.prisma.assignment.findMany({
    where: {
      user_id: userId,
      deleted_at: null,
    },
    include: {
      role: {
        include: {
          accesses: {
            where: { deleted_at: null },
            include: {
              permission: {
                include: { module: true },
              },
            },
          },
        },
      },
      module: true,
    },
  });

  const isSuperAdmin = assignments.some((a) => a.role.is_super);
  const roleName = assignments[0]?.role.name ?? null;

  if (isSuperAdmin) {
    const allModules = await this.prisma.module.findMany({
      where: { deleted_at: null },
    });
    return {
      user: userRecord,
      is_super: true,
      role: roleName,
      modules: allModules.map((m) => ({
        id: m.id,
        name: m.name,
        abilities: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      })),
    };
  }

  // Build a deduplicated module map from role accesses and assignment module
  const moduleMap = new Map<string, { id: string; name: string; abilities: Set<string> }>();

  for (const a of assignments) {
    if (a.module) {
      // Assignment is scoped to a specific module
      const entry = moduleMap.get(a.module.id) ?? { id: a.module.id, name: a.module.name, abilities: new Set<string>() };
      const scopedAbilities = a.role.accesses
        .filter((ac) => ac.permission.module_id === a.module!.id)
        .map((ac) => ac.permission.ability as string);
      // If no scoped permissions found, fall back to all role accesses
      const abilities = scopedAbilities.length ? scopedAbilities : a.role.accesses.map((ac) => ac.permission.ability as string);
      abilities.forEach((ab) => entry.abilities.add(ab));
      moduleMap.set(a.module.id, entry);
    } else {
      // No module restriction — grant access to all modules the role has permissions for
      for (const ac of a.role.accesses) {
        const mod = ac.permission.module;
        if (!mod) continue;
        const entry = moduleMap.get(mod.id) ?? { id: mod.id, name: mod.name, abilities: new Set<string>() };
        entry.abilities.add(ac.permission.ability as string);
        moduleMap.set(mod.id, entry);
      }
    }
  }

  const modules = Array.from(moduleMap.values()).map((m) => ({
    id: m.id,
    name: m.name,
    abilities: Array.from(m.abilities),
  }));

  return {
    user: userRecord,
    is_super: false,
    role: roleName,
    modules,
  };
}
}