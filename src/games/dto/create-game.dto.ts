import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsPositive,
} from 'class-validator';

export default class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

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
