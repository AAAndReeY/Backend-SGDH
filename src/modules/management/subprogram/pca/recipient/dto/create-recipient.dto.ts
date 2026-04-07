import { Doctype, Modality, Sex, Social } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateRecipientDto {
  @IsString()
  doc_num: string;

  @IsString()
  lastname: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsBoolean()
  pregnant?: boolean;

  @IsOptional()
  @IsBoolean()
  disabled?: boolean;

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
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsDateString()
  registered_at?: string;

  @IsOptional()
  @IsUUID()
  center_id?: string;

  @IsEnum(Doctype)
  doc_type: Doctype;

  @IsEnum(Modality)
  modality: Modality;

  @IsEnum(Sex)
  sex: Sex;

  @IsOptional()
  @IsEnum(Social)
  social?: Social;
}
