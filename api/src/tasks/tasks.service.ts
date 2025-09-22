import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Task } from '../entities/task.entity';
import { OrgsService } from '../orgs/orgs.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Role } from '../rbac/rbac';


interface JwtUser { sub: number; orgId: number; role: Role }


@Injectable()
export class TasksService {
constructor(@InjectRepository(Task) private repo: Repository<Task>, private orgs: OrgsService) {}


async create(user: JwtUser, dto: CreateTaskDto) {
const task = this.repo.create({
title: dto.title,
description: dto.description,
category: dto.category || 'Personal',
status: dto.status || 'Open',
org: { id: user.orgId } as any,
owner: { id: user.sub } as any,
});
return this.repo.save(task);
}


async listForUser(user: JwtUser, query?: { category?: string; ownerId?: number }) {
const orgIds = await this.orgs.orgAndChildIds(user.orgId);
return this.repo.find({
where: {
org: { id: In(orgIds) },
...(query?.category ? { category: query.category } : {}),
...(query?.ownerId ? { owner: { id: query.ownerId } as any } : {}),
},
order: { createdAt: 'DESC' },
});
}


async update(user: JwtUser, id: number, dto: UpdateTaskDto) {
const task = await this.repo.findOne({ where: { id } });
if (!task) throw new NotFoundException('Task not found');


// Admin+ and same org scope enforced by OrgScopeGuard; optional ownership check for strict flows
if (user.role === Role.Admin || user.role === Role.Owner) {
Object.assign(task, dto);
return this.repo.save(task);
}
throw new ForbiddenException('Insufficient role');
}


async remove(user: JwtUser, id: number) {
const task = await this.repo.findOne({ where: { id } });
if (!task) throw new NotFoundException('Task not found');


if (user.role === Role.Admin || user.role === Role.Owner) {
await this.repo.remove(task);
return { ok: true };
}
throw new ForbiddenException('Insufficient role');
}
}