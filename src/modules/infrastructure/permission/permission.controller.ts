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
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { SearchDto } from '../../../common/dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('initial/permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  findAll(@Query() dto: SearchDto) {
    return this.permissionService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, dto);
  }

  @Delete(':id')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionService.toggleDelete(id);
  }
}
