import { Doctype, Patientype, Sector, Sex } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
  IsEnum,
  IsUUID,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  doc_num: string;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  center?: string;

  @IsOptional()
  @IsString()
  delivery?: string;

  @IsString()
  treatment: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsString()
  assignee_doc_num?: string;

  @IsOptional()
  @IsString()
  assignee_lastname?: string;

  @IsOptional()
  @IsString()
  assignee_name?: string;

  @IsOptional()
  @IsString()
  assignee_phone?: string;

  @IsOptional()
  @IsInt()
  hampers?: number;

  @IsOptional()
  @IsBoolean()
  nutritional_assessment?: boolean;

  @IsOptional()
  @IsBoolean()
  text_message?: boolean;

  @IsOptional()
  @IsDateString()
  start_at?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsDateString()
  assignee_birthday?: string;

  @IsString()
  @IsUUID()
  census_id: string;

  @IsEnum(Doctype)
  doc_type: Doctype;

  @IsOptional()
  @IsEnum(Patientype)
  patient_type: Patientype;

  @IsOptional()
  @IsEnum(Sector)
  sector?: Sector;

  @IsEnum(Sex)
  sex: Sex;
}
