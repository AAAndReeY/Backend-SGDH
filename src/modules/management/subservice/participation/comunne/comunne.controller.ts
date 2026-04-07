import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { ComunneService } from './comunne.service';
import { CreateComunneDto, UpdateComunneDto } from './dto';
import { SearchDto } from '../../../../../common/dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('participation/comunne')
export class ComunneController {
  constructor(private readonly comunneService: ComunneService) {}

  @Get()
  @RequirePermission(Ability.READ, 'PARTICIPACION VECINAL')
  findAll(@Query() dto: SearchDto) {
    return this.comunneService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'PARTICIPACION VECINAL')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.comunneService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'PARTICIPACION VECINAL')
  create(@Body() dto: CreateComunneDto) {
    return this.comunneService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'PARTICIPACION VECINAL')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateComunneDto) {
    return this.comunneService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'PARTICIPACION VECINAL')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.comunneService.toggleDelete(id);
  }
}