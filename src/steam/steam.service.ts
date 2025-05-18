import { Injectable } from '@nestjs/common';

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
  achievements?: Achievement[];
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
@Injectable()
export class SteamService {
  async getOwnedGames(steamId: string): Promise<GetOwnedGamesResponse | false> {
    if (steamId) {
      try {
        const games = await fetch(
          `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=1596086D47BC0D48FFBB1A699FB537CA&steamid=${steamId}&include_appinfo=1&format=json`,
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
          `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key=1596086D47BC0D48FFBB1A699FB537CA&steamid=${steamId}&appid=${appId}`,
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
}
