import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Degree, Doctype } from '@prisma/client';

export class CreateDisabledDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  doc_num?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  certificate?: string;

  @IsOptional()
  @IsString()
  diagnostic1?: string;

  @IsOptional()
  @IsString()
  diagnostic2?: string;

  @IsOptional()
  @IsString()
  folio?: string;

  @IsOptional()
  @IsString()
  atention?: string;

  @IsOptional()
  @IsString()
  cert_disc?: string;

  @IsOptional()
  @IsString()
  beca?: string;

  @IsOptional()
  @IsBoolean()
  job_placement?: boolean;

  @IsOptional()
  @IsString()
  entrepreneurship?: string;

  @IsOptional()
  @IsString()
  therapy?: string;

  @IsOptional()
  @IsString()
  therapy_schedule?: string;

  @IsOptional()
  @IsString()
  reniec?: string;

  @IsOptional()
  @IsString()
  reniec_shift?: string;

  @IsOptional()
  @IsString()
  fair?: string;

  @IsOptional()
  @IsString()
  conadis?: string;

  @IsOptional()
  @IsString()
  conadis_date?: string;

  @IsOptional()
  @IsString()
  conadis_procedure?: string;

  @IsOptional()
  @IsString()
  conadis_validity?: string;

  @IsOptional()
  @IsString()
  unnamed?: string;

  @IsOptional()
  @IsString()
  contigo?: string;

  @IsOptional()
  @IsString()
  pc1000?: string;

  @IsOptional()
  @IsString()
  fad?: string;

  @IsOptional()
  @IsString()
  census_taker?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  commune?: string;

  @IsOptional()
  @IsString()
  wheelchair?: string;

  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @IsOptional()
  @IsDateString()
  registered_at?: Date;

  @IsOptional()
  @IsEnum(Degree)
  degree?: Degree;

  @IsOptional()
  @IsEnum(Doctype)
  doc_type?: Doctype;
}
