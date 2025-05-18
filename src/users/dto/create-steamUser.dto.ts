import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export default class CreateSteamUserDto {
  @IsNotEmpty()
  steamId: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsArray()
  @IsString({ each: true })
  photos: string[];
}
