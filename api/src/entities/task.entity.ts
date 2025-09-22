import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';


@Entity('tasks')
export class Task {
@PrimaryGeneratedColumn()
id: number;


@Column()
title: string;


@Column({ type: 'text', nullable: true })
description?: string | null;


@Column({ default: 'Personal' })
category: string; // could be enum


@Column({ default: 'Open' })
status: string; // Backlog|Open|Done


@ManyToOne(() => Organization, { eager: true })
org: Organization;


@ManyToOne(() => User, { eager: true })
owner: User;


@CreateDateColumn()
createdAt: Date;


@UpdateDateColumn()
updatedAt: Date;
}