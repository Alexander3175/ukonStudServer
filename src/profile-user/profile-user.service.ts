import { Injectable, NotFoundException } from '@nestjs/common';
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
  async updateGameCategory(
    gameId: number,
    userId: number,
    newCategory: 'Want' | 'Playing' | 'Beaten' | 'Archived',
  ) {
    const gameUser = await this.favoriteRepository.findOne({
      where: {
        game: { id: gameId },
        user: { id: userId },
      },
      relations: ['game', 'user'],
    });

    if (!gameUser) {
      throw new NotFoundException('Game not found for this user.');
    }

    gameUser.category = newCategory;
    return this.favoriteRepository.save(gameUser);
  }
}
