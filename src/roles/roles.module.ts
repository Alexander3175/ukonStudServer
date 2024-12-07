import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from 'src/users/entities/users.entity';
import Role from './entities/roles.entity';
import { RolesGuard } from 'src/auth/guard/role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Role])],
  controllers: [RolesController],
  providers: [RolesService, RolesGuard],
  exports: [RolesService, TypeOrmModule],
})
export class RolesModule {}
