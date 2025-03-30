import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRoles } from 'src/roles/entities/roles.entity';
import { RolesService } from 'src/roles/roles.service';
import CreateUserDto from 'src/users/dto/create-user.dto';
import { UsersService } from './../users/users.service';
import AuthPayloadDto from './dto/auth.dto';

interface IUser {
  id: number;
  username: string;
  roles: string[];
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
  ) {}

  async validateUser({ email, password }: AuthPayloadDto): Promise<any> {
    const user = await this.usersService.findUser(email);
    if (!user) {
      console.log('User not found');
      throw new UnauthorizedException('User not found');
    }
    return await this.checkPasswordUser(password, user);
  }

  private async checkPasswordUser(
    password: string,
    user: any,
  ): Promise<IUser | null> {
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      throw new UnauthorizedException('Invalid password');
    }

    return { id: user.id, username: user.username, roles: user.roles };
  }

  generateAccessToken(payload: IUser) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      algorithm: 'HS256',
    });
    console.log('SERVER:', accessToken);
    return accessToken;
  }
  generateRefreshTokens(payload: { id: number }) {
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      algorithm: 'HS256',
    });

    return refreshToken;
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verify(refreshToken);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { exp, ...payload } = decoded;

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
        algorithm: 'HS256',
      });
      console.log('Service', accessToken);
      return { accessToken, refreshToken };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async login(user: IUser): Promise<IAuthTokens> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshTokens(user);
    await this.usersService.saveRefreshToken(refreshToken, user.id);
    return { accessToken, refreshToken };
  }
  async registration(userDto: CreateUserDto): Promise<IAuthTokens> {
    try {
      const existingUser = await this.usersService.findUser(userDto.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const saltRounds = 12;
      const hashPassword = await bcrypt.hash(userDto.password, saltRounds);
      const defaultRole = await this.rolesService.getRoleUser(UserRoles.USER);
      const adminRole = await this.rolesService.getRoleUser(UserRoles.ADMIN);

      if (!defaultRole) {
        throw new Error('Default role not found');
      }
      const user = await this.usersService.createUser(
        { ...userDto, password: hashPassword },
        [defaultRole, adminRole],
      );
      const payload = {
        id: user.id,
        /*email: user.email,*/
        username: user.username,
        roles: user.roles.map((role) => role.role),
      };

      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshTokens({ id: user.id });

      await this.usersService.saveRefreshToken(refreshToken, user.id);

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Registration error:', error.message);
      throw new HttpException(
        'Registration failed: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkUserRoleExists(userId: number, roleId: number): Promise<boolean> {
    const user = await this.usersService.findUserId(userId);
    return user?.roles?.some((role) => role.id === roleId) ?? false;
  }
}
