import { Format, Level } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateRegisteredDto {
  @IsString()
  fsu: string;

  @IsString()
  s100: string;

  @IsString()
  @Length(8)
  dni: string;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsString()
  members?: string;

  @IsDateString()
  birthday?: string;

  @IsUUID()
  box_id: string;

  @IsUUID()
  declaration_id: string;

  @IsUUID()
  enumerator_id: string;

  @IsUUID()
  urban_id: string;

  @IsEnum(Format)
  format: Format;

  @IsEnum(Level)
  level: Level;
}
