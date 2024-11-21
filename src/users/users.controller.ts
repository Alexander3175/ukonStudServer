import CreateUserDto from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('create')
  async createUser(@Body() userDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(userDto);
    return newUser;
  }
  @Get('users')
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }
}
