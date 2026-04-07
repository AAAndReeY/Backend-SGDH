import { IsString } from 'class-validator';

export class CreateUrbanDto {
  @IsString()
  name: string;
}
