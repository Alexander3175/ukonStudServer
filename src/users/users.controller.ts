import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UsersService } from './users.service';
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }
  @Put(':id/roles')
  async updateUserRoles(
    @Param('id') id: number,
    @Body('roles') roles: string[],
  ) {
    return this.usersService.updateUserRoles(id, roles);
  }
}
