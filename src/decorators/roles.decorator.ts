import { BadRequestException, SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/roles/entities/roles.entity';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRoles[]) => {
  if (!roles || roles.length === 0) {
    throw new BadRequestException('Roles array cannot be empty');
  }
  return SetMetadata(ROLES_KEY, roles);
};
