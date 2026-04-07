import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, UploadedFile,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { EnumeratorService } from './enumerator.service';
import { CreateEnumeratorDto, UpdateEnumeratorDto } from './dto';
import { SuccessMessage } from '../../../../../common/decorators';
import { SearchDto } from '../../../../../common/dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('ule/enumerator')
export class EnumeratorController {
  constructor(private readonly enumeratorService: EnumeratorService) {}

  @Get()
  @RequirePermission(Ability.READ, 'ULE')
  findAll(@Query() dto: SearchDto) {
    return this.enumeratorService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'ULE')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.enumeratorService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'ULE')
  create(@Body() dto: CreateEnumeratorDto) {
    return this.enumeratorService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'ULE')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEnumeratorDto) {
    return this.enumeratorService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'ULE')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.enumeratorService.toggleDelete(id);
  }

  @Post('upload')
  @RequirePermission(Ability.CREATE, 'ULE')
  @SuccessMessage('Creación masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.enumeratorService.upload(file);
  }
}