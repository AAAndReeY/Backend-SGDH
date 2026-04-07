import { IsString, IsUUID } from 'class-validator';

export class CreateDistrictDto {
  @IsString()
  name: string;

  @IsUUID()
  country_id: string;

  @IsUUID()
  department_id: string;

  @IsUUID()
  province_id: string;
}
