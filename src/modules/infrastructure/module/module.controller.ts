import {
  Body, Controller, Delete, Get, Param, ParseUUIDPipe,
  Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto, FilterModuleDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { SuperAdminGuard } from 'src/common/guards/super-admin.guard';

@UseGuards(AuthGuard('jwt'))
@Controller('module')
export class ModuleController {
  constructor(private readonly ModuleService: ModuleService) {}

  @Get()
  findAll(@Query() dto: FilterModuleDto) {
    return this.ModuleService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ModuleService.findOne(id);
  }

  @UseGuards(SuperAdminGuard)
  @Post()
  create(@Body() dto: CreateModuleDto) {
    return this.ModuleService.create(dto);
  }

  @UseGuards(SuperAdminGuard)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateModuleDto) {
    return this.ModuleService.update(id, dto);
  }

  @UseGuards(SuperAdminGuard)
  @Delete(':id')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.ModuleService.toggleDelete(id);
  }
}
