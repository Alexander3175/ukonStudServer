import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UsersService } from './users.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }
}
