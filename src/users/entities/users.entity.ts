import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  password: string;

  @Column({ default: false })
  banned: boolean;

  @Column({ nullable: true })
  bannedReason: string;

  @Column({ default: false })
  isActive: boolean;
}
