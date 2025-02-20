import { Module } from '@nestjs/common';
import { ProfileUserService } from './profile-user.service';
import { ProfileUserController } from './profile-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from 'src/users/entities/users.entity';
import Game from 'src/games/entities/games.entity';
import UserFavorites from './entities/user-favorites.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserFavorites, Users, Game])],
  providers: [ProfileUserService],
  controllers: [ProfileUserController],
})
export class ProfileUserModule {}
