import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateGameDto from './dto/create-game.dto';
import Game from './entities/games.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
  ) {}

  async createPost(gameDto: CreateGameDto, filePath: string): Promise<Game> {
    const newGameData = {
      ...gameDto,
      file: filePath,
    };

    const newGame = this.gameRepository.create(newGameData);
    return await this.gameRepository.save(newGame);
  }

  async getPost(id: number): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  }

  async getPosts(): Promise<Game[]> {
    return await this.gameRepository.find();
  }
}
