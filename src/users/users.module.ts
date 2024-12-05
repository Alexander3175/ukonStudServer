import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from './entities/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import Role from 'src/roles/entities/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Role]),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
