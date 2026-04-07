import { IsString } from 'class-validator';

export class CreateCoupleDto {
  @IsString()
  name: string;
}
