import { GamesService } from './games.service';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import CreateGameDto from './dto/create-game.dto';
import Game from './entities/games.entity';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() gameDto: CreateGameDto): Promise<Game> {
    const newPost = await this.gamesService.createPost(gameDto);
    return newPost;
  }
}
