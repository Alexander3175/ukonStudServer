import { BadRequestException, SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]) => {
  if (!roles.length) {
    throw new BadRequestException('Roles array cannot be empty');
  }
  return SetMetadata(ROLES_KEY, roles);
};
