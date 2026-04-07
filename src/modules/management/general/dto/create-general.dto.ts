import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateGeneralDto {
  @IsUUID()
  citizen_id: string;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  dni: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;
}
