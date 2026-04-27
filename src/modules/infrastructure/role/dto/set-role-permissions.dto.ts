import { Ability } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsUUID, ValidateNested } from 'class-validator';

export class PermissionItemDto {
  @IsUUID()
  module_id: string;

  @IsEnum(Ability)
  ability: Ability;
}

export class SetRolePermissionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionItemDto)
  permissions: PermissionItemDto[];
}
