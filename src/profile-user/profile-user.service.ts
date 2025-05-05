import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import UserFavorites from './entities/user-favorites.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Users from 'src/users/entities/users.entity';
import Game from 'src/games/entities/games.entity';

@Injectable()
export class ProfileUserService {
  constructor(
    @InjectRepository(UserFavorites)
    private readonly favoriteRepository: Repository<UserFavorites>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}
  async addGameToProfile(
    gameId: number,
    userId: number,
    category: 'Want' | 'Playing' | 'Beaten' | 'Archived',
  ): Promise<UserFavorites> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!user || !game) {
      throw new Error('User or Game not found');
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: {
        user: { id: userId },
        game: { id: gameId },
        category: category,
      },
    });

    if (existingFavorite) {
      throw new Error('Game is already added to this category');
    }

    const newFavorite = this.favoriteRepository.create({
      user: { id: user.id },
      game: { id: game.id },
      category: category,
    });

    return this.favoriteRepository.save(newFavorite);
  }

  removeGame(gameId) {
    return gameId;
  }

  async getGames(userId: number): Promise<UserFavorites[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }
    return this.favoriteRepository.find({
      where: { user: { id: user.id } },
      relations: ['game'],
    });
  }
}
