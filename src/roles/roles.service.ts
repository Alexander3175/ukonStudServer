import { InjectRepository } from '@nestjs/typeorm';
import Role, { UserRoles } from './entities/roles.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async getRoleUser(role: UserRoles) {
    const roleUser = await this.roleRepository.findOne({ where: { role } });
    return roleUser;
  }
}
