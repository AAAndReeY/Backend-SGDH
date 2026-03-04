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
}