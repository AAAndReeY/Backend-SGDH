import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { SearchDto } from '../../../../../../common/dto';
import { Charges, Sex } from '@prisma/client';
import { Transform } from 'class-transformer';

export class FilterNeighborsDto extends SearchDto {
  @IsOptional()
  @IsUUID()
  charges?: string;

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
