import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findUser(username);
    if (user && user.password === password) {
      return { ...user, password: undefined };
    }
    return null;
  }

  login(id: number, username: string) {
    const payload = { id: id, username: username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async findUserId(payload: any): Promise<any> {
    const { id, username } = payload;
    return { id, username };
  }
}
