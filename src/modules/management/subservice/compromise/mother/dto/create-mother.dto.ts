import { Doctype } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMotherDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  doc_num: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsEnum(Doctype)
  doc_type: Doctype;
}
