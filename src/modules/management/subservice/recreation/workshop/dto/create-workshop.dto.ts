import { IsString } from 'class-validator';

export class CreateWorkshopDto {
  @IsString()
  name: string;
}
