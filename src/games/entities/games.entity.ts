import UserFavorites from 'src/profile-user/entities/user-favorites.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export default class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column()
  file: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  gameDeveloper: string;

  @Column({ type: 'date', nullable: true })
  releaseDate: string;

  @Column({ type: 'text', nullable: true })
  platform: string;

  @Column({ type: 'simple-array' })
  tags: string[];

  @OneToMany(() => UserFavorites, (favorite) => favorite.game)
  favorites: UserFavorites[];
}
