import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';

export function HasRoles(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(RolesGuard),
  );
}