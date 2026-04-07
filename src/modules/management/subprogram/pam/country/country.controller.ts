import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseUUIDPipe, UploadedFile,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Ability } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CountryService } from './country.service';
import { CreateCountryDto, UpdateCountryDto } from './dto';
import { SuccessMessage } from '../../../../../common/decorators';
import { SearchDto } from '../../../../../common/dto';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../../../common/decorators/require-permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('pam/country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @RequirePermission(Ability.READ, 'CIAM')
  findAll(@Query() dto: SearchDto) {
    return this.countryService.findAll(dto);
  }

  @Get(':id')
  @RequirePermission(Ability.READ, 'CIAM')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.countryService.findOne(id);
  }

  @Post()
  @RequirePermission(Ability.CREATE, 'CIAM')
  create(@Body() dto: CreateCountryDto) {
    return this.countryService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(Ability.UPDATE, 'CIAM')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCountryDto) {
    return this.countryService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(Ability.DELETE, 'CIAM')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.countryService.toggleDelete(id);
  }

  @Post('upload')
  @RequirePermission(Ability.CREATE, 'CIAM')
  @SuccessMessage('Creación masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.countryService.upload(file);
  }
}