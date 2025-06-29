import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ISteamUser } from 'src/types/user';
import { UsersService } from 'src/users/users.service';
import {
  GetOwnedGamesResponse,
  PlayerAchievementsResponse,
  SteamService,
} from './steam.service';

@Controller('steam')
export class SteamController {
  constructor(
    private readonly authService: AuthService,
    private readonly steamService: SteamService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('steam'))
  @Get('steam')
  async steamLogin() {}

  @UseGuards(AuthGuard('steam'))
  @Get('steam/return')
  async steamReturn(@Req() req: Request, @Res() res: Response) {
    console.log('Steam профіль:', req.user);
    const steamProfile = req.user as ISteamUser;
    let userSteam = await this.usersService.findBySteamId(steamProfile.steamId);
    const summary = await this.steamService.getPlayerSummary(
      steamProfile.steamId,
    );
    if (!summary?.response?.players || summary.response.players.length === 0) {
      throw new Error('Player data is not available');
    }
    const player = summary.response.players[0];
    const country = player?.loccountrycode || null;
    const lastlogoff = player?.lastlogoff
      ? new Date(player.lastlogoff * 1000).toISOString()
      : null;
    if (!userSteam) {
      console.log('Користувач не знайдений, створюємо новий обліковий запис.');

      userSteam = await this.usersService.createSteamUser({
        steamId: steamProfile.steamId,
        displayName: steamProfile.displayName,
        photos: steamProfile.photos,
        country: country,
        lastLogoffAt: lastlogoff,
      });
    }
    const steamUser: ISteamUser = {
      steamId: userSteam.steamId,
      displayName: userSteam.displayName,
      photos: userSteam.photos.map((photo) => photo.value),
      country: country,
      lastLogoffAt: lastlogoff,
    };
    const token = this.authService.generateAccessToken(steamUser);
    console.log('Токен сгенеровано:', token);

    res.cookie('accessToken', token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.redirect('http://localhost:5173/profile');
  }

  @Get('steam/getGames/:steamId')
  async getSteamOwnedGames(
    @Param('steamId') steamId: string,
  ): Promise<GetOwnedGamesResponse | false> {
    if (!steamId) throw new BadRequestException('steamId is required');
    const response = await this.steamService.getOwnedGames(steamId);
    return response;
  }

  @Get('steam/achievements/:steamId/:appId')
  async getSteamPlayerAchievements(
    @Param('steamId') steamId: string,
    @Param('appId') appId: number,
  ): Promise<PlayerAchievementsResponse | false> {
    if (!steamId || !appId) throw new BadRequestException('required');
    const response = await this.steamService.getPlayerAchievements(
      steamId,
      appId,
    );
    return response;
  }

  @Get('games/achievements/:steamId')
  async getAllAchievements(@Param('steamId') steamId: string) {
    return this.steamService.getAllGamesWithAchievements(steamId);
  }
}
