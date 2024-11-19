import { Injectable } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  static findUser: any;
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<Users> {
    const response = this.userRepository.create({ username, email, password });
    return this.userRepository.save(response);
  }

  async findUserId(id: number): Promise<Users> {
    const response = await this.userRepository.findOne({ where: { id } });
    if (!response) {
      throw new Error(`User with id ${id} not found`);
    }
    return { ...response, password: undefined };
  }
  async findUser(username: string): Promise<Users> {
    const response = this.userRepository.findOne({ where: { username } });
    return response;
  }
}
