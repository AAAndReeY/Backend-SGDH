import { Doctype } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class CreateDependentDto {
  @IsString()
  committee: string;

  @IsString()
  doc_num: string;

  @IsString()
  lastname: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  bond?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsString()
  semester_leave?: string;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsInt()
  pregnant_weeks?: number;

  @IsOptional()
  @IsBoolean()
  pregnant?: boolean;

  @IsOptional()
  @IsBoolean()
  disabled?: boolean;

  @IsOptional()
  @IsBoolean()
  tbc?: boolean;

  @IsOptional()
  @IsBoolean()
  malnutrition?: boolean;

  @IsOptional()
  @IsDateString()
  breastfeeding_end_at?: string;

  @IsOptional()
  @IsDateString()
  due_at?: string;

  @IsOptional()
  @IsDateString()
  start_at?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsEnum(Doctype)
  doc_type: Doctype;
}
