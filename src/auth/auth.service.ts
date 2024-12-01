import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import CreateUserDto from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async checkPasswordUser(reqUser: { password: string }, user: any) {
    if (user && (await bcrypt.compare(reqUser.password, user.password))) {
      console.log('user and password valide');
      return { ...user, password: undefined };
    }
    return null;
  }

  async validateUser(reqUser: {
    email: string;
    password: string;
  }): Promise<any> {
    const user = await this.usersService.findUser(reqUser.email);
    console.log('findUSer: ', user);

    return await this.checkPasswordUser(reqUser, user);
  }

  generateTokens(payload: { id: number; email: string; username: string }) {
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(user: { id: number; email: string; username: string }) {
    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    await this.usersService.saveRefreshToken(tokens.refreshToken, user.id);

    return tokens;
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verify(refreshToken);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { exp, iat, ...payload } = decoded;

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });
      return { accessToken };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
  async registration(userDto: CreateUserDto) {
    const salt = 12;
    const hashPassword = await bcrypt.hash(userDto.password, salt);

    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });

    return user;
  }
}
