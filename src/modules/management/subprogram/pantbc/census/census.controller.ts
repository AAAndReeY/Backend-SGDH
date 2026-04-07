import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { CensusService } from './census.service';
import { CreateCensusDto, UpdateCensusDto } from './dto';
import { SearchDto } from '../../../../../common/dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('pantbc/census')
export class CensusController {
  constructor(private readonly censusService: CensusService) {}

  @Get()
  @RequirePermission(Ability.READ, 'PANTBC')
  findAll(@Query() dto: SearchDto) {
    return this.censusService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'PANTBC')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.censusService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'PANTBC')
  create(@Body() dto: CreateCensusDto) {
    return this.censusService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'PANTBC')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCensusDto) {
    return this.censusService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'PANTBC')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.censusService.toggleDelete(id);
  }
}