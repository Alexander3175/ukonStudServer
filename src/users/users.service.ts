import { Injectable } from '@nestjs/common';
import Users from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/create-user.dto';
import Role from 'src/roles/entities/roles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async createUser(userDto: CreateUserDto, roles: Role[]): Promise<Users> {
    const response = this.userRepository.create({ ...userDto, roles });
    return await this.userRepository.save(response);
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

  async saveRefreshToken(refreshToken: string, id: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    user.refreshToken = refreshToken;
    return this.userRepository.save(user);
  }
}
