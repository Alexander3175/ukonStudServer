import { BadRequestException, SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/roles/entities/roles.entity';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRoles[]) => {
  console.log('Roles decorator STARTED with roles:', roles);

  if (!roles || roles.length === 0) {
    throw new BadRequestException('Roles array cannot be empty');
  }
  console.log('Roles decorator called with roles:', roles);
  return SetMetadata(ROLES_KEY, roles);
};
