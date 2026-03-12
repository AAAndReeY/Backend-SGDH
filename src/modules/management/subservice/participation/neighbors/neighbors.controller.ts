import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { NeighborsService } from './neighbors.service';
import { CreateNeighborsDto, FilterNeighborsDto, UpdateNeighborsDto } from './dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('participation/neighbors')
export class NeighborsController {
  constructor(private readonly neighborsService: NeighborsService) {}

  @Get()
  @RequirePermission(Ability.READ, 'PARTICIPACION VECINAL')
  findAll(@Query() dto: FilterNeighborsDto) {
    return this.neighborsService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'PARTICIPACION VECINAL')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.neighborsService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'PARTICIPACION VECINAL')
  create(@Body() dto: CreateNeighborsDto) {
    return this.neighborsService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'PARTICIPACION VECINAL')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateNeighborsDto) {
    return this.neighborsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'PARTICIPACION VECINAL')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.neighborsService.toggleDelete(id);
  }
}