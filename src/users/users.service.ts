import { Injectable } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
type User = {
  userId: number;
  username: string;
  password: string;
};
@Injectable()
export class UsersService {
  static findUser: any;
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findUser(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
