import { Controller, Get, InternalServerErrorException } from '@nestjs/common';

import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get('getAllRoles')
  async getAllRoles() {
    try {
      const roles = await this.roleService.getAllRoles();

      if (!roles || roles.length === 0) {
        throw new InternalServerErrorException('No roles found');
      }

      return roles;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching roles',
      );
    }
  }
}
