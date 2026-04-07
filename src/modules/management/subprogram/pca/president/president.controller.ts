import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PresidentService } from './president.service';
import {
  CreatePresidentDto,
  FilterPresidentDto,
  UpdatePresidentDto,
} from './dto';
import { SuccessMessage } from '../../../../../common/decorators';

@Controller('pca/president')
export class PresidentController {
  constructor(private readonly presidentService: PresidentService) {}

  @Get()
  findAll(@Query() dto: FilterPresidentDto) {
    return this.presidentService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.presidentService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePresidentDto) {
    return this.presidentService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePresidentDto,
  ) {
    return this.presidentService.update(id, dto);
  }

  @Delete(':id')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.presidentService.toggleDelete(id);
  }

  @Post('upload')
  @SuccessMessage('Creacion masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.presidentService.upload(file);
  }
}
