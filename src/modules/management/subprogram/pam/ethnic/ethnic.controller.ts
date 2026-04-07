import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, UploadedFile,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { EthnicService } from './ethnic.service';
import { CreateEthnicDto, UpdateEthnicDto } from './dto';
import { SuccessMessage } from '../../../../../common/decorators';
import { SearchDto } from '../../../../../common/dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('pam/ethnic')
export class EthnicController {
  constructor(private readonly EthnicService: EthnicService) {}

  @Get()
  @RequirePermission(Ability.READ, 'CIAM')
  findAll(@Query() dto: SearchDto) {
    return this.EthnicService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'CIAM')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.EthnicService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE,'CIAM')
  create(@Body() dto: CreateEthnicDto) {
    return this.EthnicService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'CIAM')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEthnicDto) {
    return this.EthnicService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'CIAM')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.EthnicService.toggleDelete(id);
  }

  @Post('upload')
  @RequirePermission(Ability.CREATE, 'CIAM')
  @SuccessMessage('Creación masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.EthnicService.upload(file);
  }
}