import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, UploadedFile,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisteredService } from './registered.service';
import { CreateRegisteredDto, FilterRegisteredDto, UpdateRegisteredDto } from './dto';
import { SuccessMessage } from '../../../../../common/decorators';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('ule/registered')
export class RegisteredController {
  constructor(private readonly registeredService: RegisteredService) {}

  @Get()
  @RequirePermission(Ability.READ, 'ULE')
  findAll(@Query() dto: FilterRegisteredDto) {
    return this.registeredService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'ULE')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.registeredService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'ULE')
  create(@Body() dto: CreateRegisteredDto) {
    return this.registeredService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'ULE')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRegisteredDto) {
    return this.registeredService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'ULE')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.registeredService.toggleDelete(id);
  }

  @Post('upload')
  @RequirePermission(Ability.CREATE, 'ULE')
  @SuccessMessage('Creación masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.registeredService.upload(file);
  }
}