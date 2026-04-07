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
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto';
import { SearchDto } from '../../../common/dto';

@Controller('initial/assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get()
  findAll(@Query() dto: SearchDto) {
    return this.assignmentService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAssignmentDto) {
    return this.assignmentService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAssignmentDto,
  ) {
    return this.assignmentService.update(id, dto);
  }

  @Delete(':id')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentService.toggleDelete(id);
  }
}
