import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
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

  @Column({ name: 'value_role', type: 'text', nullable: true })
  valueRole: string;

  @ManyToMany(() => Users, (user) => user.roles)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: Users[];
}
