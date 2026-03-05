import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { ModuleService } from './module.service';
import { FilterModuleDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

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
}
