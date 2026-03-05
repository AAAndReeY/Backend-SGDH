import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, UploadedFile,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { LanguageService } from './language.service';
import { CreateLanguageDto, UpdateLanguageDto } from './dto';
import { SuccessMessage } from '../../../../../common/decorators';
import { SearchDto } from '../../../../../common/dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('pam/language')
export class LanguageController {
  constructor(private readonly LanguageService: LanguageService) {}

  @Get()
  @RequirePermission(Ability.READ, 'CIAM')
  findAll(@Query() dto: SearchDto) {
    return this.LanguageService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'CIAM')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.LanguageService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'CIAM')
  create(@Body() dto: CreateLanguageDto) {
    return this.LanguageService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'CIAM')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateLanguageDto) {
    return this.LanguageService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'CIAM')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.LanguageService.toggleDelete(id);
  }

  @Post('upload')
  @RequirePermission(Ability.CREATE, 'CIAM')
  @SuccessMessage('Creación masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.LanguageService.upload(file);
  }
}