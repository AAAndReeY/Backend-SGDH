import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, UploadedFile,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { TownService } from './town.service';
import { CreateTownDto, UpdateTownDto } from './dto';
import { SuccessMessage } from '../../../../../common/decorators';
import { SearchDto } from '../../../../../common/dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('pvl/town')
export class TownController {
  constructor(private readonly townService: TownService) {}

  @Get()
  @RequirePermission(Ability.READ, 'PVL')
  findAll(@Query() dto: SearchDto) {
    return this.townService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'PVL')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.townService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'PVL')
  create(@Body() dto: CreateTownDto) {
    return this.townService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'PVL')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTownDto) {
    return this.townService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'PVL')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.townService.toggleDelete(id);
  }

  @Post('upload')
  @RequirePermission(Ability.CREATE, 'PVL')
  @SuccessMessage('Creación masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.townService.upload(file);
  }
}