import { IsString, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  name: string;

  @IsUUID()
  country_id: string;
}
