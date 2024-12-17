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
import CreateUserDto from 'src/users/dto/create-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from './guard/role.guard';
import { UserRoles } from 'src/roles/entities/roles.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    const accessToken = this.authService.login(user);
    return accessToken;
  }

  @Post('registration')
  async registration(@Body() userDto: CreateUserDto) {
    const user = await this.authService.registration(userDto);
    return { message: 'User registered successfully', user };
  }
  @Roles(UserRoles.USER)
  @UseGuards(RolesGuard)
  @Get('search')
  async findUser(@Body() body: { id: number }) {
    const user = await this.usersService.findUserId(body.id);
    if (!user) {
      throw new UnauthorizedException('not found user');
    }
    return user;
  }
  @Roles(UserRoles.USER)
  @UseGuards(RolesGuard)
  @Post('refresh')
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshAccessToken(body.refreshToken);
  }
}
