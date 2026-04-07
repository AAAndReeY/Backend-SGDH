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
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { SearchDto } from '../../../common/dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('initial/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll(@Query() dto: SearchDto) {
    return this.roleService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.toggleDelete(id);
  }
}
