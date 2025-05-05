import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsPositive,
  IsDateString,
} from 'class-validator';

export default class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  gameDeveloper: string;

  @IsDateString()
  @IsNotEmpty()
  releaseDate: string;

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsOptional()
  @IsNotEmpty()
  file?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  rating?: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
