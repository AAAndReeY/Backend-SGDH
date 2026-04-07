import { Route } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { SearchDto } from '../../../../../../common/dto';

export class FilterCommitteeDto extends SearchDto {
  @IsOptional()
  @IsUUID()
  coordinator_id?: string;

  @IsOptional()
  @IsUUID()
  couple_id?: string;

  @IsOptional()
  @IsUUID()
  town_id?: string;

  @IsOptional()
  @IsEnum(Route)
  route?: Route;

  @IsOptional()
  @IsString()
  beneficiaries_min?: string;

  @IsOptional()
  @IsString()
  beneficiaries_max?: string;
}
