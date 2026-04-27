import {
  Controller, Get, Patch, Delete,
  Param, Body, Query, UseGuards, Req, ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SuperAdminGuard } from 'src/common/guards/super-admin.guard';
import { SearchDto } from 'src/common/dto';

@UseGuards(AuthGuard('jwt'), SuperAdminGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() dto: SearchDto) {
    return this.userService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.userService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.userService.toggleDelete(id, req.user.sub);
  }
}
