import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import CreateGameDto from './dto/create-game.dto';
import Game from './entities/games.entity';
import { GamesService } from './games.service';
import { compressImage, multerOptions } from './lib/file';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/roles/entities/roles.entity';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Post('create')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async create(
    @Body() gameDto: CreateGameDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Game> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const filePath = `uploads/${file.filename}`;

    const compressedFilePath = await compressImage(filePath);

    const newGame = await this.gamesService.createPost(
      gameDto,
      compressedFilePath,
    );
    return newGame;
  }

  @Get('game/:id')
  async getGame(@Param('id', ParseIntPipe) id: number): Promise<Game> {
    return this.gamesService.getPost(id);
  }

  @Get('games')
  async getGames(): Promise<Game[]> {
    return this.gamesService.getPosts();
  }
}
