import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import Users from 'src/users/entities/users.entity';
import Game from 'src/games/entities/games.entity';
import Role from 'src/roles/entities/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Users, Game, Role],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService],
})
export class DatabaseModule {}
