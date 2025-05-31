import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsDateString,
} from 'class-validator';

export default class CreateSteamUserDto {
  @IsString()
  @IsNotEmpty()
  steamId: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsArray()
  @IsString({ each: true })
  photos: string[];

  @IsString()
  @IsOptional()
  country?: string;

  @IsOptional()
  @IsDateString()
  lastLogoffAt: string;
}
