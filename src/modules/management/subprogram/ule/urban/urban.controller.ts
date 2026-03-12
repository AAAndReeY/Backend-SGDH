import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, UploadedFile,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { UrbanService } from './urban.service';
import { CreateUrbanDto, UpdateUrbanDto } from './dto';
import { SuccessMessage } from '../../../../../common/decorators';
import { SearchDto } from '../../../../../common/dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('ule/urban')
export class UrbanController {
  constructor(private readonly urbanService: UrbanService) {}

  @Get()
  @RequirePermission(Ability.READ, 'ULE')
  findAll(@Query() dto: SearchDto) {
    return this.urbanService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'ULE')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.urbanService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'ULE')
  create(@Body() dto: CreateUrbanDto) {
    return this.urbanService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'ULE')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUrbanDto) {
    return this.urbanService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'ULE')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.urbanService.toggleDelete(id);
  }

  @Post('upload')
  @RequirePermission(Ability.CREATE, 'ULE')
  @SuccessMessage('Creación masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.urbanService.upload(file);
  }
}