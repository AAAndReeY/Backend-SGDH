import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, UploadedFile,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { BoxService } from './box.service';
import { CreateBoxDto, UpdateBoxDto } from './dto';
import { SuccessMessage } from '../../../../../common/decorators';
import { SearchDto } from '../../../../../common/dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('ule/box')
export class BoxController {
  constructor(private readonly boxService: BoxService) {}

  @Get()
  @RequirePermission(Ability.READ, 'ULE')
  findAll(@Query() dto: SearchDto) {
    return this.boxService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'ULE')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.boxService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'ULE')
  create(@Body() dto: CreateBoxDto) {
    return this.boxService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'ULE')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBoxDto) {
    return this.boxService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'ULE')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.boxService.toggleDelete(id);
  }

  @Post('upload')
  @RequirePermission(Ability.CREATE, 'ULE')
  @SuccessMessage('Creación masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.boxService.upload(file);
  }
}