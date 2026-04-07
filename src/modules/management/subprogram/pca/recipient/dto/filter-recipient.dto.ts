import { Modality, Sex, Social } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { SearchDto } from '../../../../../../common/dto';
import { Transform } from 'class-transformer';

export class FilterRecipientDto extends SearchDto {
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
  @IsEnum(Modality)
  modality?: Modality;

  @IsOptional()
  @IsEnum(Sex)
  sex?: Sex;

  @IsOptional()
  @IsEnum(Social)
  social?: Social;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  phone?: boolean;
}
