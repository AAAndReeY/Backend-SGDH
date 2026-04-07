import { Modality } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCenterDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  members?: number;

  @IsOptional()
  @IsString()
  members_male?: number;

  @IsOptional()
  @IsString()
  members_female?: number;

  @IsString()
  situation: string;

  @IsString()
  latitude: number;

  @IsString()
  longitude: number;

  @IsUUID()
  president_id: string;

  @IsUUID()
  directive_id: string;

  @IsEnum(Modality)
  modality: Modality;
}
