import { IsString, IsOptional } from 'class-validator';

export class CreateSupDto {
  @IsString()
  district: string;

  @IsString()
  populated: string;

  @IsString()
  lastname: string;

  @IsString()
  name: string;

  @IsString()
  dni: string;

  @IsOptional()
  @IsString()
  phone?: string;
}