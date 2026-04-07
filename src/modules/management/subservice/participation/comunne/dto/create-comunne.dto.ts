import { IsString } from 'class-validator';

export class CreateComunneDto {
  @IsString()
  name: string;
}
