import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  UseGuards,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
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
}
