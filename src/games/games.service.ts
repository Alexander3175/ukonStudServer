import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Game from './entities/games.entity';
import { Repository } from 'typeorm';
import CreateGameDto from './dto/create-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
  ) {}

  async createPost(gameDto: CreateGameDto, filePath: string): Promise<Game> {
    const newGameData = {
      ...gameDto,
      file: filePath,
    };

    const newGame = this.gameRepository.create(newGameData);
    return await this.gameRepository.save(newGame);
  }

  async getPost(title: string): Promise<Game> {
    return await this.gameRepository.findOne({ where: { title } });
  }

  async getPosts(): Promise<Game[]> {
    return await this.gameRepository.find();
  }
}
