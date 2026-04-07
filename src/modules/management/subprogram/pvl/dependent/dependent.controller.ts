import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { DependentService } from './dependent.service';
import { CreateDependentDto, FilterDependentDto, UpdateDependentDto } from './dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('pvl/dependent')
export class DependentController {
  constructor(private readonly dependentService: DependentService) {}

  @Get()
  @RequirePermission(Ability.READ, 'PVL')
  findAll(@Query() dto: FilterDependentDto) {
    return this.dependentService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'PVL')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.dependentService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'PVL')
  create(@Body() dto: CreateDependentDto) {
    return this.dependentService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'PVL')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDependentDto) {
    return this.dependentService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'PVL')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.dependentService.toggleDelete(id);
  }
}