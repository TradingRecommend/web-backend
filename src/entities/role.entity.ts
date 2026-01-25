import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './userRole.entity';

export enum Roles {
  ADMIN = 'admin',
  MEMBER = 'member',
  SYSTEMADMIN = 'systemadmin',
}

@Entity()
class Role {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.MEMBER,
    unique: true,
  })
  public name: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}

export default Role;
