import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { BenefitedService } from './benefited.service';
import { CreateBenefitedDto, FilterBenefitedDto, UpdateBenefitedDto } from './dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('pam/benefited')
export class BenefitedController {
  constructor(private readonly benefitedService: BenefitedService) {}

  @Get()
  @RequirePermission(Ability.READ, 'CIAM')
  findAll(@Query() dto: FilterBenefitedDto) {
    return this.benefitedService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'CIAM')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.benefitedService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'CIAM')
  create(@Body() dto: CreateBenefitedDto) {
    return this.benefitedService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'CIAM')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBenefitedDto) {
    return this.benefitedService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'CIAM')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.benefitedService.toggleDelete(id);
  }
}