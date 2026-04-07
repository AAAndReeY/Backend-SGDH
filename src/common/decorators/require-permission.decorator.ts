import { SetMetadata } from '@nestjs/common';
import { Ability } from '@prisma/client';

export const REQUIRE_PERMISSION_KEY = 'require_permission';

export const RequirePermission = (
  ability: Ability,
  moduleName: string,
) => SetMetadata(REQUIRE_PERMISSION_KEY, { ability, moduleName });