import Role from 'src/roles/entities/roles.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
@Entity()
export default class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'boolean', default: false })
  banned: boolean;

  @Column({ type: 'text', nullable: true })
  bannedReason: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
