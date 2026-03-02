import { Sex } from '@prisma/client';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class CreatePresidentDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsEnum(Sex)
  sex: Sex;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsString()
  birthday?: string;
}
