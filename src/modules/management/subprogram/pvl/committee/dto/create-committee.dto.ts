import { Route } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommitteeDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsOptional()
  @IsString()
  beneficiaries?: string;

  @IsOptional()
  @IsString()
  beneficiaries_foreign?: string;

  @IsOptional()
  @IsString()
  members?: string;

  @IsOptional()
  @IsString()
  handicappeds?: string;

  @IsOptional()
  @IsString()
  commune?: string;

  @IsUUID()
  coordinator_id: string;

  @IsUUID()
  couple_id: string;

  @IsUUID()
  town_id: string;

  @IsEnum(Route)
  route: Route;
}
