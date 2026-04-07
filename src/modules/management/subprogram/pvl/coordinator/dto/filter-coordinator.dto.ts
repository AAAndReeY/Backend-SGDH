import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { SearchDto } from '../../../../../../common/dto';
import { Transform } from 'class-transformer';
import { Sex } from '@prisma/client';

export class FilterCoordinatorDto extends SearchDto {
  @IsOptional()
  @IsUUID()
  coordinator_id?: string;

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
