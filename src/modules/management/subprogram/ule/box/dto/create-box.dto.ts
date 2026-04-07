import { IsNumber } from 'class-validator';

export class CreateBoxDto {
  @IsNumber()
  code_num: number;
}
