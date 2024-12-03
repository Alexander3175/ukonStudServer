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

  async createPost(gameDto: CreateGameDto): Promise<Game> {
    console.log(gameDto);

    const newGame = this.gameRepository.create(gameDto);
    return await this.gameRepository.save(newGame);
  }
}
