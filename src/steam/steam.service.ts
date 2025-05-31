import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GetOwnedGamesResponse {
  response: {
    game_count: number;
    games: RawGame[];
  };
}

export interface RawGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  img_icon_url?: string;
  img_logo_url?: string;
  has_community_visible_stats?: boolean;
  rtime_last_played?: number;
}
export interface Achievement {
  apiname: string;
  achieved: number;
  unlocktime: number;
}
export interface PlayerAchievementsResponse {
  playerstats: {
    steamID: string;
    gameName: string;
    achievements: Achievement[];
    success: boolean;
  };
}

export interface GameSchemaResponse {
  game: {
    gameName: string;
    availableGameStats?: {
      achievements?: {
        name: string;
        displayName: string;
        description: string;
        icon: string;
        icongray: string;
      }[];
    };
  };
}

export interface PlayerSummaryResponse {
  response: {
    players: {
      steamid: string;
      personaname: string;
      avatarfull: string;
      lastlogoff: number;
      loccountrycode?: string;
      timecreated?: number;
    }[];
  };
}
@Injectable()
export class SteamService {
  private readonly STEAM_APIKEY: string;
  constructor(private readonly configService: ConfigService) {
    this.STEAM_APIKEY = configService.get<string>('STEAM_APIKEY');
  }
  async getOwnedGames(steamId: string): Promise<GetOwnedGamesResponse | false> {
    if (steamId) {
      try {
        const games = await fetch(
          `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${this.STEAM_APIKEY}&steamid=${steamId}&include_appinfo=1&format=json`,
        );

        if (games.ok) {
          const data = (await games.json()) as GetOwnedGamesResponse;
          console.log(data);
          return data;
        }
      } catch (error) {
        console.log('GetGames Steam:', error);
      }
    } else {
      return false;
    }
  }
  async getPlayerAchievements(
    steamId: string,
    appId: number,
  ): Promise<PlayerAchievementsResponse> {
    if (steamId && appId) {
      try {
        const achievements = await fetch(
          `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key=${this.STEAM_APIKEY}&steamid=${steamId}&appid=${appId}`,
        );
        if (!achievements.ok) {
          throw new Error(`Steam returned ${achievements.status}`);
        }
        const data = (await achievements.json()) as PlayerAchievementsResponse;
        return data;
      } catch (error) {
        console.log('GetGames Steam:', error);
        return null;
      }
    }
  }

  async getAllGamesWithAchievements(steamId: string) {
    const gamesData = await this.getOwnedGames(steamId);
    if (!gamesData || !gamesData.response?.games) return [];

    const games = gamesData.response.games;
    const result = [];

    for (const game of games) {
      if (!game.has_community_visible_stats) continue;
      const [achievementsData, schemaData] = await Promise.all([
        this.getPlayerAchievements(steamId, game.appid),
        this.getSchemaForGame(game.appid),
      ]);

      const achievements = achievementsData?.playerstats?.achievements || [];
      const schema = schemaData?.game?.availableGameStats?.achievements || [];

      const mapped = achievements.map((ach) => {
        const meta = schema.find((s) => s.name === ach.apiname);
        return {
          apiname: ach.apiname,
          achieved: ach.achieved,
          unlocktime: ach.unlocktime,
          displayName: meta?.displayName || ach.apiname,
          description: meta?.description || '',
          icon: ach.achieved ? meta?.icon : meta?.icongray,
        };
      });
      result.push({
        appid: game.appid,
        name: game.name,
        achievements: mapped,
        unlocked: mapped.filter((a) => a.achieved).length,
        total: schema.length,
      });
    }
    return result;
  }

  async getSchemaForGame(appId: number): Promise<GameSchemaResponse | null> {
    try {
      const res = await fetch(
        `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${this.STEAM_APIKEY}&appid=${appId}`,
      );
      if (!res.ok) throw new Error('Steam schema error');
      const data = (await res.json()) as { game: GameSchemaResponse['game'] };
      return data;
    } catch (error) {
      console.error('getSchemaForGame error:', error);
      return null;
    }
  }

  async getPlayerSummary(
    steamId: string,
  ): Promise<PlayerSummaryResponse | null> {
    try {
      const res = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${this.STEAM_APIKEY}&steamids=${steamId}`,
      );
      if (!res.ok) throw new Error('Steam API error');
      const data = (await res.json()) as PlayerSummaryResponse;
      return data;
    } catch (error) {
      console.error('getPlayerSummary error:', error);
      return null;
    }
  }
}
