import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { SupService } from './sup.service';
import { CreateSupDto, FilterSupDto, UpdateSupDto } from './dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('support/sup')
export class SupController {
  constructor(private readonly supService: SupService) {}

  @Get()
  @RequirePermission(Ability.READ, 'SUP')
  findAll(@Query() dto: FilterSupDto) {
    return this.supService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'SUP')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.supService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'SUP')
  create(@Body() dto: CreateSupDto) {
    return this.supService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'SUP')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSupDto) {
    return this.supService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'SUP')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.supService.toggleDelete(id);
  }
}