import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, UploadedFile,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommitteeService } from './committee.service';
import { CreateCommitteeDto, FilterCommitteeDto, UpdateCommitteeDto } from './dto';
import { SuccessMessage } from '../../../../../common/decorators';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('pvl/committee')
export class CommitteeController {
  constructor(private readonly committeeService: CommitteeService) {}

  @Get()
  @RequirePermission(Ability.READ, 'PVL')
  findAll(@Query() dto: FilterCommitteeDto) {
    return this.committeeService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'PVL')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.committeeService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'PVL')
  create(@Body() dto: CreateCommitteeDto) {
    return this.committeeService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'PVL')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCommitteeDto) {
    return this.committeeService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'PVL')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.committeeService.toggleDelete(id);
  }

  @Post('upload')
  @RequirePermission(Ability.CREATE, 'PVL')
  @SuccessMessage('Creación masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.committeeService.upload(file);
  }
}