import { Controller, Get, Query } from '@nestjs/common';
import { UserRoles } from './entities/roles.entity';

import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get('getRole')
  getRoleUser(@Query('role') role: UserRoles) {
    return this.roleService.getRoleUser(role);
  }
}
