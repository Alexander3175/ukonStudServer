import { Module } from '@nestjs/common';
import { SteamController } from './steam.controller';
import { SteamService } from './steam.service';
import SteamUser from 'src/users/entities/steamUser.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SteamUser]), UsersModule, AuthModule],
  controllers: [SteamController],
  providers: [SteamService],
})
export class SteamModule {}
