import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { WorkshopService } from './workshop.service';
import { CreateWorkshopDto, UpdateWorkshopDto } from './dto';
import { SearchDto } from '../../../../../common/dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('recreation/workshop')
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @Get()
  @RequirePermission(Ability.READ, 'CULTURA Y DEPORTE')
  findAll(@Query() dto: SearchDto) {
    return this.workshopService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'CULTURA Y DEPORTE')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.workshopService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'CULTURA Y DEPORTE')
  create(@Body() dto: CreateWorkshopDto) {
    return this.workshopService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'CULTURA Y DEPORTE')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateWorkshopDto) {
    return this.workshopService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'CULTURA Y DEPORTE')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.workshopService.toggleDelete(id);
  }
}