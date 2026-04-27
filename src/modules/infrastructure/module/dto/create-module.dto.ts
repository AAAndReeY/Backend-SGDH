import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  program_id: string;
}
