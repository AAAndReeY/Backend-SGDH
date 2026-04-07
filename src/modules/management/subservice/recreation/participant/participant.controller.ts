import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto, FilterParticipantDto, UpdateParticipantDto } from './dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('recreation/participant')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Get()
  @RequirePermission(Ability.READ, 'CULTURA Y DEPORTE')
  findAll(@Query() dto: FilterParticipantDto) {
    return this.participantService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'CULTURA Y DEPORTE')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.participantService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'CULTURA Y DEPORTE')
  create(@Body() dto: CreateParticipantDto) {
    return this.participantService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'CULTURA Y DEPORTE')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateParticipantDto) {
    return this.participantService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'CULTURA Y DEPORTE')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.participantService.toggleDelete(id);
  }
}