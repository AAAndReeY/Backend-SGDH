import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuditService, FilterAuditDto } from './audit.service';
import { SuperAdminGuard } from 'src/common/guards/super-admin.guard';

@UseGuards(AuthGuard('jwt'), SuperAdminGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(@Query() dto: FilterAuditDto) {
    return this.auditService.findAll(dto);
  }
}
