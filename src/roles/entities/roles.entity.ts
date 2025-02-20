import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import Users from 'src/users/entities/users.entity';

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
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

  @Column({ name: 'value_role', type: 'text', nullable: true })
  valueRole: string;

  @ManyToMany(() => Users, (user) => user.roles)
  users: Users[];
}
