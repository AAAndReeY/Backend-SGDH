import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, UploadedFile,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoordinatorService } from './coordinator.service';
import { CreateCoordinatorDto, FilterCoordinatorDto, UpdateCoordinatorDto } from './dto';
import { SuccessMessage } from '../../../../../common/decorators';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('pvl/coordinator')
export class CoordinatorController {
  constructor(private readonly coordinatorService: CoordinatorService) {}

  @Get()
  @RequirePermission(Ability.READ, 'PVL')
  findAll(@Query() dto: FilterCoordinatorDto) {
    return this.coordinatorService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'PVL')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coordinatorService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'PVL')
  create(@Body() dto: CreateCoordinatorDto) {
    return this.coordinatorService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'PVL')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCoordinatorDto) {
    return this.coordinatorService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'PVL')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.coordinatorService.toggleDelete(id);
  }

  @Post('upload')
  @RequirePermission(Ability.CREATE, 'PVL')
  @SuccessMessage('Creación masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.coordinatorService.upload(file);
  }
}