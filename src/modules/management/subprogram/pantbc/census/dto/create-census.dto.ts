import { IsString } from 'class-validator';

export class CreateCensusDto {
  @IsString()
  name: string;
}
