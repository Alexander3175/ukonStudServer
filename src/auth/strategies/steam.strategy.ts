import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor(private readonly configService: ConfigService) {
    super({
      returnURL: 'http://localhost:8080/steam/steam/return',
      realm: 'http://localhost:8080/',
      apiKey: configService.get<string>('STEAM_APIKEY'),
    });
  }

  async validate(identifier: string, profile: any): Promise<any> {
    const steamId = parseInt(profile.id, 10);
    if (isNaN(steamId)) {
      throw new Error('Invalid steamId');
    }
    return {
      steamId: profile.id,
      displayName: profile.displayName,
      photos: profile.photos,
    };
  }
}
