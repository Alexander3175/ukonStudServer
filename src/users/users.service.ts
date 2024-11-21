import { Injectable } from '@nestjs/common';
import Users from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<Users> {
    const response = this.userRepository.create(userDto);
    return this.userRepository.save(response);
  }

  async findUserId(id: number): Promise<Users> {
    const response = await this.userRepository.findOne({ where: { id } });
    if (!response) {
      throw new Error(`User with id ${id} not found`);
    }
    return { ...response, password: undefined };
  }
  async findUser(email: string): Promise<Users> {
    const response = await this.userRepository.findOne({ where: { email } });
    return response;
  }
  async getAllUsers(): Promise<Users[]> {
    const users = await this.userRepository.find();
    return users;
  }
}
