import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { MotherService } from './mother.service';
import { CreateMotherDto, FilterMotherDto, UpdateMotherDto } from './dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('compromise/mother')
export class MotherController {
  constructor(private readonly motherService: MotherService) {}

  @Get()
  @RequirePermission(Ability.READ, 'COMPROMISO I')
  findAll(@Query() dto: FilterMotherDto) {
    return this.motherService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'COMPROMISO I')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.motherService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'COMPROMISO I')
  create(@Body() dto: CreateMotherDto) {
    return this.motherService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'COMPROMISO I')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMotherDto) {
    return this.motherService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'COMPROMISO I')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.motherService.toggleDelete(id);
  }
}