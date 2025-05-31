import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { GameCategory } from '../types/game-category.enum';

export class UpdateCategoryDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsEnum(GameCategory)
  @IsNotEmpty()
  category: GameCategory;
}
