import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, UploadedFile,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoupleService } from './couple.service';
import { CreateCoupleDto, UpdateCoupleDto } from './dto';
import { SuccessMessage } from '../../../../../common/decorators';
import { SearchDto } from '../../../../../common/dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('pvl/couple')
export class CoupleController {
  constructor(private readonly coupleService: CoupleService) {}

  @Get()
  @RequirePermission(Ability.READ, 'PVL')
  findAll(@Query() dto: SearchDto) {
    return this.coupleService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'PVL')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coupleService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'PVL')
  create(@Body() dto: CreateCoupleDto) {
    return this.coupleService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'PVL')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCoupleDto) {
    return this.coupleService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'PVL')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.coupleService.toggleDelete(id);
  }

  @Post('upload')
  @RequirePermission(Ability.CREATE, 'PVL')
  @SuccessMessage('Creación masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.coupleService.upload(file);
  }
}