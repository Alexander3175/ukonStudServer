import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileUserService } from './profile-user.service';
import { CreateFavoriteDto } from './dto/create-user-favorite.dto';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/roles/entities/roles.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('profile')
export class ProfileUserController {
  constructor(private readonly profileService: ProfileUserService) {}

  @Roles(UserRoles.USER)
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

  @Roles(UserRoles.USER)
  @Post('game/:id')
  removeGameFromProfile(@Param('id', ParseIntPipe) gameId: number) {
    return this.profileService.removeGame(gameId);
  }

  @Roles(UserRoles.USER)
  @Get('games/:userId')
  getGameToProfile(@Param('userId', ParseIntPipe) userId: number) {
    return this.profileService.getGames(userId);
  }
}
