import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UsersService } from './users.service';
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import UpdateUserDto from './dto/update-user.dto';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log('Received update data:', updateUserDto);
    return this.usersService.updateUser(id, updateUserDto);
  }
}
