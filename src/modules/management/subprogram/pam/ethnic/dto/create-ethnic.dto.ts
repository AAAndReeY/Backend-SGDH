import { IsString } from 'class-validator';

export class CreateEthnicDto {
  @IsString()
  name: string;
}
