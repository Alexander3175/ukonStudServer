import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProfileUserService } from './profile-user.service';
import { CreateFavoriteDto } from './dto/create-user-favorite.dto';

@Controller('profile')
export class ProfileUserController {
  constructor(private readonly profileService: ProfileUserService) {}
  @Post('addGame')
  async addGameToProfile(@Body() createFavoriteDto: CreateFavoriteDto) {
    const result = await this.profileService.addGameToProfile(
      createFavoriteDto.gameId,
      createFavoriteDto.userId,
      createFavoriteDto.category,
    );
    return {
      favoriteId: result.id,
    };
  }

  @Post('game/:id')
  removeGameToProfile() {
    return this.profileService.removeGame();
  }

  @Get('games/:userId')
  getGameToProfile(@Param('userId', ParseIntPipe) userId: number) {
    return this.profileService.getGames(userId);
  }
}
