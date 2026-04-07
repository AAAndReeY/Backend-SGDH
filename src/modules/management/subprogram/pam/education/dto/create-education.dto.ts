import { IsString } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  name: string;
}
