import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import CreateUserDto from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RolesService } from 'src/roles/roles.service';
import { UserRoles } from 'src/roles/entities/roles.entity';

interface IUser {
  id: number;
  username: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
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

    return await this.checkPasswordUser(reqUser, user);
  }

  generateAccessToken(payload: IUser) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
    return accessToken;
  }
  generateRefreshTokens(payload: { id: number }) {
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return refreshToken;
  }

  async login(user: IUser) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshTokens(user);

    await this.usersService.saveRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken };
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
    console.log('UserRoles', UserRoles.USER);
    const defaultRole = await this.rolesService.getRoleUser(UserRoles.USER);

    const user = await this.usersService.createUser(
      {
        ...userDto,
        password: hashPassword,
      },
      [defaultRole],
    );

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map((role) => role.role),
    };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshTokens({ id: user.id });

    await this.usersService.saveRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken };
  }
}
