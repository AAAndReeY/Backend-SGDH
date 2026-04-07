import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessService } from './access.service';
import { CreateAccessDto, UpdateAccessDto } from './dto';
import { SearchDto } from '../../../common/dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('initial/access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get()
  findAll(@Query() dto: SearchDto) {
    return this.accessService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAccessDto) {
    return this.accessService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccessDto,
  ) {
    return this.accessService.update(id, dto);
  }

  @Delete(':id')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessService.toggleDelete(id);
  }
}
