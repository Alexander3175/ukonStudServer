import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  UseGuards,
  Body,
  UnauthorizedException,
  Get,
  Req,
} from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    const user = await req.user;
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const accessToken = this.authService.login(user);
    return { accessToken };
  }
  /*
  @Post('registration')
  async registration(@Body() userDto: CreateUserDto) {
    const user = await this.authService.registration(userDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.authService.login(user.id, user.username);
    return { accessToken };
  }
  */
  @Get('search')
  async findUser(@Body() body: { id: number }) {
    const user = await this.usersService.findUserId(body.id);
    if (!user) {
      throw new UnauthorizedException('not found user');
    }
    return user;
  }
}
