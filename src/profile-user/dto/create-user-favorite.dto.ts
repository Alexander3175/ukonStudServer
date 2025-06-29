import { IsInt, IsNotEmpty, IsEnum } from 'class-validator';
import { GameCategory } from '../types/game-category.enum';

export class CreateFavoriteDto {
  @IsInt()
  @IsNotEmpty()
  gameId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsEnum(GameCategory)
  @IsNotEmpty()
  category: GameCategory;
}
