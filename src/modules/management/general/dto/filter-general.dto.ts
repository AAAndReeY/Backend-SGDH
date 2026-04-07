import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { SearchDto } from '../../../../common/dto';
import { Transform } from 'class-transformer';
import { Sex } from '@prisma/client';

export class FilterGeneralDto extends SearchDto {
  @IsOptional()
  module_name?: string;

  @IsOptional()
  @IsUUID()
  program_id?: string;

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
