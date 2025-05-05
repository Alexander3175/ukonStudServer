import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
  Req,
  Res,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/roles/entities/roles.entity';
import CreateUserDto from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RolesGuard } from './guard/role.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res() res: Response) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    const { accessToken, refreshToken } = await this.authService.login(user);
    res.cookie('accessToken', accessToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.cookie('refreshToken', refreshToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.json({ accessToken });
  }

  @Post('registration')
  async registration(@Body() userDto: CreateUserDto) {
    const user = await this.authService.registration(userDto);
    return { message: 'User registered successfully', user };
  }

  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Get('search')
  async findUser(@Query('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findUserId(id);
    if (!user) {
      throw new UnauthorizedException('not found user');
    }
    return user;
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshAccessToken(refreshToken);

    const cookieOptions = (maxAge: number) => ({
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge,
    });

    res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie(
      'refreshToken',
      newRefreshToken,
      cookieOptions(7 * 24 * 60 * 60 * 1000),
    );

    return res.json({ accessToken });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.MODERATOR)
  @Get('me')
  async getProfile(@Req() req) {
    return req.user;
  }
}
