import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, UploadedFile,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeclarationService } from './declaration.service';
import { CreateDeclarationDto, UpdateDeclarationDto } from './dto';
import { SuccessMessage } from '../../../../../common/decorators';
import { SearchDto } from '../../../../../common/dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('ule/declaration')
export class DeclarationController {
  constructor(private readonly declarationService: DeclarationService) {}

  @Get()
  @RequirePermission(Ability.READ, 'ULE')
  findAll(@Query() dto: SearchDto) {
    return this.declarationService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'ULE')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.declarationService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'ULE')
  create(@Body() dto: CreateDeclarationDto) {
    return this.declarationService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'ULE')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDeclarationDto) {
    return this.declarationService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'ULE')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.declarationService.toggleDelete(id);
  }

  @Post('upload')
  @RequirePermission(Ability.CREATE, 'ULE')
  @SuccessMessage('Creación masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.declarationService.upload(file);
  }
}