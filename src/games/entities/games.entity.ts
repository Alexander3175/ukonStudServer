import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'simple-array' })
  tags: string[];
}
