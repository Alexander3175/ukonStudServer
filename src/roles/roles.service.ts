import { InjectRepository } from '@nestjs/typeorm';
import Role, { UserRoles } from './entities/roles.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async getRoleUser(role: UserRoles) {
    return this.roleRepository.findOne({ where: { role } });
  }

  async createRole(roleData: { role: UserRoles }) {
    const role = new Role();
    role.role = roleData.role;
    return this.roleRepository.save(role);
  }
}
