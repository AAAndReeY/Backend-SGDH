import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateParticipantDto {
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
  @IsString()
  observation?: string;

  @IsOptional()
  @IsString()
  assignee?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsUUID()
  workshop_id: string;
}
