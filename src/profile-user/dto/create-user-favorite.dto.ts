import { IsInt, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateFavoriteDto {
  @IsInt()
  @IsNotEmpty()
  gameId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsEnum(['Want', 'Playing', 'Beaten', 'Archived'])
  @IsNotEmpty()
  category: 'Want' | 'Playing' | 'Beaten' | 'Archived';
}
