import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(reqUser: {
    email: string;
    password: string;
  }): Promise<any> {
    const user = await this.usersService.findUser(reqUser.email);

    if (user && user.password === reqUser.password) {
      console.log('user and password valide');
      return { ...user, password: undefined };
    }

    return null;
  }

  login(user: { id: number; email: string; username: string }) {
    const payload = { id: user.id, email: user.email, username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  /*
  async registration(userDto: CreateUserDto) {
    const findUser = this.usersService.findUser(userDto.email);
    if (!findUser) {
      throw new BadRequestException('user with this email does not exist');
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
  }
  */
}
