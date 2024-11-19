import { UsersService } from './users.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('create')
  async createUser(
    @Body() body: { username: string; email: string; password: string },
  ) {
    const newUser = await this.usersService.createUser(
      body.username,
      body.email,
      body.password,
    );
    return newUser;
  }
}
