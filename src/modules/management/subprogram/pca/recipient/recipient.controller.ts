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
import { RecipientService } from './recipient.service';
import {
  CreateRecipientDto,
  FilterRecipientDto,
  UpdateRecipientDto,
} from './dto';

@Controller('pca/recipient')
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}

  @Get()
  findAll(@Query() dto: FilterRecipientDto) {
    return this.recipientService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.recipientService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRecipientDto) {
    return this.recipientService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRecipientDto,
  ) {
    return this.recipientService.update(id, dto);
  }

  @Delete(':id')
  toggleDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.recipientService.toggleDelete(id);
  }
}
