import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateDirectiveDto {
  @IsString()
  @IsNotEmpty()
  resolution: string;

  @IsDateString()
  start_at: string;

  @IsDateString()
  end_at: string;
}
