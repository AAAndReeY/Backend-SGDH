import { IsString } from 'class-validator';

export class CreateDeclarationDto {
  @IsString()
  code: string;
}
