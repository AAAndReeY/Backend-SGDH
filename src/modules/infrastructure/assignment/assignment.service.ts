import { BadRequestException, Injectable } from '@nestjs/common';
import { Assignment } from '@prisma/client';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { paginationHelper, timezoneHelper } from '../../../common/helpers';
import { SearchDto } from '../../../common/dto';

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAssignmentDto): Promise<Assignment> {
    const assignment = await this.prisma.assignment.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getAssignmentById(assignment.id);
  }

  async findAll(dto: SearchDto): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = String(search);
    return paginationHelper(
      this.prisma.assignment,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Assignment> {
    return await this.getAssignmentById(id);
  }

  async update(id: string, dto: UpdateAssignmentDto): Promise<Assignment> {
    await this.getAssignmentById(id);
    await this.prisma.assignment.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getAssignmentById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const assignment = await this.getAssignmentById(id, true);
    const inactive = assignment.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.assignment.update({
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

  private async getAssignmentById(
    id: string,
    toogle: boolean = false,
  ): Promise<Assignment> {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });
    if (!assignment) throw new BadRequestException('Asignación no encontrado');
    if (assignment.deleted_at && !toogle)
      throw new BadRequestException('Asignación eliminado');
    return assignment;
  }
}
