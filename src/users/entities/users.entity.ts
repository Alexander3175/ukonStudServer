import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  banned: boolean;

  @Column()
  bannedReason: string;

  @Column({ default: false })
  isActive: boolean;
}
