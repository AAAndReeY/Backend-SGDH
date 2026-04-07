import { Ability } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class CreatePermissionDto {
  @IsUUID()
  module_id: string;

  @IsEnum(Ability)
  ability: Ability;
}
