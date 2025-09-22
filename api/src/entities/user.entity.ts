import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './organization.entity';


@Entity('users')
export class User {
@PrimaryGeneratedColumn()
id: number;


@Column({ unique: true })
email: string;


@Column()
passwordHash: string;


@Column({ default: '' })
displayName: string;


@ManyToOne(() => Organization, { eager: true })
org: Organization;


@Column({ default: true })
isActive: boolean;
}