import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateCoordinatorDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;
}
