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
import { DirectiveService } from './directive.service';
import { CreateDirectiveDto, UpdateDirectiveDto } from './dto';
import { SuccessMessage } from '../../../../../common/decorators';
import { SearchDto } from '../../../../../common/dto';

@Controller('pca/directive')
export class DirectiveController {
  constructor(private readonly directiveService: DirectiveService) {}

  @Get()
  findAll(@Query() dto: SearchDto) {
    return this.directiveService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.directiveService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDirectiveDto) {
    return this.directiveService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDirectiveDto,
  ) {
    return this.directiveService.update(id, dto);
  }

  @Delete(':id')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.directiveService.toggleDelete(id);
  }

  @Post('upload')
  @SuccessMessage('Creación masiva exitosa')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.directiveService.upload(file);
  }
}
