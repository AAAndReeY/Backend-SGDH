import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { PatientService } from './patient.service';
import { CreatePatientDto, FilterPatientDto, UpdatePatientDto } from './dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('pantbc/patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @RequirePermission(Ability.READ, 'PANTBC')
  findAll(@Query() dto: FilterPatientDto) {
    return this.patientService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'PANTBC')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'PANTBC')
  create(@Body() dto: CreatePatientDto) {
    return this.patientService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'PANTBC')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePatientDto) {
    return this.patientService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'PANTBC')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientService.toggleDelete(id);
  }
}