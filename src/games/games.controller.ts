import { GamesService } from './games.service';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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
  @Get('games')
  async getGame(@Query('title') title: string): Promise<Game> {
    const response = await this.gamesService.getPost(title);
    return response;
  }
}
