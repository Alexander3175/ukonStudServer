import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UsersService } from './users.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import UpdateUserDto from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log('Received update data:', updateUserDto);
    const user = await this.usersService.findUserId(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    try {
      return await this.usersService.updateUser(id, updateUserDto);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating user data');
    }
  }
}
