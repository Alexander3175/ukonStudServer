import Game from 'src/games/entities/games.entity';
import Users from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class UserFavorites {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.favorites)
  @JoinColumn({ name: 'user' })
  user: Users;

  @ManyToOne(() => Game, (game) => game.favorites)
  @JoinColumn({ name: 'game' })
  game: Game;

  @Column({
    type: 'enum',
    enum: ['Want', 'Playing', 'Beaten', 'Archived'],
    default: 'Want',
  })
  category: 'Want' | 'Playing' | 'Beaten' | 'Archived';
}
