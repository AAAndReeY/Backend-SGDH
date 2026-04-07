import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateEnumeratorDto {
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
  @IsDateString()
  birthday?: string;
}
