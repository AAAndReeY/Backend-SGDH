import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProgramService } from './program.service';
import { SearchDto } from '../../../common/dto';

@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get()
  findAll(@Query() dto: SearchDto) {
    return this.programService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.programService.findOne(id);
  }
}
