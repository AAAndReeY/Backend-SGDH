import { IsString } from 'class-validator';

export class CreateChargesDto {
  @IsString()
  name: string;
}
