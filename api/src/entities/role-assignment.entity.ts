import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';
import { Role } from '../rbac/rbac';


@Entity('role_assignments')
export class RoleAssignment {
@PrimaryGeneratedColumn()
id: number;


@ManyToOne(() => User, { eager: true })
user: User;


@ManyToOne(() => Organization, { eager: true })
org: Organization;


@Column({ type: 'varchar' })
role: Role; // enum stored as string
}