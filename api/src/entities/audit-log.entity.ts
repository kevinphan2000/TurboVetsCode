import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';


@Entity('audit_logs')
export class AuditLog {
@PrimaryGeneratedColumn()
id: number;


@ManyToOne(() => User, { eager: true, nullable: true })
user?: User | null;


@ManyToOne(() => Organization, { eager: true, nullable: true })
org?: Organization | null;


@Column()
action: string; // e.g., task:create


@Column()
resource: string; // e.g., Task


@Column({ nullable: true })
resourceId?: string | null;


@Column({ default: 'success' })
outcome: string; // success|denied|error


@CreateDateColumn()
at: Date;
}