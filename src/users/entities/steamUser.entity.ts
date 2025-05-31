import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class SteamUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  steamId: string;

  @Column({ type: 'varchar', length: 255 })
  displayName: string;

  @Column({ type: 'json', nullable: true })
  photos: { value: string }[];

  @Column({ type: 'varchar', nullable: true })
  country: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lastLogoffAt: Date;

  @Column({ type: 'boolean', default: false })
  banned: boolean;

  @Column({ type: 'text', nullable: true })
  bannedReason: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string | null;
}
