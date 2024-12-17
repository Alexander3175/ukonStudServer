import { GamesService } from './games.service';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import CreateGameDto from './dto/create-game.dto';
import Game from './entities/games.entity';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: './uploads/',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

export const multerOptions = {
  storage,
  fileFilter: (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error('Unsupported file format'), false);
    }
    callback(null, true);
  },
};

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async create(
    @Body() gameDto: CreateGameDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Game> {
    const filePath = file ? `uploads/${file.filename}` : null;

    const newGame = await this.gamesService.createPost(gameDto, filePath);
    return newGame;
  }

  // Отримання гри за назвою
  @Get('game')
  async getGame(@Query('title') title: string): Promise<Game> {
    return this.gamesService.getPost(title);
  }

  // Отримання всіх ігор
  @Get('games')
  async getGames(): Promise<Game[]> {
    return this.gamesService.getPosts();
  }
}
