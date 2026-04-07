import {
  Controller, Get, Body, Patch,
  Param, Query, ParseUUIDPipe, Req, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { GeneralService } from './general.service';
import { FilterGeneralDto } from './dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('general')
export class GeneralController {
  constructor(private readonly generalService: GeneralService) {}

  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Get()
  @RequirePermission(Ability.READ, 'general')
  findAll(@Query() dto: FilterGeneralDto) {
    return this.generalService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'general')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.generalService.findOne(id);
  }

  @Patch('send/:id')
  @RequirePermission(Ability.UPDATE, 'general')
  sendMessage(@Param('id') id: string, @Body() dto: { message: string }) {
    return this.generalService.sendMessage(id, dto.message);
  }

  @Patch('answer/:id')
  @RequirePermission(Ability.UPDATE, 'general')
  sendanswer(@Param('id') id: string, @Body() dto: { answer: string }) {
    return this.generalService.answerMessage(id, dto.answer);
  }

  @Patch('observation')
  @RequirePermission(Ability.UPDATE, 'general')
  updateObservation(
    @Body('citizen_id') citizen_id: string,
    @Body('observation') observation: string,
  ) {
    return this.generalService.updateObservation(citizen_id, observation);
  }
}