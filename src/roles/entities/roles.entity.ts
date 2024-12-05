import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import Users from 'src/users/entities/users.entity';

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}
@Entity()
export default class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
    nullable: false,
  })
  role: UserRoles;

  @Column({ type: 'text', nullable: true })
  valueRole: string;

  @OneToMany(() => Users, (user) => user.role)
  users: Users[];
}
