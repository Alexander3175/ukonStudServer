import { Module } from '@nestjs/common';
import { ProfileUserService } from './profile-user.service';
import { ProfileUserController } from './profile-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from 'src/users/entities/users.entity';
import Game from 'src/games/entities/games.entity';
import UserFavorites from './entities/user-favorites.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccessControlService } from 'src/shared/access-control.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserFavorites, Users, Game]), JwtModule],
  providers: [ProfileUserService, AccessControlService],
  controllers: [ProfileUserController],
})
export class ProfileUserModule {}
