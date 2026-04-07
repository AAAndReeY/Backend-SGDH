import {
  Civil,
  Doctype,
  Health,
  Level,
  Living,
  Mode,
  Sex,
} from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { SearchDto } from '../../../../../../common/dto';
import { Transform } from 'class-transformer';

export class FilterBenefitedDto extends SearchDto {
  @IsOptional()
  @IsUUID()
  country?: string;

  @IsOptional()
  @IsUUID()
  depa_birth?: string;

  @IsOptional()
  @IsUUID()
  depa_live?: string;

  @IsOptional()
  @IsUUID()
  district?: string;

  @IsOptional()
  @IsUUID()
  education?: string;

  @IsOptional()
  @IsUUID()
  ethnic?: string;

  @IsOptional()
  @IsUUID()
  housing?: string;

  @IsOptional()
  @IsUUID()
  lang_learned?: string;

  @IsOptional()
  @IsUUID()
  lang_native?: string;

  @IsOptional()
  @IsUUID()
  prov_birth?: string;

  @IsOptional()
  @IsUUID()
  prov_live?: string;

  @IsOptional()
  @IsEnum(Civil)
  civil?: Civil;

  @IsOptional()
  @IsEnum(Doctype)
  doc_type?: Doctype;

  @IsOptional()
  @IsEnum(Health)
  health?: Health;

  @IsOptional()
  @IsEnum(Level)
  pov_level?: Level;

  @IsOptional()
  @IsEnum(Living)
  house_status?: Living;

  @IsOptional()
  @IsEnum(Mode)
  mode?: Mode;

  @IsOptional()
  @IsEnum(Sex)
  sex?: Sex;

  @IsOptional()
  age?: number;

  @IsOptional()
  age_min?: number;

  @IsOptional()
  age_max?: number;

  @IsOptional()
  month?: string;

  @IsOptional()
  birthday?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  phone?: boolean;
}
