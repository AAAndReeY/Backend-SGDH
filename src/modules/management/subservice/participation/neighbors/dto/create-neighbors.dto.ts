import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateNeighborsDto {
  @IsString()
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
  @IsDateString()
  birthday?: string;

  @IsString()
  pueblo: string;

  @IsString()
  charges_id: string;

  @IsString()
  comunne_id: string;
}
