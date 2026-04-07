import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { DisabledService } from './disabled.service';
import { CreateDisabledDto, FilterDisabledDto, UpdateDisabledDto } from './dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('omaped/disabled')
export class DisabledController {
  constructor(private readonly disabledService: DisabledService) {}

  @Get()
  @RequirePermission(Ability.READ, 'OMAPED')
  findAll(@Query() dto: FilterDisabledDto) {
    return this.disabledService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'OMAPED')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.disabledService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'OMAPED')
  create(@Body() dto: CreateDisabledDto) {
    return this.disabledService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'OMAPED')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDisabledDto) {
    return this.disabledService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'OMAPED')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.disabledService.toggleDelete(id);
  }
}