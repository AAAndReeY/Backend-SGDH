import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { SupService } from './sup.service';
import { CreateSupDto, FilterSupDto, UpdateSupDto } from './dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('camsup/sup')
export class SupController {
  constructor(private readonly supService: SupService) {}

  @Get()
  @RequirePermission(Ability.READ, 'CAMSUP')
  findAll(@Query() dto: FilterSupDto) {
    return this.supService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'CAMSUP')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.supService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'CAMSUP')
  create(@Body() dto: CreateSupDto) {
    return this.supService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'CAMSUP')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSupDto) {
    return this.supService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'CAMSUP')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.supService.toggleDelete(id);
  }
}