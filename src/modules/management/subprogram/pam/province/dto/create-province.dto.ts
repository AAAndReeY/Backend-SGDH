import { IsString, IsUUID } from 'class-validator';

export class CreateProvinceDto {
  @IsString()
  name: string;

  @IsUUID()
  country_id: string;

  @IsUUID()
  department_id: string;
}
