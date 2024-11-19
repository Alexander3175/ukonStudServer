import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  UseGuards,
  Body,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.authService.login(user.id, user.username);
    return { accessToken };
  }
  @Get('search')
  async findUser(@Body() body: { id: number }) {
    const user = await this.usersService.findUserId(body.id);
    if (!user) {
      throw new UnauthorizedException('not found user');
    }
    return user;
  }
}
