import {
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSupDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  dni: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  district: string;

  @IsString()
  populated: string;
}