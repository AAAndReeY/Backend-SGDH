import { Controller, Get, Body, Patch, Param, Query, ParseUUIDPipe, Req } from '@nestjs/common';
import { GeneralService } from './general.service';
import { FilterGeneralDto } from './dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { Ability } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('general')
export class GeneralController {
  constructor(private readonly generalService: GeneralService) {}

  @Get('profile')
  getProfile(@Req() req: any) {
  return req.user;
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  @RequirePermission(Ability.READ, 'general')
  findAll(@Query() dto: FilterGeneralDto) {
    return this.generalService.findAll(dto);
  }

  /* @Get()
  findAll(@Query() dto: FilterGeneralDto) {
    return this.generalService.findAll(dto);
  } */

  @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.generalService.findOne(id);
  }

  @Patch('send/:id')
  sendMessage(@Param('id') id: string, @Body() dto: { message: string }) {
    return this.generalService.sendMessage(id, dto.message);
  }

  @Patch('answer/:id')
  sendanswer(@Param('id') id: string, @Body() dto: { answer: string }) {
    return this.generalService.answerMessage(id, dto.answer);
  }

  @Patch('observation')
  updateObservation(
  @Body('citizen_id') citizen_id: string,
  @Body('observation') observation: string,
) {
  return this.generalService.updateObservation(citizen_id, observation);
}
}
