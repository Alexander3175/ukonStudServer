import { Injectable } from '@nestjs/common';
import Users from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/create-user.dto';
import Role, { UserRoles } from 'src/roles/entities/roles.entity';
import UpdateUserDto from './dto/update-user.dto';
import { IUser } from '../types/user';
import SteamUser from './entities/steamUser.entity';
import CreateSteamUserDto from './dto/create-steamUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(SteamUser)
    private readonly steamUserRepository: Repository<SteamUser>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {}

  async createUser(userDto: CreateUserDto, roles: Role[]): Promise<Users> {
    const response = this.userRepository.create({ ...userDto, roles });
    return await this.userRepository.save(response);
  }
  async createSteamUser(userSteamDto: CreateSteamUserDto): Promise<SteamUser> {
    const existingUser = await this.steamUserRepository.findOne({
      where: { steamId: userSteamDto.steamId },
    });

    if (existingUser) {
      throw new Error('User with this Steam ID already exists');
    }
    const response = this.steamUserRepository.create({
      steamId: userSteamDto.steamId,
      displayName: userSteamDto.displayName,
      photos: userSteamDto.photos.map((photo) => ({ value: photo })),
    });
    return await this.steamUserRepository.save(response);
  }

  async findUserId(id: number): Promise<Users> {
    const response = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!response) {
      console.error(`User with id ${id} not found`);
      throw new Error(`User with id ${id} not found`);
    }
    return { ...response, password: undefined };
  }
  async findBySteamId(steamId: string): Promise<SteamUser> {
    const response = await this.steamUserRepository.findOne({
      where: { steamId },
    });
    return response;
  }

  async findUser(email: string): Promise<Users> {
    const response = await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
    return response;
  }
  async getAllUsers(): Promise<Users[]> {
    const users = await this.userRepository.find({
      relations: ['roles'],
    });
    return users;
  }

  async saveRefreshToken(refreshToken: string, userId: number): Promise<IUser> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.refreshToken = refreshToken;
    return this.userRepository.save(user);
  }

  async addRoleToUser(userId: number, roleId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    const role = await this.rolesRepository.findOne({ where: { id: roleId } });

    if (!user || !role) {
      throw new Error('User or Role not found');
    }

    if (user.roles.some((r) => r.id === roleId)) {
      return;
    }

    user.roles.push(role);
    await this.userRepository.save(user);
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    user.roles = [];
    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    for (const role of updateUserDto.roles) {
      const roleEntity = await this.rolesRepository.findOne({
        where: { role: role as UserRoles },
      });
      console.log('Looking for role:', role);
      if (roleEntity) {
        user.roles.push(roleEntity);
      }
    }
    console.log('Saving updated user:', user);
    return this.userRepository.save(user);
  }
}
