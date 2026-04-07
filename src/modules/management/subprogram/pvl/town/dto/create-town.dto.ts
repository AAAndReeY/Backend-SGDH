import { IsString } from 'class-validator';

export class CreateTownDto {
  @IsString()
  name: string;
}
