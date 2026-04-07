import { IsUUID } from 'class-validator';

export class CreateAccessDto {
  @IsUUID()
  permission_id: string;

  @IsUUID()
  role_id: string;
}
