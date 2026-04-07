import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { SearchDto } from '../../../../../../common/dto';
import { Transform } from 'class-transformer';
import { Sex } from '@prisma/client';

export class FilterDependentDto extends SearchDto {
  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsEnum(Sex)
  sex?: Sex;

  @IsOptional()
  @IsString()
  age?: string;

  @IsOptional()
  @IsString()
  age_min?: string;

  @IsOptional()
  @IsString()
  age_max?: string;

  @IsOptional()
  @IsString()
  month?: string;

  @IsOptional()
  @IsString()
  birthday?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  phone?: boolean;
}
