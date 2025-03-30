import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from 'src/users/entities/users.entity';
import Role from './entities/roles.entity';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { SharedModule } from 'src/shared/shared.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Role]), SharedModule, JwtModule],
  controllers: [RolesController],
  providers: [RolesService, RolesGuard, JwtService],
  exports: [RolesService, TypeOrmModule],
})
export class RolesModule {}
