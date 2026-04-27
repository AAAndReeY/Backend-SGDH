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
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, SetRolePermissionsDto, UpdateRoleDto } from './dto';
import { SearchDto } from '../../../common/dto';
import { AuthGuard } from '@nestjs/passport';
import { SuperAdminGuard } from 'src/common/guards/super-admin.guard';

@UseGuards(AuthGuard('jwt'), SuperAdminGuard)
@Controller('initial/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll(@Query() dto: SearchDto) {
    return this.roleService.findAll(dto);
  }

  @Get(':id/permissions')
  getPermissionsMatrix(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.getPermissionsMatrix(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Put(':id/permissions')
  setPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetRolePermissionsDto,
  ) {
    return this.roleService.setPermissions(id, dto);
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
