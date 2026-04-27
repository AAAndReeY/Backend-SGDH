import { Injectable } from '@nestjs/common';
import { Action, Status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginationHelper, timezoneHelper } from 'src/common/helpers';

export class FilterAuditDto {
  page?: number;
  limit?: number;
  action?: Action;
  user_id?: string;
  search?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: FilterAuditDto) {
    const { action, user_id, search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (action) where.action = action;
    if (user_id) where.user_id = user_id;
    if (search) {
      where.description = { contains: String(search), mode: 'insensitive' };
    }
    return paginationHelper(
      this.prisma.audit,
      {
        where,
        orderBy: { created_at: 'desc' },
        include: {
          user: { select: { id: true, username: true, name: true, lastname: true } },
        },
      },
      { page: pagination.page ?? 1, limit: pagination.limit ?? 25 },
    );
  }

  async createRecord(data: {
    description: string;
    action: Action;
    status?: Status;
    user_id?: string;
    register_id?: string;
    field?: string;
    preview_content?: string;
    new_content?: string;
  }) {
    return this.prisma.audit.create({
      data: {
        ...data,
        status: data.status ?? 'SUCCESS',
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
  }
}
