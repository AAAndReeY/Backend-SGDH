import { Modality } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { SearchDto } from '../../../../../../common/dto';

export class FilterCenterDto extends SearchDto {
  @IsOptional()
  @IsUUID()
  president_id?: string;

  @IsOptional()
  @IsUUID()
  directive_id?: string;

  @IsOptional()
  @IsEnum(Modality)
  modality?: Modality;

  @IsOptional()
  @IsString()
  members_min?: string;

  @IsOptional()
  @IsString()
  members_max?: string;

  @IsOptional()
  @IsString()
  president_age_min?: string;

  @IsOptional()
  @IsString()
  president_age_max?: string;
}
