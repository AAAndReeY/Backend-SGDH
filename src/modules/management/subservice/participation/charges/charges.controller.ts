import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { ChargesService } from './charges.service';
import { CreateChargesDto, UpdateChargesDto } from './dto';
import { SearchDto } from '../../../../../common/dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('participation/charges')
export class ChargesController {
  constructor(private readonly chargesService: ChargesService) {}

  @Get()
  @RequirePermission(Ability.READ, 'PARTICIPACION VECINAL')
  findAll(@Query() dto: SearchDto) {
    return this.chargesService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'PARTICIPACION VECINAL')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.chargesService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'PARTICIPACION VECINAL')
  create(@Body() dto: CreateChargesDto) {
    return this.chargesService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'PARTICIPACION VECINAL')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateChargesDto) {
    return this.chargesService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'PARTICIPACION VECINAL')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.chargesService.toggleDelete(id);
  }
}