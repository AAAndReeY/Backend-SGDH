import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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