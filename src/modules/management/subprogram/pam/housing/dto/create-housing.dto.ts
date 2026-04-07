import { IsString } from 'class-validator';

export class CreateHousingDto {
  @IsString()
  name: string;
}
