import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Program } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { SearchDto } from '../../../common/dto';
import { paginationHelper } from '../../../common/helpers';

@Injectable()
export class ProgramService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: Prisma.ProgramWhereInput = {
      deleted_at: null,
      ...(search && {
        name: { contains: search, mode: 'insensitive' },
      }),
    };
    return paginationHelper(
      this.prisma.program,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Program> {
    return await this.getProgramById(id);
  }

  private async getProgramById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const program = await this.prisma.program.findUnique({
      where: { id },
    });
    if (!program) throw new BadRequestException('Subgerencia no encontrada');
    if (program.deleted_at && !toogle)
      throw new BadRequestException('Subgerencia eliminada');
    return program;
  }
}
